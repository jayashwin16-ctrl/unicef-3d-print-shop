/** Set after successful school verification; same tab can checkout without re-entering. */
const SESSION_KEY = "ows_site_access_ok";

export function hasSchoolCheckoutAccess(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function grantSchoolCheckoutAccess(): void {
  sessionStorage.setItem(SESSION_KEY, "1");
}
