FROM node:18-alpine AS root
RUN apk add --no-cache libc6-compat
WORKDIR /srv
COPY ./dashboard/package.json ./
RUN npm install
COPY ./dashboard .

FROM root AS build
RUN npm run build

FROM root AS dev
CMD npm run dev

FROM build AS live
WORKDIR /srv
COPY --from=build /srv/public ./public
COPY --from=build --chown=nextjs:nodejs /srv/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /srv/.next/static ./.next/static
CMD node server.js
