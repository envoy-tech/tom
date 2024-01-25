ARG FUNCTION_DIR="/function"

FROM build-container
ARG FUNCTION_DIR

ENV LD_LIBRARY_PATH=/usr/local/lib64:${LD_LIBRARY_PATH}
RUN mkdir -p ${FUNCTION_DIR}
COPY lambda_function.py ${FUNCTION_DIR}
COPY wheels/ ${FUNCTION_DIR}

WORKDIR ${FUNCTION_DIR}
ARG OE_VENV="oe-venv-3.10.5"

RUN cd ${FUNCTION_DIR} && \
    python3.10 -m venv ${OE_VENV}&& \
    source ${OE_VENV}/bin/activate && \
    pip install -U pip && \
    pip install wheel awslambdaric && \
    pip install tom_common*.whl tom_optimization_engine*.whl

ENTRYPOINT [ "${FUNCTION_DIR}/${OE_VENV}/bin/python3.10", "-m", "awslambdaric" ]

CMD ["lambda_function.handler"]
