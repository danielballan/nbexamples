# nbexamples

This is a Jupyter extension that shows a list of example notebooks that users
can easily preview and copy for their own use.

The targeted application is a JupyterHub deployment, where it is useful to
distribute a collection of curated examples or templates and make it possible
for hub uses to quickly share examples.

A new "examples" page lists notebooks from some configured directory, showing
a title and description gleaned from notebook metadata. For each notebook
there are two buttons, "preview" and "use".

Examples are sorted into "reviewed," curated examples and "unreviewed"
examples.

![Adds an Examples Tab](docs/examples-tab.png)

Clicking "preview" shows a static HTML version of the notebook, optionally
including some example output.

Clicking "use" opens a dialog box to prompt user for a filename or filepath
(relative to their home dir).

![Fetch](docs/fetch-dialog.png)

On the notebook toolbar, a new "share as example" button (the "paper airplane"
icon at right) submits the notebook to the list of "unreviewed" examples.

![Share as Example button](docs/share-button.png)

Optionally, you can add a custom title and summary (as shown in the example)
by editing the notebook metadata (Edit > Edit Notebook Metadata) and adding
"title" and "summary" to the JSON. If these are not present, nbexamples
displays the notebook's filepath instead.

### Requirements

* notebook >=4.2
* nbconvert
* nbformat

### Installation

Assuming you want to install the extension into a conda environment, virtual 
environment, or system-wide environment:

```
python setup.py install
jupyter nbextension install --py nbexamples --sys-prefix
jupyter nbextension enable --py nbexamples --sys-prefix
jupyter serverextension enable --py nbexamples --sys-prefix
```

### Configuration

Set the location of the example notebooks to be distributed on the command
line when starting Jupyter Notebook:

```bash
jupyter notebook --Examples.reviewed_example_dir='/opt/jupyter/examples/reviewed' \
                 --Examples.unreviewed_example_dir='/opt/jupyter/examples/unreviewed'
```

Alternatively, set these values in a `jupyter_notebook_config.py` file in one 
of the config directories listed when you run `jupyter --paths`.

```python
c.Examples.reviewed_example_dir = '/opt/jupyter/examples/reviewed'
c.Examples.unreviewed_example_dir = '/opt/jupyter/examples/unreviewed'
```

The intention is that `unreviewed_examples` is a globally-writable directory.
Notebooks should be reviewed and promoted to a read-only `reviewed_examples` or 
eventually purged.

### Development

If you have conda installed, run the following to create and use an isolated
dev environment.

```bash
make dev-env
source activate nbexamples-dev
make notebook
```

Any changes you make to the static assets (JS, CSS) are immediately available on
browser refresh. Any changes you make to the Python require a notebook server 
restart.

### URL scheme

* `/tree#examples` is the Examples tab on the user's home page
* `/examples` returns JSON that populates the contents of that tab
* `/examples/preview?example_id=xpcs.ipynb` shows a static HTML preview (similar to
  nbviewer)
* `/examples/fetch?example_id=xpcs.ipynb&dest=my-xpcs.ipynb` makes a "clean" copy of
  the notebook in the user's home directory, stripping out the example output
* `/examples/submit?example_id=my-new-example.ipynb` copies a notebook into a shared, globally-writable directory of "unreviewed" examples

### Related Work

This project is indebted to the [nbgrader](nbgrader.readthedocs.org) project,
a related (and much more complex!) application.
