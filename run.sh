sudo service nginx stop
sudo fuser -k 3033/tcp
sudo uwsgi flask_project.ini
sudo service nginx start
tail -f flask_project.log