/**
 * File: lib/constants/countries.ts
 * Description: Country data and phone code utilities
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

import { getCountries, getCountryCallingCode } from "libphonenumber-js";

/**
 * Creates a display names formatter for region names in English
 */
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

/**
 * Array of country data with phone codes and labels
 * Sorted alphabetically by country name
 *
 * @property {string} value - Phone code with + prefix (e.g., "+1")
 * @property {string} label - Country name in English
 * @property {string} code - ISO country code
 * @property {string} phoneCode - Phone code in parentheses (e.g., "(+1)")
 */
export const COUNTRIES = getCountries()
  .map((country) => ({
    value: `+${getCountryCallingCode(country)}`,
    label: countryNames.of(country)!,
    code: country,
    phoneCode: `(+${getCountryCallingCode(country)})`,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));
