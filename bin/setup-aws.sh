#!/usr/bin/env bash

set -e

AWS_VERSION=$(aws --version)

if [[ $AWS_VERSION ]]; then
  aws configure sso

  case "${SHELL}" in
    *bash)
      echo -e "\n# Setup environment for AWS CLI" >> ~/.bashrc
      echo "export AWS_PROFILE=dev" >> ~/.bashrc
      ;;
    *zsh)
      echo -e "\n# Setup environment for AWS CLI" >> ~/.zshrc
      echo "export AWS_PROFILE=dev" >> ~/.zshrc
      ;;
    *)
      echo "Unable to configure AWS CLI on unsupported shell ${SHELL}"
      exit 1
      ;;
  esac

  # Reload shell to apply changes
  exec "${SHELL}"

else
  echo "Please install the AWS CLI v2 from https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
fi
