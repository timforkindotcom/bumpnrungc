/** True on iPhone / iPad / Android phones — Safari URL-bar tricks need a locked canvas. */
export function isPhoneLike(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  const ua = navigator.userAgent || "";
  if (/iPhone|iPod/i.test(ua)) return true;
  if (/iPad/i.test(ua)) return true;
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return true;
  if (/Android/i.test(ua) && /Mobile/i.test(ua)) return true;
  return false;
}
