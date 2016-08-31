import versioneer
from setuptools import setup

setup_args = dict(
    name='nbexamples',
    version=versioneer.get_version(),
    cmdclass=versioneer.get_cmdclass(),
    license='BSD',
    platforms=['Jupyter Notebook'],
    packages=[
        'nbexamples'
    ],
    include_package_data=True,
    install_requires=[
        'notebook>=4.2.0',
        'nbconvert',
        'nbformat'
    ]
)

if __name__ == '__main__':
    setup(**setup_args)
