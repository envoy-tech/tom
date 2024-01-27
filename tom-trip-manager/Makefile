.PHONY: clean install uninstall wheel

PYTHON_PACKAGE = tom-trip-manager
WHEEL_DIR = ../wheels

PYTEST_LOGLEVEL ?= info

wheel:
	pip wheel . -w $(WHEEL_DIR) --no-deps

clean:
	rm -rf build/ *.egg-info/

install: uninstall
	pip install -U -e .

uninstall:
	pip uninstall -y $(PYTHON_PACKAGE)

lambda-image:
	./lambda/build-image.sh

lambda-image-push:
	./lambda/push-image.sh

test-lambda-image:
	./tests/test-lambda-image.sh

lambda-publish:
	./lambda/publish-lambda.sh
