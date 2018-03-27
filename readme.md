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

Select the latest version of Python 2 to install.

## Install Flask

View instructions on how to install Flask here: [http://flask.pocoo.org/docs/0.12/installation/](http://flask.pocoo.org/docs/0.12/installation/)

## Install R

Select a mirror to install R here:
[https://cran.r-project.org/mirrors.html](https://cran.r-project.org/mirrors.html)


## Install rpy2

Run `pip install rpy2==2.8.6` to install rpy2.  
An older version is required as rpy2 does not support Python 2 anymore.  

See also: [http://rpy.sourceforge.net/rpy2/doc-dev/html/overview.html](http://rpy.sourceforge.net/rpy2/doc-dev/html/overview.html)

## Install the ltm package


Open R (type `r` from the commandline) and type:  

`install.packages("ltm")`

Select a mirror to install the ltm package and all dependencies.  
Type `quit()` to exit R.

## Download this project

Create a new directory and enter it via the commandline.  

Extract [the downloaded files](https://github.com/genericity/test-analysis/archive/master.zip) to this directory.

## Set up databases:

Open Python (type `python` from the commandline) and type:  
  
`from db import init_db`  
`init_db()`

This sets up the SQLite database.  
Type `quit()` to exit Python.

## Run the tool

Type into the command-line:

`export FLASK_APP=index.py`  
`python -m flask run`

Unit tests can be run by navigating to the test directory (`cd test`) and running:  
`python -m unittest -v test_test`