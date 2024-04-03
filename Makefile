.PHONY: clean install uninstall wheels test

WHEEL_DIR = wheels

COMMON = tom-common
OPTIMIZATION_ENGINE = optimization_engine
TRIP_MANAGER = tom-trip-manager

clean:
	rm -rf $(WHEEL_DIR)
	$(MAKE) -C $(COMMON) clean
	$(MAKE) -C $(OPTIMIZATION_ENGINE) clean
	$(MAKE) -C $(TRIP_MANAGER) clean

install: wheels
	$(MAKE) -C $(COMMON) install
	$(MAKE) -C $(OPTIMIZATION_ENGINE) install
	$(MAKE) -C $(TRIP_MANAGER) install

uninstall:
	$(MAKE) -C $(COMMON) uninstall
	$(MAKE) -C $(OPTIMIZATION_ENGINE) uninstall
	$(MAKE) -C $(TRIP_MANAGER) uninstall

wheels: clean
	mkdir $(WHEEL_DIR)
	$(MAKE) -C $(COMMON) wheel
	$(MAKE) -C $(OPTIMIZATION_ENGINE) wheel
	$(MAKE) -C $(TRIP_MANAGER) wheel

test:
	pytest -v \
		-s \
		-n $(shell nproc) \
		--import-mode=append \
		--log-cli-level=$(PYTEST_LOGLEVEL) \
		--log-cli-format="%(levelname)-10s [%(asctime)s] %(message)s (%(name)s:%(lineno)s)" \
		--log-cli-date-format="%Y-%m-%d %H:%M:%S" \
		--ignore=optimization_engine

lambda_images:
	# $(MAKE) -C $(OPTIMIZATION_ENGINE) lambda_image
	$(MAKE) -C $(TRIP_MANAGER) lambda_image
