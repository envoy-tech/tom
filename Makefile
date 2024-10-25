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

# TODO: Figure out how to incorporate the optimization engine tests
test:
	pytest -v -s -n $(shell nproc) --ignore=optimization_engine

lambda-images:
	# $(MAKE) -C $(OPTIMIZATION_ENGINE) lambda-image
	$(MAKE) -C $(TRIP_MANAGER) lambda-image
