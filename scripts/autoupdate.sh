# For this to run, this needs to be placed in a safe location and the following needs to be added to the crontab.
# (call sudo crontab -e)
# 0 12 * * * root /location/of/autoupdate.sh
# This runs this file at 12.00 each day.

# Environment-specific values for connecting to Github from behind a proxy.
export http_proxy=http://squid.auckland.ac.nz:3128/
export https_proxy=https://squid.auckland.ac.nz:3128/
export ftp_proxy=http://squid.auckland.ac.nz:3128/

# Remove existing files, except for the ini file which contains environment-specific values.
cd ~/flask_project/
# Move the ini file to a same location.
mv test-analysis/flask_project.ini flask_project.ini
rm -rf ~/flask_project/test-analysis

# Clone the project from Github.
git clone https://github.com/genericity/test-analysis
# Move the ini file back.
mv flask_project.ini test-analysis/flask_project.ini

# Make the log file and run the run-script.
cd ~/flask_project/test-analysis
python3 init_db.py
touch flask_project.log
chmod +x run.sh
./run.sh