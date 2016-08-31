NAME:=nbexamples-dev
SHELL:=/bin/bash

# Steps to setup the extension in a conda dev environment
define EXT_SETUP
	pip install -e . && \
	jupyter nbextension install --py nbexamples --sys-prefix --symlink --overwrite && \
	jupyter nbextension enable nbexamples --py --sys-prefix && \
	jupyter serverextension enable --py nbexamples --sys-prefix
endef

help:
# http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

clean: ## remove build artifacts from source tree
	@-rm -rf build
	@-rm -rf dist
	@-rm -rf *.egg-info
	@-rm -rf __pycache__
	@-find . -name __pycache__ -exec rm -rf {} \;

dev-env: ## create / update a conda environment for dev
	@conda env create $(NAME) || conda env update $(NAME)
	@source activate $(NAME) && $(EXT_SETUP)

notebook: ## run a notebook server in the environment
	@mkdir -p /tmp/$(NAME)/reviewed
	@mkdir -p /tmp/$(NAME)/unreviewed
	@jupyter notebook \
		--notebook-dir=/tmp/$(NAME) \
		--Examples.reviewed_example_dir=/tmp/$(NAME)/reviewed \
		--Examples.unreviewed_example_dir=/tmp/$(NAME)/unreviewed

