import { I18n } from "@grammyjs/i18n";
import { MyContext } from "../types";
import path from "path";

const i18n = new I18n<MyContext>({
  defaultLocale: "en", // Default language if none is detected, or the user language is not available!
  directory: path.join(__dirname, "../locales"), // Relative path to locales folder
  fluentBundleOptions: {
    useIsolating: false, // Disable isolation marks for Fluent syntax
  },
  // Locale detection function (optional, uses Telegram's `from.language_code` by default)
  localeNegotiator: (ctx) => ctx.from?.language_code || "en",
});

export default i18n;
