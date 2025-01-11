#!/usr/bin/env bash

set -e

POSTGRES_USER="dev"
POSTGRES_PASSWORD="default"
POSTGRES_VERSION=14
POSTGRES_CLUSTER="dev"

create_dev_user() {
  cat << EOF
  CREATE USER ${POSTGRES_USER} WITH PASSWORD '${POSTGRES_PASSWORD}';
  GRANT ALL PRIVILEGES ON DATABASE "postgres" TO ${POSTGRES_USER};
EOF
}

linux_setup_postgres() {
  sudo apt install postgresql
  sudo usermod -aG "$( stat -c "%G" . )" postgres
  sudo -u postgres pg_createcluster ${POSTGRES_VERSION} ${POSTGRES_CLUSTER}
  sudo systemctl start "postgresql@${POSTGRES_VERSION}-${POSTGRES_CLUSTER}"
  sudo -u postgres psql -c "$( create_dev_user )"
}

# Setup local Postgresql DB
if [[  "${OSTYPE}" == "linux-gnu" ]]; then
  if ! pg_lsclusters ${POSTGRES_VERSION} ${POSTGRES_CLUSTER} &> /dev/null; then
    linux_setup_postgres
  fi

elif [[ "${OSTYPE}" == "darwin" ]]; then
  echo "Sorry Jeff -- figure out the Postgres Mac install on your own :D"
fi

echo "${POSTGRES_USER}:${POSTGRES_PASSWORD}"
