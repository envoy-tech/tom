ARG FUNCTION_DIR="/function"

FROM 786929059663.dkr.ecr.us-east-1.amazonaws.com/adventurus/build-images:20241018-x86_64
ARG FUNCTION_DIR

ENV LD_LIBRARY_PATH=/lib64:/usr/local/lib64:${LD_LIBRARY_PATH}
RUN mkdir ${FUNCTION_DIR}
COPY lambda_function.py ${FUNCTION_DIR}
COPY wheels/ ${FUNCTION_DIR}

WORKDIR ${FUNCTION_DIR}

RUN cd ${FUNCTION_DIR} && \
    pip3.10 install -U pip && \
    pip3.10 install wheel awslambdaric && \
    pip3.10 install tom_common*.whl tom_optimization_engine*.whl

ENTRYPOINT [ "/usr/local/bin/python3.10", "-m", "awslambdaric" ]

CMD ["lambda_function.handler"]
