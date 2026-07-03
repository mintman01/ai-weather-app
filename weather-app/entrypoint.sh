#!/bin/sh
envsubst '${NVIDIA_API_KEY} ${LLM_BASE_URL}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'