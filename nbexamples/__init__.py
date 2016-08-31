from ._version import get_versions
__version__ = get_versions()['version']
del get_versions


def _jupyter_server_extension_paths():
    """Returns server extension metadata to notebook 4.2+"""
    return [{
        'module': 'nbexamples.handlers'
    }]


def _jupyter_nbextension_paths():
    """Returns frontend extension metadata to notebook 4.2+"""
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'nbexamples',
        'require': 'nbexamples/submit-example-button'
    }, {
        'section': 'tree',
        'src': 'static',
        'dest': 'nbexamples',
        'require': 'nbexamples/main'
    }]
