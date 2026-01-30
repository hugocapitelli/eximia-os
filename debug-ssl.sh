#!/bin/bash
# ========================================
# ExímIA Ventures - SSL Diagnostic Script
# ========================================

DOMAIN="eximiaventures.com.br"

echo "======================================"
echo "SSL Certificate Diagnostic for $DOMAIN"
echo "======================================"
echo ""

echo "1. DNS Resolution:"
echo "-------------------"
nslookup $DOMAIN
echo ""

echo "2. SSL Certificate Details:"
echo "----------------------------"
echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -text | grep -A 5 "Issuer:"
echo ""

echo "3. Certificate Chain:"
echo "----------------------"
echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 -showcerts 2>/dev/null
echo ""

echo "4. Certificate Issuer:"
echo "-----------------------"
echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -issuer
echo ""

echo "5. Certificate Validity:"
echo "-------------------------"
echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates
echo ""

echo "6. TLS Version:"
echo "----------------"
nmap --script ssl-enum-ciphers -p 443 $DOMAIN 2>/dev/null || echo "nmap not installed - skipping"
echo ""

echo "7. HTTP Headers:"
echo "-----------------"
curl -I https://$DOMAIN 2>&1 | head -20
echo ""

echo "======================================"
echo "Diagnostic Complete"
echo "======================================"
echo ""
echo "INTERPRETATION:"
echo "- If 'Issuer' contains 'Fortinet' or 'FG100': SSL Inspection is active"
echo "- If 'Issuer' contains 'Let's Encrypt' or 'ZeroSSL': Certificate is valid"
echo "- If connection fails: Check Easypanel SSL configuration"
