#!/usr/bin/env sh
# run the export for env vars
echo "Running the script to set env vars"
# shellcheck disable=SC2039
cd ..
source /workspace/env-init.sh

echo "Running the DB setup script"
node /workspace/db-setup/db-setup.js

cd /workspace
