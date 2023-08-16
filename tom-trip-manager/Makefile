.PHONY: clean install uninstall wheel

PYTHON_PACKAGE = tom-trip-manager
WHEEL_DIR = ../aux/build/wheels

wheel:
	pip wheel . -w $(WHEEL_DIR) --no-deps

clean:
	rm -rf build/ *.egg-info/

install: uninstall
	pip install -U -e .

uninstall:
	pip uninstall -y $(PYTHON_PACKAGE)
