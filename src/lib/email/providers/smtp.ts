/**
 * Fournisseur SMTP LWS via Nodemailer.
 * Supporte le chiffrement SSL (Port 465) et STARTTLS (Port 587) avec timeouts stricts.
 */

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { EmailOptions, EmailProvider, EmailProviderResult } from '../types';
import { getEmailConfig } from '../config';

let cachedTransporter: Transporter | null = null;

export class SmtpProvider implements EmailProvider {
  readonly name = 'smtp' as const;

  private getTransporter(): Transporter | null {
    const config = getEmailConfig();
    const smtp = config.smtp;

    if (!smtp) return null;

    if (!cachedTransporter) {
      cachedTransporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: {
          user: smtp.user,
          pass: smtp.pass,
        },
        connectionTimeout: 8000,
        greetingTimeout: 5000,
        socketTimeout: 8000,
      });
    }

    return cachedTransporter;
  }

  async send(options: EmailOptions): Promise<EmailProviderResult> {
    const config = getEmailConfig();
    const transporter = this.getTransporter();

    if (!transporter) {
      return {
        success: false,
        provider: this.name,
        error: 'Paramètres SMTP non configurés (SMTP_HOST, SMTP_USER, SMTP_PASS manquants)',
      };
    }

    const fromHeader = options.from || `"${config.fromName}" <${config.fromEmail}>`;

    try {
      const info = await transporter.sendMail({
        from: fromHeader,
        to: options.to,
        replyTo: options.replyTo,
        subject: options.subject,
        text: options.text,
        html: options.html,
        headers: options.headers,
      });

      return {
        success: true,
        provider: this.name,
        messageId: info.messageId,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        provider: this.name,
        error: `Erreur d'envoi SMTP LWS: ${msg}`,
      };
    }
  }
}
