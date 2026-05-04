export function createDefaultDeviceName(): string {
  if (typeof navigator === "undefined") return "Browser Device";

  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("iphone")) return "Jerry's iPhone";
  if (ua.includes("ipad")) return "Jerry's iPad";
  if (ua.includes("android")) return "Android Phone";
  if (ua.includes("mac")) return "Jerry's MacBook";
  if (ua.includes("windows")) return "Windows Laptop";

  return "Browser Device";
}
