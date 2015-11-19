"""Tornado handlers for nbexamples example list web service."""

import os
import subprocess as sp
import json
import glob

from tornado import web

import nbformat
from notebook.utils import url_path_join as ujoin
from notebook.base.handlers import IPythonHandler
from traitlets import Unicode
from traitlets.config import LoggingConfigurable

static = os.path.join(os.path.dirname(__file__), 'static')

class ExampleList(LoggingConfigurable):

    example_dir = Unicode('', config=True, help='Directory where the nbexample commands should be run, relative to NotebookApp.notebook_dir')

    def _example_dir_default(self):
        return self.parent.notebook_dir

    def list_examples(self):
        filepaths = glob.glob(os.path.join(self.example_dir, '*.ipynb'))
        examples = [{'filepath': fp} for fp in filepaths]
        for example in examples:
            node = nbformat.read(example['filepath'], nbformat.NO_CONVERT)
            example['metadata'] = node.metadata
        return examples

    def fetch_example(self, example_id, dest):
        abs_source = os.path.join(self.example_dir, example_id)
        abs_dest = os.path.join(os.path.expanduser('~'), dest)
        # Make a copy of the example notebook, stripping output.
        p = sp.Popen(['jupyter', 'nbconvert', abs_source,
                      '--Exporter.preprocessors=["nbexamples.strip_output.StripOutput"]',
                      '--to', 'notebook', '--output', abs_dest],
                     stdout=sp.PIPE, stderr=sp.PIPE, cwd=self.example_dir)
        output, err = p.communicate()
        print(err)
        retcode = p.poll()
        if retcode != 0:
            raise RuntimeError('jupyter nbconvert exited with code {}'.format(
                               retcode))

    def preview_example(self, example_id):
        fp = os.path.join(self.example_dir, example_id)
        if not os.path.isfile(fp):
            raise web.HTTPError(404, "Example not found: %s" % example_id)
        p = sp.Popen(['jupyter', 'nbconvert', '--to', 'html', '--stdout', fp],
                     stdout=sp.PIPE, stderr=sp.PIPE, cwd=self.example_dir)
        output, _ = p.communicate()
        retcode = p.poll()
        if retcode != 0:
            raise RuntimeError('nbconvert exited with code {}'.format(retcode))
        return output.decode()


class BaseExampleHandler(IPythonHandler):

    @property
    def manager(self):
        return self.settings['example_list_manager']


class ExampleListHandler(BaseExampleHandler):

    @web.authenticated
    def get(self):
        self.finish(json.dumps(self.manager.list_examples()))


class ExampleActionHandler(BaseExampleHandler):

    @web.authenticated
    def get(self, action):
        example_id = self.get_argument('example_id')
        if action == 'preview':
            self.finish(self.manager.preview_example(example_id))
        elif action == 'fetch':
            dest = self.get_argument('dest')
            self.manager.fetch_example(example_id, dest)
            self.redirect(ujoin(self.base_url, 'notebooks', dest))


#-----------------------------------------------------------------------------
# URL to handler mappings
#-----------------------------------------------------------------------------


_example_action_regex = r"(?P<action>fetch|preview)"

default_handlers = [
    (r"/examples", ExampleListHandler),
    (r"/examples/%s" % _example_action_regex, ExampleActionHandler),
]


def load_jupyter_server_extension(nbapp):
    """Load the nbserver"""
    webapp = nbapp.web_app
    webapp.settings['example_list_manager'] = ExampleList(parent=nbapp)
    base_url = webapp.settings['base_url']
    ExampleActionHandler.base_url = base_url  # used to redirect after fetch
    webapp.add_handlers(".*$", [
        (ujoin(base_url, pat), handler)
        for pat, handler in default_handlers
    ])
