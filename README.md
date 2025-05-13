# Idea-Centered-Inquiry
### How to run this server with http
```
docker compose up -d
```

### How to run this server with https
1. Register Domain Name
```
sudo docker compose --file docker-compose.certbot.yml run certbot certonly  --webroot --webroot-path=/data/letsencrypt -d your.domain.name
```
2. up server with docker-compose.https.yml
```
sudo docker compose -f docker-compose.https.yml  up -d
```


