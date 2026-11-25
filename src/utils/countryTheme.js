import { COUNTRY_CURRICULA, COUNTRY_META } from "../data/countryCurricula";

export function getActiveCountryContext(pathname = "") {
  const path = pathname.toLowerCase();
  let key = null;
  if (path.startsWith("/nursing-uk") || path.startsWith("/global-nursing/united-kingdom-nmc")) key = "uk";
  else if (path.startsWith("/nursing-usa") || path.startsWith("/nclex-rn") || path.startsWith("/global-nursing/united-states-nclex")) key = "usa";
  else if (path.startsWith("/nursing-canada") || path.startsWith("/global-nursing/canada-nnas-nclex")) key = "canada";
  else if (path.startsWith("/nursing-australia") || path.startsWith("/global-nursing/australia-ahpra-nmba")) key = "australia";

  if (!key) return null;
  const meta = COUNTRY_META[key];
  const curriculum = COUNTRY_CURRICULA[meta.slug];

  const palette =
    key === "uk"
      ? {
          headerBg: "#FFFFFF",
          headerBorder: "#0A0D14",
          badgeBg: "#0A0D14",
          badgeText: "#FFFFFF",
          btnBg: "#0A0D14",
          btnText: "#FFFFFF",
          footerBg: "#0A0D14",
          footerBorder: "#1E293B",
          footerAccent: "#E2E8F0"
        }
      : key === "usa" || key === "canada"
      ? {
          headerBg: "#FFFFFF",
          headerBorder: "#991B1B",
          badgeBg: "#991B1B",
          badgeText: "#FFFFFF",
          btnBg: "#991B1B",
          btnText: "#FFFFFF",
          footerBg: "#450A0A",
          footerBorder: "#991B1B",
          footerAccent: "#FCA5A5"
        }
      : {
          headerBg: "#FFFFFF",
          headerBorder: "#064E3B",
          badgeBg: "#064E3B",
          badgeText: "#FFFFFF",
          btnBg: "#064E3B",
          btnText: "#FFFFFF",
          footerBg: "#022C22",
          footerBorder: "#064E3B",
          footerAccent: "#6EE7B7"
        };

  return {
    key,
    meta,
    curriculum,
    palette
  };
}
