#!/bin/bash
# Generic Startup file that would run all the scripts in bin directory
# Copy any of the scripts that should run within the container at startup
# Make sure those scripts in bin directory start in the background.
HOST=$(hostname)
mkdir -p /var/log/log_volume/${APP}/${HOST}
sudo ln -s /var/log/log_volume/${APP}/${HOST} /var/log/workspace
sudo chown -R workspace:workspace /var/log/workspace
cd ${HOME}
func=${FUNC:-QUEUE}
if [ $func == "PUSH" ]; then
  bash $PUSH_SCRIPT
else
  if [ "$DEV" == "1" ]; then
    for file in bin/*
    do
      bash ${file}
    done
    tail -f /dev/null
  else
    for file in bin/*
    do
      bash ${file}
    done
  fi
fi
#tail -f /dev/null

