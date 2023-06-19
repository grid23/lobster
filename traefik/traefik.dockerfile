FROM traefik:latest as root
COPY ./traefik/traefik.static.yml /etc/traefik/static.yml
COPY ./traefik/traefik.dynamic.yml /etc/traefik/dynamic.yml

FROM root as dev
COPY ./.cert/certificate.dev.crt /var/ssl/certs/certificate.dev.crt
COPY ./.cert/certificate.dev.key /var/ssl/certs/certificate.dev.key

FROM root as live
