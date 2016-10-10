# CHANGELOG

## v0.3.0

* [#22](https://github.com/danielballan/nbexamples/pull/22) Added notebook owner and example modification date/time to the examples list
* [#21](https://github.com/danielballan/nbexamples/pull/21) Changed behavior to never overwrite an existing user notebook by generating a unique filename suffix
* [#21](https://github.com/danielballan/nbexamples/pull/21) Changed Save Copy As dialog to default to the name of the example notebook
* [#20](https://github.com/danielballan/nbexamples/pull/20) Changed UX to show the Examples tab when sharing instead of a preview of the notebook
* [#20](https://github.com/danielballan/nbexamples/pull/20) Fixed handling of #examples hash when returning to the file browser page
* [#20](https://github.com/danielballan/nbexamples/pull/20) Fixed new tab opening when deleting
* [#20](https://github.com/danielballan/nbexamples/pull/20) Fixed handling of Jupyter's configured link target setting
* [#23](https://github.com/danielballan/nbexamples/pull/23) Fixed proliferation of dialog elements in the DOM by using a singleton

## v0.2.0

* [#12](https://github.com/danielballan/nbexamples/pull/12) Updated to work with Jupyter Notebook 4.2 and up
* [#12](https://github.com/danielballan/nbexamples/pull/12) Fixed handling of URLs with spaces and other characters that need encoding
* [#12](https://github.com/danielballan/nbexamples/pull/12) Fixed Save Copy As dialog lingering after submission
* [#12](https://github.com/danielballan/nbexamples/pull/12) Fixed Use destination directory (~ -> notebook dir)
* [#12](https://github.com/danielballan/nbexamples/pull/12) Added instructions for development

## v0.1.0

* First release
