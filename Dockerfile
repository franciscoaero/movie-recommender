FROM python:3.8-slim

WORKDIR /app

RUN pip install awsebcli

CMD ["bash"]
