FROM nginx

MAINTAINER main@jdkhome.com
COPY nginx.conf /etc/nginx/nginx.conf
COPY docs/.vuepress/dist /usr/share/nginx/html