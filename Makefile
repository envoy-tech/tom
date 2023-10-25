.PHONY: clean install uninstall wheels

WHEEL_DIR = wheels

COMMON = tom-common
OPTIMIZATION_ENGINE = optimization-engine
TRIP_MANAGER = tom-trip-manager

clean:
	rm -rf $(WHEEL_DIR)
	$(MAKE) -C $(COMMON) clean
	$(MAKE) -C $(OPTIMIZATION_ENGINE) clean
	$(MAKE) -C $(TRIP_MANAGER) clean

install:
	$(MAKE) -C $(COMMON) install
	# $(MAKE) -C $(OPTIMIZATION_ENGINE) install
	$(MAKE) -C $(TRIP_MANAGER) install

uninstall:
	$(MAKE) -C $(COMMON) uninstall
	$(MAKE) -C $(OPTIMIZATION_ENGINE) uninstall
	$(MAKE) -C $(TRIP_MANAGER) uninstall

wheels: clean install
	mkdir $(WHEEL_DIR)
	$(MAKE) -C $(COMMON) wheel
	# $(MAKE) -C $(OPTIMIZATION_ENGINE) wheel
	$(MAKE) -C $(TRIP_MANAGER) wheel

lambda_images:
	# $(MAKE) -C $(OPTIMIZATION_ENGINE) lambda_image
	$(MAKE) -C $(TRIP_MANAGER) lambda_image

