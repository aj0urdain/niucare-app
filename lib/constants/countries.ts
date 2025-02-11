import { getCountries, getCountryCallingCode } from "libphonenumber-js";

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

export const COUNTRIES = getCountries()
  .map((country) => ({
    value: `+${getCountryCallingCode(country)}`,
    label: countryNames.of(country)!,
    code: country,
    phoneCode: `(+${getCountryCallingCode(country)})`,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));
