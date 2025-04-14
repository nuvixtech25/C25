
import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

// Configurar transporte de email usando variáveis de ambiente
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

interface NotificationRequest {
  to: string;
  subject: string;
  message: string;
}

export const handler: Handler = async (event) => {
  // Garantir que apenas solicitações POST sejam processadas
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método não permitido' }),
    };
  }

  try {
    // Verificar se as credenciais de email estão configuradas
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Credenciais de SMTP não configuradas. Notificação não enviada.');
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          message: 'Credenciais de SMTP não configuradas',
          smtp_configured: false
        }),
      };
    }

    // Parsear o corpo da requisição
    const { to, subject, message }: NotificationRequest = JSON.parse(event.body || '{}');
    
    if (!to || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Campos obrigatórios ausentes' }),
      };
    }

    // Enviar o email
    const mailOptions = {
      from: process.env.SMTP_FROM || 'notifications@example.com',
      to,
      subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notificação enviada com sucesso' }),
    };
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Erro ao enviar notificação',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }),
    };
  }
};
