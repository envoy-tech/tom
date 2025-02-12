#!/usr/bin/env bash

set -e

NVM_VERSION="0.40.1"
TOM_NODE_VERSION="22.13.0"

bash_nvm_config() {
  cat << 'EOF'
cdnvm() {
    command cd "$@" || return $?
    nvm_path="$(nvm_find_up .nvmrc | command tr -d '\n')"

    # If there are no .nvmrc file, use the default nvm version
    if [[ ! $nvm_path = *[^[:space:]]* ]]; then

        declare default_version
        default_version="$(nvm version default)"

        # If there is no default version, set it to `node`
        # This will use the latest version on your machine
        if [ $default_version = 'N/A' ]; then
            nvm alias default node
            default_version=$(nvm version default)
        fi

        # If the current version is not the default version, set it to use the default version
        if [ "$(nvm current)" != "${default_version}" ]; then
            nvm use default
        fi
    elif [[ -s "${nvm_path}/.nvmrc" && -r "${nvm_path}/.nvmrc" ]]; then
        declare nvm_version
        nvm_version=$(<"${nvm_path}"/.nvmrc)

        declare locally_resolved_nvm_version
        # `nvm ls` will check all locally-available versions
        # If there are multiple matching versions, take the latest one
        # Remove the `->` and `*` characters and spaces
        # `locally_resolved_nvm_version` will be `N/A` if no local versions are found
        locally_resolved_nvm_version=$(nvm ls --no-colors "${nvm_version}" | command tail -1 | command tr -d '\->*' | command tr -d '[:space:]')

        # If it is not already installed, install it
        # `nvm install` will implicitly use the newly-installed version
        if [ "${locally_resolved_nvm_version}" = 'N/A' ]; then
            nvm install "${nvm_version}";
        elif [ "$(nvm current)" != "${locally_resolved_nvm_version}" ]; then
            nvm use "${nvm_version}";
        fi
    fi
}

alias cd='cdnvm'
cdnvm "$PWD" || exit
EOF
}

zsh_nvm_config() {
  cat << 'EOF'
autoload -U add-zsh-hook

load-nvmrc() {
  local nvmrc_path
  nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version
    nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$(nvm version)" ]; then
      nvm use
    fi
  elif [ -n "$(PWD=$OLDPWD nvm_find_nvmrc)" ] && [ "$(nvm version)" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}

add-zsh-hook chpwd load-nvmrc
load-nvmrc
EOF
}

# Install or update NVM as necessary
if command -v nvm > /dev/null 2>&1; then
  echo "NVM already installed"
else
  curl -o- "https://raw.githubusercontent.com/nvm-sh/nvm/v${NVM_VERSION}/install.sh" | bash
  echo "${TOM_NODE_VERSION}" > "${TOM_ROOT}/.nvmrc"
  ln -sf "${TOM_ROOT}/.nvmrc" "${TOM_UI_DIR}/.nvmrc"
  case "${SHELL}" in
    *bash)
      echo -e "\n$(bash_nvm_config)" >> ~/.bashrc
      source ~/.bashrc
      ;;
    *zsh)
      echo -e "$(zsh_nvm_config)\n\n$(cat ~/.zshrc)" > ~/.zshrc
      ;;
    *)
      echo "Unable to automatically source shell profile"
      echo "Source manually once script for NVM lines to take effect and rerun"
      exit 1;
      ;;
  esac
fi
