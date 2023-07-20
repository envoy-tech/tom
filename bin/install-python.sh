#!/usr/bin/env bash

set -e

export TOM_PYTHON_VERSION="3.10.5"

pyenv_config() {
    cat << 'EOF'
# Setup environment for pyenv
export PYENV_ROOT="${HOME}/.pyenv"
command -v pyenv > /dev/null || export PATH="${PYENV_ROOT}/bin:${PATH}"
eval "$(pyenv init --path)"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
EOF
}

# Install or update pyenv, as necessary
if command -v pyenv; then
    pyenv update
else
    curl https://pyenv.run | bash
    # add pyenv configuration to shell
    case "${SHELL}" in
        *bash)
            echo -e "\n$(pyenv_config)" >> ~/.bashrc
            echo -e "\n$(pyenv_config)" >> ~/.bash_profile
            source ~/.bashrc
            ;;
        *zsh)
            echo -e "$(pyenv_config)\n\n$(cat ~/.zshrc)" > ~/.zshrc
            export PATH="${HOME}/.pyenv/bin:${PATH}"
            eval "$(pyenv init --path)"
            eval "$(pyenv init -)"
            eval "$(pyenv virtualenv-init -)"
            ;;
        *)
            echo "Unable to configure pyenv on unsupported shell ${SHELL}"
            exit 1
            ;;
    esac
fi

# Install Python version for TOM
pyenv install -s "${TOM_PYTHON_VERSION}"
pyenv rehash