import os
from setuptools import setup
from setuptools.command.install import install
from setuptools.command.develop import develop

from jupyter_core.paths import jupyter_config_dir

SERVER_EXT_CONFIG = "c.NotebookApp.server_extensions.append('nbexamples.handlers')"

class InstallCommand(install):
    def run(self):
        # Install Python package, possibly containing a kernel extension
        install.run(self)
        _install_server_extension()


class DevelopCommand(develop):
    def run(self):
        develop.run(self)
        _install_server_extension()


def _install_server_extension():
    # Install Notebook server extension
    fn = os.path.join(jupyter_config_dir(), 'jupyter_notebook_config.py')
    with open(fn, 'r+') as fh:
        lines = fh.read()
        if SERVER_EXT_CONFIG not in lines:
            fh.seek(0, 2)
            fh.write('\n')
            fh.write(SERVER_EXT_CONFIG)


setup(
    name='nbexamples',
    version='0.1',
    packages=['nbexamples'],
    cmdclass={
        'install': InstallCommand,
        'develop': InstallCommand
    }
)
