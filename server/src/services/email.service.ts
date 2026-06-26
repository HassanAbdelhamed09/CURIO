import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

/**
 * Email Service.
 * Dispatches verification links and password recovery steps via SMTP.
 */
export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  // Check if SMTP is configured (i.e. not placeholder value)
  const isSmtpConfigured = 
    env.EMAIL_USER && 
    env.EMAIL_USER !== 'replace_me' && 
    env.EMAIL_PASS && 
    env.EMAIL_PASS !== 'replace_me';

  if (isSmtpConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        host: env.EMAIL_HOST,
        port: env.EMAIL_PORT,
        secure: env.EMAIL_PORT === 465, // Use SSL for port 465
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"${env.EMAIL_FROM.split('@')[0]}" <${env.EMAIL_FROM}>`,
        to,
        subject,
        html,
      });

      console.log(`[SMTP EMAIL] Dispatched email successfully to: ${to}`);
    } catch (err) {
      console.error('[SMTP EMAIL ERROR] Failed sending via SMTP, falling back to console:', err);
      logDevEmail(to, subject, html);
    }
  } else {
    logDevEmail(to, subject, html);
  }
};

/**
 * Helper to log dev emails to console without crashing.
 */
const logDevEmail = (to: string, subject: string, html: string) => {
  console.log('\n========================================================================');
  console.log(`[DEV EMAIL] TO: ${to}`);
  console.log(`[DEV EMAIL] SUBJECT: ${subject}`);
  
  // Extract link if one exists in the HTML body for easy copy-paste in development
  const linkMatch = html.match(/href="([^"]+)"/);
  if (linkMatch && linkMatch[1]) {
    console.log(`[DEV EMAIL] ACTION URL: ${linkMatch[1]}`);
  }
  
  console.log('========================================================================\n');
};

export default sendEmail;
