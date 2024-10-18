#!/usr/bin/env bash

set -e

if ! aws sts get-caller-identity > /dev/null 2>&1;
then
  echo "You are not logged into AWS.  Login and re-run the script"
  exit 1
fi

set -exu

AWS_PROFILE="${AWS_PROFILE:-dev}"
echo "Using AWS profile: ${AWS_PROFILE}"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

# Run the remaining commands from the directory where the script resides
pushd "${SCRIPT_DIR}"

# Destroy all Terraform resources whenever this script terminates. Note: This
# exit trap will not trigger if the shell script is terminated with SIGKILL.
terraform_destroy() {
    # Destroy Terraform resources
    terraform destroy -auto-approve
}
trap 'terraform_destroy' EXIT

# Create resources with Terraform
terraform init -upgrade
terraform apply -auto-approve

# Get ECR password
AWS_ECR_PASSWORD="$(aws ecr get-login-password --region us-east-1 --profile "${AWS_PROFILE}")"

# Run the Ansible playbook to build the TOM build container
ansible-playbook -u ec2-user -i ./inventory \
 --extra-vars "aws_ecr_password=${AWS_ECR_PASSWORD}" \
 ./build-container-playbook.yml
