FROM nginx

MAINTAINER main@jdkhome.com
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist /usr/share/nginx/html