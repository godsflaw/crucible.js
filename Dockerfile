FROM godsflaw/truffle:4.1.14
MAINTAINER Christopher Mooney <chris@dod.net>

ENV CRICIBLEJS="/crucible.js"

# drop codebase
RUN mkdir -p ${CRICIBLEJS}

ADD scripts ${CRICIBLEJS}/scripts
ADD snapshots ${CRICIBLEJS}/snapshots
ADD src ${CRICIBLEJS}/src
ADD test ${CRICIBLEJS}/test

ADD docker ${CRICIBLEJS}
ADD env-staging ${CRICIBLEJS}
ADD env-ropsten ${CRICIBLEJS}
ADD env-kovan ${CRICIBLEJS}
ADD env-production ${CRICIBLEJS}
ADD package-lock.json ${CRICIBLEJS}
ADD package.json ${CRICIBLEJS}
ADD tsconfig.json ${CRICIBLEJS}

# install codebase
RUN (cd ${CRICIBLEJS} && echo 'true' > ./docker && npm install && npm run build)

# any ports we want to expose
# EXPOSE 8545

# run the tests
WORKDIR "${CRICIBLEJS}"
CMD ["./scripts/noop", "start"]
