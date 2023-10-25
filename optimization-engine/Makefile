.PHONY: clean install uninstall wheel

PYTHON_PACKAGE = tom_optimization_engine
TOM_BUILD_TYPE ?= Debug

wheel:
	python setup.py --build-type=$(TOM_BUILD_TYPE) bdist_wheel

wheel-install:
	pip uninstall -y $(PYTHON_PACKAGE) && pip install -U ./dist/*.whl

clean:
	rm -rf _skbuild/ dist/ $(PYTHON_PACKAGE).egg-info/ .pytest_cache/ _build_lint/
	find . -name '__pycache__' -exec rm -fr {} +

install:
	$(MAKE) wheel
	$(MAKE) wheel-install

uninstall:
	pip uninstall -y $(PYTHON_PACKAGE)

test:
	CTEST_OUTPUT_ON_FAILURE=1 ctest --test-dir $(CURDIR)/_skbuild/**/cmake-build
