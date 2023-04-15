.PHONY: install uninstall

COMMON = tom-common
MODEL_SETUP = tom-model-setup
OPTIMIZATION = tom-optimization
TRAVELER_ACCESS = tom-traveler-access
TRIP_ACCESS = tom-trip-access
TRIP_MANAGER = tom-trip-manager

install:
	pip install \
		-e $(COMMON) \
		-e $(MODEL_SETUP) \
		-e $(OPTIMIZATION) \
		-e $(TRAVELER_ACCESS) \
		-e $(TRIP_ACCESS) \
		-e $(TRIP_MANAGER)

uninstall:
	$(MAKE) -C $(COMMON) uninstall
	$(MAKE) -C $(MODEL_SETUP) uninstall
	$(MAKE) -C $(OPTIMIZATION) uninstall
	$(MAKE) -C $(TRAVELER_ACCESS) uninstall
	$(MAKE) -C $(TRIP_ACCESS) uninstall
	$(MAKE) -C $(TRIP_MANAGER) uninstall
