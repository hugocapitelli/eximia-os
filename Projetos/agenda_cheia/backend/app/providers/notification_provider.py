# backend/app/providers/notification_provider.py
"""
NotificationProvider - Envio de mensagens

Suporta:
- WhatsApp (via N8N webhook ou Twilio)
- SMS (via Twilio)
- Email (via SendGrid ou SMTP)
- Push (para React frontend)
"""

from typing import Optional, Dict, Any
import logging
import httpx
from datetime import datetime


logger = logging.getLogger(__name__)


class NotificationProvider:
    """Base class para todos os provedores de notificação"""

    async def send_whatsapp(
        self, phone: str, message: str, tenant_id: str, **kwargs
    ) -> str:
        raise NotImplementedError

    async def send_sms(self, phone: str, message: str, tenant_id: str, **kwargs) -> str:
        raise NotImplementedError

    async def send_email(
        self,
        email: str,
        subject: str,
        body: str,
        tenant_id: str,
        **kwargs,
    ) -> str:
        raise NotImplementedError

    async def send_push(self, user_id: str, title: str, body: str, data: Dict) -> str:
        raise NotImplementedError


class N8NNotificationProvider(NotificationProvider):
    """
    Integração com N8N para envio de mensagens

    Recomendado para MVP:
    - N8N já está rodando
    - Suporta WhatsApp, SMS, Email num mesmo lugar
    - Fácil de configurar
    """

    def __init__(self, n8n_base_url: str, webhook_token: Optional[str] = None):
        """
        Args:
            n8n_base_url: URL base do N8N (ex: https://n8n.seu-dominio.com)
            webhook_token: Token de autenticação (opcional)
        """
        self.base_url = n8n_base_url.rstrip("/")
        self.webhook_token = webhook_token
        self.timeout = 30.0

        logger.info(f"N8N Notification Provider initialized: {self.base_url}")

    async def send_whatsapp(
        self, phone: str, message: str, tenant_id: str, **kwargs
    ) -> str:
        """
        Envia mensagem WhatsApp via N8N

        N8N precisa ter um webhook registrado em:
        POST /webhook/send-whatsapp
        """

        payload = {
            "action": "send_whatsapp",
            "phone": phone,
            "message": message,
            "tenant_id": tenant_id,
            "timestamp": datetime.now().isoformat(),
            **kwargs,
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/webhook/send-whatsapp",
                    json=payload,
                    headers=self._get_headers(),
                )

            if response.status_code >= 400:
                logger.error(
                    f"N8N WhatsApp error: {response.status_code} - {response.text}"
                )
                return None

            data = response.json()
            message_id = data.get("message_id", f"whatsapp_{int(datetime.now().timestamp())}")

            logger.info(f"WhatsApp sent: {phone} -> {message_id}")
            return message_id

        except Exception as e:
            logger.error(f"Error sending WhatsApp via N8N: {e}")
            return None

    async def send_sms(self, phone: str, message: str, tenant_id: str, **kwargs) -> str:
        """Envia SMS via N8N"""

        payload = {
            "action": "send_sms",
            "phone": phone,
            "message": message,
            "tenant_id": tenant_id,
            "timestamp": datetime.now().isoformat(),
            **kwargs,
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/webhook/send-sms",
                    json=payload,
                    headers=self._get_headers(),
                )

            if response.status_code >= 400:
                logger.error(f"N8N SMS error: {response.status_code}")
                return None

            data = response.json()
            message_id = data.get("message_id", f"sms_{int(datetime.now().timestamp())}")

            logger.info(f"SMS sent: {phone} -> {message_id}")
            return message_id

        except Exception as e:
            logger.error(f"Error sending SMS via N8N: {e}")
            return None

    async def send_email(
        self,
        email: str,
        subject: str,
        body: str,
        tenant_id: str,
        **kwargs,
    ) -> str:
        """Envia email via N8N"""

        payload = {
            "action": "send_email",
            "email": email,
            "subject": subject,
            "body": body,
            "tenant_id": tenant_id,
            "timestamp": datetime.now().isoformat(),
            **kwargs,
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/webhook/send-email",
                    json=payload,
                    headers=self._get_headers(),
                )

            if response.status_code >= 400:
                logger.error(f"N8N Email error: {response.status_code}")
                return None

            data = response.json()
            message_id = data.get("message_id", f"email_{int(datetime.now().timestamp())}")

            logger.info(f"Email sent: {email} -> {message_id}")
            return message_id

        except Exception as e:
            logger.error(f"Error sending Email via N8N: {e}")
            return None

    async def send_push(self, user_id: str, title: str, body: str, data: Dict) -> str:
        """Envia push notification via N8N (opcional)"""

        payload = {
            "action": "send_push",
            "user_id": user_id,
            "title": title,
            "body": body,
            "data": data,
            "timestamp": datetime.now().isoformat(),
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/webhook/send-push",
                    json=payload,
                    headers=self._get_headers(),
                )

            if response.status_code >= 400:
                logger.warning(f"N8N Push error: {response.status_code}")
                return None

            data = response.json()
            message_id = data.get("message_id", f"push_{int(datetime.now().timestamp())}")

            logger.info(f"Push sent: {user_id} -> {message_id}")
            return message_id

        except Exception as e:
            logger.warning(f"Error sending Push via N8N: {e}")
            return None

    def _get_headers(self) -> Dict[str, str]:
        """Monta headers com autenticação"""
        headers = {"Content-Type": "application/json"}

        if self.webhook_token:
            headers["Authorization"] = f"Bearer {self.webhook_token}"

        return headers


class TwilioNotificationProvider(NotificationProvider):
    """
    Integração com Twilio (alternativa ao N8N)

    Recomendado se já tiver conta Twilio
    """

    def __init__(
        self,
        account_sid: str,
        auth_token: str,
        whatsapp_phone: str,
        sms_phone: str,
    ):
        """
        Args:
            account_sid: Twilio Account SID
            auth_token: Twilio Auth Token
            whatsapp_phone: Número WhatsApp (com +)
            sms_phone: Número SMS (com +)
        """
        self.account_sid = account_sid
        self.auth_token = auth_token
        self.whatsapp_phone = whatsapp_phone
        self.sms_phone = sms_phone

        try:
            from twilio.rest import Client

            self.client = Client(account_sid, auth_token)
            logger.info("Twilio Notification Provider initialized")
        except ImportError:
            logger.warning("twilio not installed - will use mock responses")
            self.client = None

    async def send_whatsapp(
        self, phone: str, message: str, tenant_id: str, **kwargs
    ) -> str:
        """Envia WhatsApp via Twilio"""

        if not self.client:
            return f"mock_whatsapp_{int(datetime.now().timestamp())}"

        try:
            msg = self.client.messages.create(
                from_=f"whatsapp:{self.whatsapp_phone}",
                to=f"whatsapp:{phone}",
                body=message,
            )

            logger.info(f"WhatsApp sent via Twilio: {phone} -> {msg.sid}")
            return msg.sid

        except Exception as e:
            logger.error(f"Error sending WhatsApp via Twilio: {e}")
            return None

    async def send_sms(self, phone: str, message: str, tenant_id: str, **kwargs) -> str:
        """Envia SMS via Twilio"""

        if not self.client:
            return f"mock_sms_{int(datetime.now().timestamp())}"

        try:
            msg = self.client.messages.create(
                from_=self.sms_phone,
                to=phone,
                body=message,
            )

            logger.info(f"SMS sent via Twilio: {phone} -> {msg.sid}")
            return msg.sid

        except Exception as e:
            logger.error(f"Error sending SMS via Twilio: {e}")
            return None

    async def send_email(
        self,
        email: str,
        subject: str,
        body: str,
        tenant_id: str,
        **kwargs,
    ) -> str:
        """Email não é suportado por Twilio - retorna None"""
        logger.warning("Email not supported by Twilio provider")
        return None

    async def send_push(self, user_id: str, title: str, body: str, data: Dict) -> str:
        """Push não é suportado por Twilio - retorna None"""
        logger.warning("Push not supported by Twilio provider")
        return None


class SendGridEmailProvider(NotificationProvider):
    """
    Integração com SendGrid para Email

    Pode ser usado junto com Twilio para WhatsApp+SMS
    """

    def __init__(self, api_key: str, from_email: str):
        """
        Args:
            api_key: SendGrid API Key
            from_email: Email de origem
        """
        self.api_key = api_key
        self.from_email = from_email

        try:
            from sendgrid import SendGridAPIClient
            from sendgrid.helpers.mail import Mail

            self.sgmail = SendGridAPIClient(api_key)
            self.Mail = Mail
            logger.info("SendGrid Email Provider initialized")
        except ImportError:
            logger.warning("sendgrid not installed - will use mock responses")
            self.sgmail = None

    async def send_email(
        self,
        email: str,
        subject: str,
        body: str,
        tenant_id: str,
        **kwargs,
    ) -> str:
        """Envia email via SendGrid"""

        if not self.sgmail:
            return f"mock_email_{int(datetime.now().timestamp())}"

        try:
            html_body = kwargs.get("html_body", f"<p>{body}</p>")

            message = self.Mail(
                from_email=self.from_email,
                to_emails=email,
                subject=subject,
                html_content=html_body,
            )

            response = self.sgmail.send(message)

            message_id = response.headers.get("X-Message-Id", f"email_{response.status_code}")
            logger.info(f"Email sent via SendGrid: {email} -> {message_id}")

            return message_id

        except Exception as e:
            logger.error(f"Error sending email via SendGrid: {e}")
            return None

    async def send_whatsapp(
        self, phone: str, message: str, tenant_id: str, **kwargs
    ) -> str:
        """WhatsApp não é suportado pelo SendGrid"""
        return None

    async def send_sms(self, phone: str, message: str, tenant_id: str, **kwargs) -> str:
        """SMS não é suportado pelo SendGrid"""
        return None

    async def send_push(self, user_id: str, title: str, body: str, data: Dict) -> str:
        """Push não é suportado pelo SendGrid"""
        return None


class MockNotificationProvider(NotificationProvider):
    """
    Provider mock para testes e desenvolvimento

    Loga mensagens em vez de enviar de verdade
    """

    async def send_whatsapp(
        self, phone: str, message: str, tenant_id: str, **kwargs
    ) -> str:
        """Mock: loga e retorna ID fake"""
        logger.info(f"[MOCK WhatsApp] {phone}: {message}")
        return f"mock_whatsapp_{int(datetime.now().timestamp())}"

    async def send_sms(self, phone: str, message: str, tenant_id: str, **kwargs) -> str:
        """Mock: loga e retorna ID fake"""
        logger.info(f"[MOCK SMS] {phone}: {message}")
        return f"mock_sms_{int(datetime.now().timestamp())}"

    async def send_email(
        self,
        email: str,
        subject: str,
        body: str,
        tenant_id: str,
        **kwargs,
    ) -> str:
        """Mock: loga e retorna ID fake"""
        logger.info(f"[MOCK Email] {email}: {subject}")
        return f"mock_email_{int(datetime.now().timestamp())}"

    async def send_push(self, user_id: str, title: str, body: str, data: Dict) -> str:
        """Mock: loga e retorna ID fake"""
        logger.info(f"[MOCK Push] {user_id}: {title}")
        return f"mock_push_{int(datetime.now().timestamp())}"
