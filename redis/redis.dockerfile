FROM redis/redis-stack:7.2.0-M01 as dev
RUN apt-get update && apt-get install -y original-awk
ARG REDIS_MASTER_IP
ARG REDIS_MASTER_PORT
ARG REDIS_MASTER_AUTH
COPY ./redis/redis.conf /redis-stack.conf
RUN awk -v IP="$REDIS_MASTER_IP" -v PORT="$REDIS_MASTER_PORT" '/# replicaof %master_ip% %master_port%/ && IP && PORT { sub(/# replicaof %master_ip% %master_port%/, "replicaof " IP " " PORT) } { print }' /redis-stack.conf > /redis-stack.conf.tmp && mv /redis-stack.conf.tmp /redis-stack.conf
RUN awk -v AUTH="$REDIS_MASTER_AUTH" '/# masterauth %master_password%/ && AUTH { sub(/# masterauth %master_password%/, "masterauth " AUTH) } { print }' /redis-stack.conf > /redis-stack.conf.tmp && mv /redis-stack.conf.tmp /redis-stack.conf
CMD ["/entrypoint.sh"]