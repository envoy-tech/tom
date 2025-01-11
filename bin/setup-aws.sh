#!/usr/bin/env bash

set -e

echo "Setting up AWS dev profile..."

if ! aws --version &> /dev/null; then
  echo "Please install the AWS CLI v2 from https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
fi

if [[ $(aws configure list-profiles | grep dev) != "dev" ]]; then
  aws configure sso
  case "${SHELL}" in
    *bash)
      echo -e "\n# Setup environment for AWS CLI" >> ~/.bashrc
      echo "export AWS_PROFILE=dev" >> ~/.bashrc
      source ~/.bashrc
      ;;
    *zsh)
      echo -e "\n# Setup environment for AWS CLI" >> ~/.zshrc
      echo "export AWS_PROFILE=dev" >> ~/.zshrc
      source ~/.zshrc
      ;;
    *)
      echo "Unable to configure AWS CLI on unsupported shell ${SHELL}"
      exit 1
      ;;
  esac
fi
