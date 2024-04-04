.PHONY: clean install uninstall wheel

PYTHON_PACKAGE = tom_optimization_engine
TOM_BUILD_TYPE ?= Release
WHEEL_DIR = ../wheels

wheel:
	python setup.py bdist_wheel --build-type=$(TOM_BUILD_TYPE) -d $(WHEEL_DIR)

clean:
	rm -rf _skbuild/ src/$(PYTHON_PACKAGE).egg-info/ .pytest_cache/ _build_lint/
	find . -name '__pycache__' -exec rm -fr {} +

install: uninstall
	pip install -U $(WHEEL_DIR)/$(PYTHON_PACKAGE)*.whl

uninstall:
	pip uninstall -y $(PYTHON_PACKAGE)

test:
	CTEST_OUTPUT_ON_FAILURE=1 ctest --test-dir $(CURDIR)/_skbuild/**/cmake-build
	pytest -v -s tests/test_*.py

lambda-image:
	./lambda/build-image.sh

lambda-image-push:
	./lambda/push-image.sh

test-lambda-image:
	./tests/test-lambda-image.sh

lambda-publish:
	./lambda/publish-lambda.sh
