#!/bin/bash

echo Deploying in production mode.

cd ../../

echo "
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

chmod +x run.sh
./run.sh