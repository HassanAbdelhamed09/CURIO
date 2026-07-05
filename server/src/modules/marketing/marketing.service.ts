import { Newsletter } from './newsletter.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { sendEmail } from '../../services/email.service.js';
import { getNewsletterWelcomeTemplate } from '../../utils/emailTemplates.js';
import { env } from '../../config/env.js';

export class MarketingService {
  /**
   * Subscribes an email to the newsletter database and dispatches a welcome email.
   */
  public async subscribeEmail(email: string): Promise<void> {
    const formattedEmail = email.toLowerCase().trim();

    // 1. Check if already subscribed
    const existing = await Newsletter.findOne({ email: formattedEmail });
    if (existing) {
      throw new ApiError(
        400,
        'This email address is already registered in our newsletter database.',
        'ALREADY_SUBSCRIBED'
      );
    }

    // 2. Create the subscription record
    await Newsletter.create({ email: formattedEmail });

    // 3. Dispatch the welcome HTML email template (non-blocking)
    try {
      const emailHtml = getNewsletterWelcomeTemplate(formattedEmail, env.CLIENT_URL);
      sendEmail(formattedEmail, 'Welcome to CURIO // Curation Newsletter', emailHtml)
        .catch(emailErr => console.error('[Email Error] Failed to send newsletter welcome email:', emailErr));
    } catch (err) {
      console.error('[Email Error] Error preparing newsletter template:', err);
    }
  }
}

export const marketingService = new MarketingService();
