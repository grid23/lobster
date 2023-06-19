FROM busybox:uclibc as busybox
FROM oven/bun as bun

FROM gcr.io/distroless/base-debian11 as root
COPY --from=busybox /bin/sh /bin/sh
COPY --from=bun usr/local/bin/bun usr/local/bin/bun
WORKDIR /srv
COPY ./broker/package.json ./package.json
RUN bun install
COPY ./broker/server ./server
COPY ./broker/client ./client

FROM root as dev
CMD bun --watch ./server/start.js dev --jsx=react-dev

FROM root as build
RUN bun ./server/start.js build --jsx=react

FROM root as live
CMD bun ./server/start.js live --jsx=react
