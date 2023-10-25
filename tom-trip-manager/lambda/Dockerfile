FROM public.ecr.aws/lambda/python:3.10

COPY wheels/ ${LAMBDA_TASK_ROOT}
COPY lambda_function.py ${LAMBDA_TASK_ROOT}

RUN pip install -U pip && \
    pip install wheel && \
    pip install tom_common*.whl tom_trip_manager*.whl

CMD ["lambda_function.handler"]
