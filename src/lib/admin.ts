export const ADMIN_EMAIL = "purpose04023@gmail.com";

export function isAdminEmail(email?: string | null) {
  return email?.trim().toLowerCase() === ADMIN_EMAIL;
}
