FROM public.ecr.aws/lambda/python:3.10

ARG GOOGLE_MAPS_API_KEY

# Set some environment variables
ENV MPS_FOLDER=${LAMBDA_TASK_ROOT}/mps_files
ENV GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}

RUN mkdir ${MPS_FOLDER}

COPY wheels/ ${LAMBDA_TASK_ROOT}
COPY lambda_function.py ${LAMBDA_TASK_ROOT}

RUN pip install -U pip && \
    pip install wheel && \
    pip install tom_common*.whl tom_trip_manager*.whl

CMD ["lambda_function.handler"]
