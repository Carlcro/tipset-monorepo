import { useTranslation } from "next-i18next";
import React from "react";
import { Button, DropdownMenu } from "@radix-ui/themes";

export interface FlagsObject {
  [key: string]: string;
}

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language;
  const switchLanguage = (language: string) => {
    // Change the language in i18next
    i18n.changeLanguage(language);
  };

  const flag: FlagsObject = { sv: "🇸🇪", en: "🇬🇧" };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft">{flag[currentLanguage]}</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={() => switchLanguage("sv")}>
          🇸🇪
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => switchLanguage("en")}>
          🇬🇧
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default LanguageSwitcher;
