import { REMEMBER_ME_KEY } from "./constants";

export function getRememberMePreference(): boolean {
  try {
    return localStorage.getItem(REMEMBER_ME_KEY) === "true";
  } catch {
    return true;
  }
}

export function setRememberMePreference(remember: boolean): void {
  try {
    if (remember) {
      localStorage.setItem(REMEMBER_ME_KEY, "true");
    } else {
      localStorage.setItem(REMEMBER_ME_KEY, "false");
    }
  } catch {
    // ignore storage errors
  }
}
