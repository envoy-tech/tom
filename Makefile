.PHONY: clean install uninstall wheel

COMMON = tom-common
TRAVELER_ACCESS = tom-traveler-access
TRIP_ACCESS = tom-trip-access
TRIP_MANAGER = tom-trip-manager
GRPC = grpc_protos

clean:
	rm -rf wheels/
	$(MAKE) -C $(COMMON) clean
	$(MAKE) -C $(TRAVELER_ACCESS) clean
	$(MAKE) -C $(TRIP_ACCESS) clean
	$(MAKE) -C $(TRIP_MANAGER) clean

install:
	$(MAKE) -C $(COMMON) install
	$(MAKE) -C $(TRAVELER_ACCESS) install
	$(MAKE) -C $(TRIP_ACCESS) install
	$(MAKE) -C $(TRIP_MANAGER) install

uninstall:
	$(MAKE) -C $(COMMON) uninstall
	$(MAKE) -C $(TRAVELER_ACCESS) uninstall
	$(MAKE) -C $(TRIP_ACCESS) uninstall
	$(MAKE) -C $(TRIP_MANAGER) uninstall

grpc:
	$(MAKE) -C $(GRPC) grpc

wheel: clean
	mkdir wheels/
	$(MAKE) -C $(COMMON) wheel
	$(MAKE) -C $(TRAVELER_ACCESS) wheel
	$(MAKE) -C $(TRIP_ACCESS) wheel
	$(MAKE) -C $(TRIP_MANAGER) wheel
