/** True on phones and tablets — do not auto-start the Unity hole. */
export function isPhoneLike(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return true;
  }
  const ua = navigator.userAgent || "";
  if (/iPhone|iPod|iPad|Android/i.test(ua)) return true;
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return true;
  if (navigator.maxTouchPoints > 1 && window.innerWidth < 900) return true;
  if (window.matchMedia("(pointer: coarse)").matches) return true;
  return false;
}
