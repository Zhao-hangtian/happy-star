export NODE_OPTIONS=--max-old-space-size=819 && vite build && rm -rf /home/nginx/idiom2 && cp -r dist /home/nginx/idiom2 && sudo chown -R nginx:nginx /home/nginx/idiom2
