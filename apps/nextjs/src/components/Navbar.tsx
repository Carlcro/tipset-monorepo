import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { useAuth, SignOutButton, useClerk } from "@clerk/nextjs";
import { useTranslation } from "next-i18next";
import LanguageSwitcher, { FlagsObject } from "./LanguagePicker";
import { Button, DropdownMenu } from "@radix-ui/themes";

const routesLoggedIn = (user: any, bettingAllowed?: boolean) => [
  { name: "home", route: "/" },
  {
    name: user && user.betSlip ? "my-bet" : "make-your-bet",
    route: bettingAllowed ? "/bet-slip" : `/placed-bets/${user.id}`,
  },
  { name: "point-system", route: "/point-system" },
  { name: "facit", route: "/championship" },
  { name: "profile", route: "/user" },
];

const BurgerMenu = ({
  t,
  user,
  bettingAllowed,
}: {
  t: (param: string) => string;
  user: any;
  bettingAllowed?: boolean;
}) => {
  const { signOut } = useClerk();
  const { pathname, query, asPath, push } = useRouter();

  const { i18n } = useTranslation();

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
    <div className="md:hidden">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="soft" size="2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content size="2">
          {routesLoggedIn(user, bettingAllowed).map((route) => (
            <DropdownMenu.Item asChild key={route.name}>
              <Link href={route.route}>{t(route.name)}</Link>
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator />
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              {flag[currentLanguage]}
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={() => switchLanguage("sv")}>
                🇸🇪
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => switchLanguage("en")}>
                🇬🇧
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Separator />

          <DropdownMenu.Item
            onClick={() => signOut(() => push("/"))}
            color="red"
          >
            {t("sign-out")}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};

const Navbar = () => {
  const { t } = useTranslation("common");
  const { isSignedIn } = useAuth();

  const router = useRouter();
  const { data: config } = trpc.config.getConfig.useQuery();
  const { data: user } = trpc.user.getUser.useQuery();
  if (!isSignedIn) {
    return null;
  }
  if (!user?.fullName) {
    return <div className="h-[60px]"></div>;
  }
  return (
    <nav
      className="mb-10 flex items-center justify-between border-b border-polarNight bg-slate p-2 md:justify-start"
      role="navigation"
      aria-label="main navigation"
    >
      <>
        <div className="mr-5 flex-1 space-x-5 md:hidden">
          <Link href="/">{user.fullName}</Link>
        </div>
        <BurgerMenu user={user} bettingAllowed={config?.bettingAllowed} t={t} />
      </>
      <div className="hidden w-full items-center md:flex md:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <Link
            className={
              router.pathname === "/" ? "underline underline-offset-4" : ""
            }
            href="/"
          >
            {t("home")}
          </Link>
          <Link
            className={
              router.pathname === "/answer-sheet"
                ? "underline underline-offset-4"
                : ""
            }
            href="/answer-sheet"
          >
            Admin
          </Link>
          {config?.bettingAllowed === false && user.betSlip && (
            <Link
              className={
                router.asPath == `/placed-bets/${user.betSlip?.id}`
                  ? "underline underline-offset-4"
                  : ""
              }
              href={`/placed-bets/${user.betSlip?.id}`}
            >
              {t("my-bet")}
            </Link>
          )}
          {config?.bettingAllowed === true && (
            <Link
              className={
                router.pathname === "/bet-slip"
                  ? "underline underline-offset-4"
                  : ""
              }
              href={"/bet-slip"}
            >
              {user.betSlip ? t("my-bet") : t("make-your-bet")}
            </Link>
          )}
          <Link
            className={
              router.pathname === "/championship"
                ? "underline underline-offset-4"
                : ""
            }
            href="/championship"
          >
            {t("facit")}
          </Link>
          <Link
            className={
              router.pathname === "/point-system"
                ? "underline underline-offset-4"
                : ""
            }
            href="/point-system"
          >
            {t("point-system")}
          </Link>

          <div className="mr-5 flex flex-1 items-center justify-end space-x-7 text-right">
            <LanguageSwitcher />
            <Link
              className={
                router.pathname === "/user"
                  ? "underline underline-offset-4 "
                  : ""
              }
              href="/user"
            >
              {user.fullName}
            </Link>
            <SignOutButton>{t("sign-out")}</SignOutButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
