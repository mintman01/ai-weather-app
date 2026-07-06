#!/bin/sh
envsubst '${VITE_NVIDIA_API_KEY} ${VITE_LLM_ENDPOINT}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'