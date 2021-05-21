#!/usr/bin/env sh

# set up the DB
echo "Setting up the DB tables"
psql postgres -h localhost -d postgres -f /workspace/db-setup/sql/cars_tabls.sql

# run the export for env vars
echo "Running the script to set env vars"
# shellcheck disable=SC2039
cd ..
source /workspace/env-init.sh

echo "Running the DB setup script"
node /workspace/db-setup/db-setup.js

cd /workspace
