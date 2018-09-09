# Installation guide

This project is a web application developed that allows administrators of multi-choice question tests an opportunity to identify items that violate psychometric test industry norms for good item characteristics (i.e. too hard, too easy, negative discrimination).

Users are able to upload student response and answer data, and this software will:
*  automatically produce student and question locations, and calculate statistics such as percentage correct and discrimination using IRT analysis
*  recommend and allow users to remove poor questions
*  visualize students and questions in a dot-plot
*  select grade boundaries based on the distribution of students and questions
*  export data to a format suitable for upload into Canvas

This allows users to reduce poor identifiers of true student ability and so increase the effectiveness of test questions.


## Install Python

View instructions on how to install Python for your operating system here: [https://www.python.org/downloads/](https://www.python.org/downloads/).

Select the latest version of Python 3 to install.

## Install pip

Ensure you can run pip from the command-line.

View instructions on how to install pip here: [https://packaging.python.org/tutorials/installing-packages/](https://packaging.python.org/tutorials/installing-packages/#ensure-you-can-run-pip-from-the-command-line)

For Ubuntu, python-pip is in the universe repository.

```
sudo apt-get install software-properties-common
sudo apt-add-repository universe
sudo apt-get update
sudo apt-get install python3-pip
```

## Install Flask

View instructions on how to install Flask here: [http://flask.pocoo.org/docs/0.12/installation/](http://flask.pocoo.org/docs/0.12/installation/)

## Install R

Select a mirror to install R here:
[https://cran.r-project.org/mirrors.html](https://cran.r-project.org/mirrors.html)

For Ubuntu, you can try these commands.

To remove R:
```
sudo apt-get remove r-base-core
```

To install R:

```
sudo add-apt-repository "deb http://cran.rstudio.com/bin/linux/ubuntu $(lsb_release -sc)/"
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E084DAB9
sudo add-apt-repository ppa:marutter/rdev
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install r-base
```

## Install rpy2

Run `pip3 install rpy2` to install rpy2.  .  

See also: [http://rpy.sourceforge.net/rpy2/doc-dev/html/overview.html](http://rpy.sourceforge.net/rpy2/doc-dev/html/overview.html)

Ubuntu users may also wish to try `sudo apt install python-rpy2`.

## Install the MIRT package

Type `git clone https://github.com/genericity/mirt` to download the contents of the repository at https://github.com/genericity/mirt to a folder called `mirt`.

Open R (type `r` or `R` from the commandline) and type:  

```
remove.packages('mirt') # In case you have installed MIRT already.
install.packages('devtools')
library('devtools')
install_local('mirt')
```

You may have to install additional packages for devtools to be installed. For Ubuntu, type these commands to install the appropriate libraries.
```
sudo apt-get install libssl-dev
sudo apt-get install libcurl4-openssl-dev
```

Type `quit()` to exit R. Type `y` to save your changes.

## Download this project

Create a new directory and enter it via the commandline.  

Extract [the downloaded files](https://github.com/genericity/test-analysis/archive/master.zip) to this directory.

## Set up databases:

Open Python (type `python` from the commandline) and type:  
  
`from index import init_db`  
`init_db()`

This sets up the SQLite database.  
Type `quit()` to exit Python.

## Run the tool (development mode)

To run in development mode, type into the command-line:

`export FLASK_APP=index.py`  
`python -m flask run`

To run while logging errors, type into the commandline:  
  
`sudo python index.py &`  or, to log:   
`sudo python index.py >> log.txt 2>&1 &`  

## Deploying (production mode)

The current stable version on the server is served using [uWSGI](https://uwsgi-docs.readthedocs.io/en/latest/) and [NGINX](https://www.nginx.com/). There are other options to deploy Flask projects, but any version chosen should be multiprocessed to avoid concurrency issues while using R and rpy2.

## Tests
  
Unit tests can be run by navigating to the test directory (`cd test`) and running:  
`python -m unittest -v test_test`

### Install the LTM package (For running tests only)

Open R (type `r` or `R` from the commandline) and type:  

`install.packages("ltm")`

Select a mirror to install the ltm package and all dependencies.  
Type `quit()` to exit R. Type `y` to save your changes.

## Why do you have two libraries checked in?

There's a bug in one of them ([Annotation plugin for Chart.js](https://github.com/chartjs/chartjs-plugin-annotation)) that prevents objects from being redrawn. So, without fixing the bug (as I've done locally here), it's impossible to have the sliders you see on the graph be draggable.

The other library ([Chart.js](https://github.com/chartjs)) doesn't allow custom callbacks after drawing elements onto the graph. So, without adding a way to hook into the rendering cycle, it's impossible to draw the labels on the central y-axis on the graph. 
