PROTONAME = common
PROTODIR = tom/common
PYTHONDIR = ../tom-common

TARGETS = $(PYTHONDIR)/$(PROTODIR)/$(PROTONAME)_pb2.py $(PYTHONDIR)/$(PROTODIR)/$(PROTONAME)_pb2_grpc.py

grpc: $(TARGETS)

$(PYTHONDIR)/$(PROTODIR)/%_pb2.py $(PYTHONDIR)/$(PROTODIR)/%_pb2_grpc.py: $(PROTODIR)/%.proto
	python -m grpc_tools.protoc --proto_path=. --python_out="$(PYTHONDIR)" --grpc_python_out="$(PYTHONDIR)" $<
