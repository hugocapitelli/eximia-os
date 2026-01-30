#!/bin/bash
# ========================================
# Easypanel SSL Certificate Checker
# ========================================

echo "======================================"
echo "Easypanel SSL Certificate Checker"
echo "======================================"
echo ""

DOMAIN="eximiaventures.com.br"

echo "1. Checking DNS Resolution:"
echo "----------------------------"
dig +short $DOMAIN A
echo ""

echo "2. Checking if domain points to this server:"
echo "----------------------------------------------"
SERVER_IP=$(hostname -I | awk '{print $1}')
DOMAIN_IP=$(dig +short $DOMAIN A | head -1)

echo "Server IP: $SERVER_IP"
echo "Domain IP: $DOMAIN_IP"

if [ "$SERVER_IP" == "$DOMAIN_IP" ]; then
    echo "✅ DNS is correctly configured"
else
    echo "❌ DNS NOT pointing to this server!"
    echo "   Please update DNS A record to: $SERVER_IP"
fi
echo ""

echo "3. Checking Easypanel Docker containers:"
echo "------------------------------------------"
docker ps --filter "name=easypanel" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "4. Checking for Let's Encrypt certificates:"
echo "---------------------------------------------"
if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    echo "✅ Certificate directory exists: /etc/letsencrypt/live/$DOMAIN"
    sudo ls -la /etc/letsencrypt/live/$DOMAIN/
    echo ""
    echo "Certificate expiry:"
    sudo openssl x509 -enddate -noout -in /etc/letsencrypt/live/$DOMAIN/fullchain.pem
else
    echo "❌ No Let's Encrypt certificate found for $DOMAIN"
    echo "   Easypanel may store certificates in Docker volumes"
fi
echo ""

echo "5. Checking Easypanel volumes:"
echo "-------------------------------"
docker volume ls | grep easypanel
echo ""

echo "6. Testing SSL connection to domain:"
echo "--------------------------------------"
timeout 5 openssl s_client -servername $DOMAIN -connect $DOMAIN:443 </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates 2>/dev/null || echo "❌ Could not connect to $DOMAIN:443"
echo ""

echo "7. Checking Traefik/Caddy logs (Easypanel reverse proxy):"
echo "-----------------------------------------------------------"
PROXY_CONTAINER=$(docker ps --filter "name=traefik" --filter "name=caddy" --format "{{.Names}}" | head -1)

if [ -n "$PROXY_CONTAINER" ]; then
    echo "Found proxy container: $PROXY_CONTAINER"
    echo "Recent logs:"
    docker logs --tail 50 $PROXY_CONTAINER 2>&1 | grep -i -E "certificate|acme|letsencrypt|$DOMAIN|error" || echo "No relevant logs found"
else
    echo "❌ No Traefik or Caddy container found"
    echo "   Checking all Easypanel containers:"
    docker ps --format "table {{.Names}}\t{{.Image}}"
fi
echo ""

echo "8. Checking port 80 and 443:"
echo "------------------------------"
sudo netstat -tlnp | grep -E ":80|:443" || ss -tlnp | grep -E ":80|:443"
echo ""

echo "9. Testing HTTP challenge (Let's Encrypt):"
echo "--------------------------------------------"
curl -I http://$DOMAIN/.well-known/acme-challenge/test 2>&1 | head -5
echo ""

echo "======================================"
echo "Diagnostic Complete"
echo "======================================"
echo ""
echo "NEXT STEPS:"
echo ""
echo "If DNS is wrong:"
echo "  → Update DNS A record to point to: $SERVER_IP"
echo ""
echo "If no certificate found:"
echo "  → Check Easypanel logs in UI: Logs > Application"
echo "  → Try removing and re-adding the domain in Easypanel"
echo ""
echo "If certificate exists but Fortinet still appears:"
echo "  → The issue is SSL Inspection on your local network"
echo "  → Test from mobile 4G/5G network"
echo "  → Contact network admin to whitelist $DOMAIN"
