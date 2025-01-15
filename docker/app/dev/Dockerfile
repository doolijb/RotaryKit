# # # # # # # # # # # # # # # # # # #
# NOTES:                            #
# # # # # # # # # # # # # # # # # # #

#

# # # # # # # # # # # # # # # # # # #
# BASE IMAGE                        #
# # # # # # # # # # # # # # # # # # #

# Use the NGINX Unit image, which is based on Debian
FROM unit:1.33.0-node22

# # # # # # # # # # # # # # # # # # # #
# # INSTALL LINUX DEPENCENDIES        #
# # # # # # # # # # # # # # # # # # # #

# RUN apt update -y \
#     && curl -fsSL https://deb.nodesource.com/setup_18.x | bash \
#     && apt install -y nodejs

# # # # # # # # # # # # # # # # # # #
#  COPY APP FILES TO CONTAINER      #
# # # # # # # # # # # # # # # # # # #

WORKDIR /srv/www/app
COPY ../app .
RUN curl -fsSL https://bun.sh/install | bash -s "bun-v1.1.43" && mv /root/.bun/bin/bun /usr/local/bin/bun
RUN bun install
RUN bun x playwright install
RUN bun x playwright install-deps

# # # # # # # # # # # # # # # # # # #
#  COPY UNIT CONFIG                 #
# # # # # # # # # # # # # # # # # # #

COPY ../server/unit.conf.dev.json /var/lib/unit/conf.json

# # # # # # # # # # # # # # # # # # #
# OPEN CONTAINER PORTS              #
# # # # # # # # # # # # # # # # # # #

# Expose application port ( represents port 80 in production )
EXPOSE 8080
# Expose unitd api port ( do not expose to the internet! )
EXPOSE 8090
# Expose Drizzle Studio
EXPOSE 4983
