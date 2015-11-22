# nbexamples

This is a Jupyter extension that shows a list of example notebooks that users
can easily preview and copy for their own use.

The targeted application is a JupyterHub deployment, where it is useful to
distribute a collection of curated examples or templates.

* A new "examples" page lists notebooks from some configured directory, showing
  a title and description gleaned from notebook metadata. For each notebook
  there are two buttons, "preview" and "use".
* Clicking "preview" shows a static HTML version of the notebook, optionally
  including some example output.
* Clicking "use" opens a dialog box to prompt user for a filename or filepath
  (relative to their home dir).

### URL scheme

* `/tree#examples` is the index page
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
server extension to the jupyter notebook config file:

```python
c.NotebookApp.server_extensions.append('nbexamples.handlers')
```

### Configuration

Set the location of the example notebooks to be distributed by adding this
line to the jupyter notebook config file:

```python
c.Examples.reviewed_example_dir = '/etc/reviewed_examples'
c.Examples.unreviewed_example_dir = '/etc/unreviewed_examples`
```

The intention is that `unreviewed_examples` is a globally-writable directory.
Notebooks should be reviewed and promoted to `reviewed_examples` or
eventually purged.

### Related Work

This project is indebted to the [nbgrader](nbgrader.readthedocs.org) project,
a related (and much more complex!) application.
