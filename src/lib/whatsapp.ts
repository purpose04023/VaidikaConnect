/**
 * A mock WhatsApp messaging utility for development.
 * Logs fully-formatted WhatsApp alerts to show what would be sent to the user's phone.
 */
export async function sendWhatsAppNotification(toPhoneNumber: string, message: string): Promise<boolean> {
  console.log("=========================================");
  console.log(`[WHATSAPP MESSAGE SENT]`);
  console.log(`TO: ${toPhoneNumber}`);
  console.log(`TIME: ${new Date().toLocaleString()}`);
  console.log(`MESSAGE:\n${message}`);
  console.log("=========================================");
  
  // Return true to simulate a successful send
  return true;
}

/**
 * Formats a message for pooja pricing updates.
 */
export function formatPricingMessage(userName: string, deity: string, ritualType: string, date: string, price: number, bookingLink: string): string {
  return `Namaste ${userName}! 🙏

Your request for the custom pooja has been reviewed and verified by our pandits!

✨ *Ritual Details:*
• *Deity:* ${deity}
• *Ritual:* ${ritualType}
• *Preferred Date:* ${date}
• *Assigned Cost:* ₹${price.toLocaleString()}

To complete your booking, please navigate to your dashboard and click "Confirm & Book":
🔗 ${bookingLink}

Dhanyavadah,
*VaidikaConnect Support*`;
}

/**
 * Formats a message when a user submits a request.
 */
export function formatRequestConfirmationMessage(userName: string, deity: string, date: string): string {
  return `Namaste ${userName}! 🙏

We have received your request for a custom *${deity}* Pooja on *${date}*. 

Our expert pandits are currently reviewing the ritual details and will assign the appropriate pricing shortly. We will message you here as soon as it is verified!

Dhanyavadah,
*VaidikaConnect Support*`;
}
