#!/bin/bash

echo Deploying in production mode.

cd ../../

echo "If this is the first time deploying in production mode:
Edit your /etc/nginx/nginx.conf file. Inside the http {} block, add these lines.

server {
                listen 80;
                location / {
                        include uwsgi_params;
                        uwsgi_pass 127.0.0.1:3033;
                        proxy_read_timeout 3600;
                        proxy_http_version 1.1;
                        proxy_set_header Connection "";

                }
}
"

read -n 1 -s -r -p "Press any key to continue"

touch flask_project.log
local search = /home/user/flask_project/test-analysis
local replace = $(pwd)
sed -i 's/${search}/${replace}/g' flask_project.ini

chmod +x run.sh
./run.sh