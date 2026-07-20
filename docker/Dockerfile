FROM quay.ncbank.cn/base/nginx-plus:r20
  
COPY docker/default.conf /etc/nginx/conf.d/default.conf

COPY dist/ /etc/nginx/html/open/web/

USER root
RUN chmod -R 775 /var/log/nginx /var/cache/nginx /var/run \
    && chgrp -R 0 /etc/nginx \
    && chmod -R g=u /etc/nginx \
    && chmod -R 755 /etc/nginx

EXPOSE 8081