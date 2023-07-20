.PHONY: clean install uninstall wheel

PYTHON_PACKAGE = tom-common
WHEEL_DIR = ../wheels

wheel:
	pip wheel . -w $(WHEEL_DIR) --no-deps

clean:
	rm -rf build/ *.egg-info/

install: uninstall
	pip install -U -e .

uninstall:
	pip uninstall -y $(PYTHON_PACKAGE)
