# nbexamples

This is a Jupyter extension that shows a list of example notebooks that users
can easily preview and copy for their own use.

* A new "examples" page lists notebooks from some configured directory, showing
  a title and description gleaned from notebook metadata. For each notebook
  there are two buttons, "preview" and "use".
* Clicking "preview" shows a static HTML version of the notebook, optionally
  including some example output.
* Clicking "use" opens a dialog box to prompt user for a filename or filepath
  (relative to their home dir).

### URL scheme

* `/examples` is the index page
* `/examples/preview?nb=xpcs.ipynb` shows a static HTML preview (similar to
  nbviewer)
* `/examples/fetch?nb=xpcs.ipynb&dest=my-xpcs.ipynb` makes a "clean" copy of
  the notebook in the user's home directory, stripping out the example output

### Requirements

* nbconvert
* nbformat

### Installation

```
python setup.py install
```

In addition to installing the `nbexamples` packages, the installation adds a
server extension to the jupyter notebook config file.

### Related Work

This project is indebted to the [nbgrader](nbgrader.readthedocs.org) project,
a related (and much more complex!) application.
