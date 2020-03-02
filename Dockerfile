FROM node

ADD . /code
WORKDIR /code
RUN make
WORKDIR /code/bundle/
EXPOSE 8000
ENTRYPOINT ["python", "-m", "SimpleHTTPServer"]
