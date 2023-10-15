import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React from "react";
import { Button, DropdownMenu } from "@radix-ui/themes";

interface FlagsObject {
  [key: string]: string;
}

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const { pathname, query, asPath, push } = useRouter();

  const currentLanguage = i18n.language;
  const switchLanguage = (locale: string) => {
    // Change the language in i18next
    i18n.changeLanguage(locale);
    push({ pathname, query }, asPath, {
      locale,
      scroll: false,
      shallow: true,
    });
  };

  const flag: FlagsObject = { sv: "🇸🇪", en: "🇬🇧" };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft">{flag[currentLanguage]}</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={() => switchLanguage("sv")} shortcut="⌘ E">
          🇸🇪
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => switchLanguage("en")} shortcut="⌘ E">
          🇬🇧
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default LanguageSwitcher;
