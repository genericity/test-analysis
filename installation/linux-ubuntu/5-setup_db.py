import os,sys,inspect
currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)
grandparentdir = os.path.dirname(parentdir)
sys.path.insert(0,parentdir)
sys.path.insert(0,grandparentdir)

print("Setting up database.")

import index
index.init_db()
os.rename("database.db", os.path.join(grandparentdir, "database.db"))