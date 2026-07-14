export const ADMIN_EMAILS = ["purpose04023@gmail.com", "sudhee.sripada@gmail.com"];

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

