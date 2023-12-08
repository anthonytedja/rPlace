#!/bin/bash

process_count=$(ps aux | grep "node dist/serve/main.js" | wc -l)
# 1 line = only grep is detected (grep always finds itself)
# 2 lines = grep is detected + node is detected

if [ $process_count -eq 1 ]; then
  echo "running app"
  (cd /home/ec2-user/csc409a3; node dist/serve/main.js)
else
  echo "app is already running"
fi