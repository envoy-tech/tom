#!/usr/bin/env bash

set -e

if [ "$#" -ne 4 ]; then
  echo "Usage: $0 <username> <password> <postgres_version> <posgres_cluster_name>"
  exit 1;
fi

echo "Setting up local PostgreSQL database..."

create_dev_user() {
  cat << EOF
  CREATE USER $1 WITH PASSWORD '$2';
  GRANT ALL PRIVILEGES ON DATABASE "postgres" TO $1;
  ALTER USER $1 WITH SUPERUSER;
EOF
}

linux_setup_postgres() {
  sudo apt install postgresql
  sudo usermod -aG "$( stat -c "%G" . )" postgres
  sudo -u postgres pg_createcluster "$3" "$4"
  sudo systemctl start "postgresql@$3-$4"
  sudo -u postgres psql -c "$( create_dev_user "$1" "$2")"
}

# Setup local Postgresql DB
if [[  "${OSTYPE}" == "linux-gnu" ]]; then
  if ! pg_lsclusters "${POSTGRES_VERSION}" "${POSTGRES_CLUSTER}" &> /dev/null; then
    linux_setup_postgres "$1" "$2" "$3" "$4"
  fi

elif [[ "${OSTYPE}" == "darwin" ]]; then
  echo "Sorry Jeff -- figure out the Postgres Mac install on your own :D"
fi
