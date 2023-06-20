FROM busybox:uclibc as busybox
FROM oven/bun as bun

FROM gcr.io/distroless/base-debian11 as root
COPY --from=busybox /bin/sh /bin/sh
COPY --from=bun usr/local/bin/bun usr/local/bin/bun
WORKDIR /srv
COPY ./broker/package.json ./package.json
COPY ./packages ./packages
RUN bun install
COPY ./broker/@types ./@types
COPY ./broker/app ./app
COPY ./broker/cmd ./cmd
COPY ./broker/lib ./lib
COPY ./broker/src ./src
COPY ./broker/start.ts ./start.ts

FROM root as dev
CMD bun --watch ./start.ts dev --jsx=react-dev

FROM root as build
CMD bun --watch ./start.ts build --jsx=react

FROM root as live
CMD bun --watch ./start.ts live --jsx=react
