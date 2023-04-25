.PHONY: install uninstall

COMMON = tom-common
OPTIMIZATION = tom-optimization
TRAVELER_ACCESS = tom-traveler-access
TRIP_ACCESS = tom-trip-access
TRIP_MANAGER = tom-trip-manager
GRPC = grpc_protos

install:
	pip install \
		-e $(COMMON) \
		-e $(OPTIMIZATION) \
		-e $(TRAVELER_ACCESS) \
		-e $(TRIP_ACCESS) \
		-e $(TRIP_MANAGER)

uninstall:
	$(MAKE) -C $(COMMON) uninstall
	$(MAKE) -C $(OPTIMIZATION) uninstall
	$(MAKE) -C $(TRAVELER_ACCESS) uninstall
	$(MAKE) -C $(TRIP_ACCESS) uninstall
	$(MAKE) -C $(TRIP_MANAGER) uninstall

grpc:
	$(MAKE) -C $(GRPC) grpc
