FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY example-python/requirements.txt /app/example-python/requirements.txt
RUN pip install --no-cache-dir -r /app/example-python/requirements.txt

COPY example-python /app/example-python
COPY src /app/src

WORKDIR /app/example-python

EXPOSE 8006

CMD ["python", "server.py"]
