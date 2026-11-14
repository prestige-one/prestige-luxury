import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/min";

/** National numbers use the selected country; international pastes retain their own code. */
export function normalizePhone(value: string, country: CountryCode = "AE"): string | undefined {
  const text = value.trim().replace(/^00/, "+");
  if (!text) return "";
  const number = parsePhoneNumberFromString(text, { defaultCountry: country, extract: false });
  return number?.isPossible() ? number.number : undefined;
}
