#!/usr/bin/env bash

set -e

# Setup AWS CLI or prompt user to install it
source ./setup-aws.sh

# Setup Pyenv and install Python version for TOM
source ./setup-python.sh
