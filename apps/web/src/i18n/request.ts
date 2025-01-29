import { getRequestConfig } from "next-intl/server";
import { useSetSanityMessages } from "./hooks/useSetSanityMessages";

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = "en";
  const messages = await useSetSanityMessages();

  return {
    locale,
    messages: messages,
  };
});
