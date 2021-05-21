#!/bin/sh

# Local .env
if [ -f .env ]; then
  echo "Loading Environment vars..."
  # shellcheck disable=SC2046
  export $(grep -v '^#' .env | xargs)    # Load Environment Variables
  echo "DB HOST:"
  echo $PGHOST
fi

#set -a
## shellcheck disable=SC2039
## shellcheck disable=SC1090
#source <(cat .env | sed -e '/^#/d;/^\s*$/d' -e "s/'/'\\\''/g" -e "s/=\(.*\)/='\1'/g")
#set +a

if [ "$DATABASE" = "postgres" ]
then
  echo "Waiting for postgres..."

  while ! nc -z $PGHOST $PGPORT; do
    sleep 0.1
  done

  echo "PostgreSQL started"
fi

echo "Calling the ENV init script..."
. /workspace/env-init.sh
echo "Calling the DB init script..."
. /workspace/bin/db-init.sh

echo "DONE with DB init... starting the project"

exec "$@"
