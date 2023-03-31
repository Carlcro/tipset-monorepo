import React, { useEffect } from "react";
import { forwardRef } from "react";
import { Menu } from "@headlessui/react";
import Link from "next/link";
import { useQuery } from "react-query";
import { signOut, useSession } from "next-auth/react";
import { getUser } from "../services/userService";
import { useRouter } from "next/router";
import { getConfig } from "../services/configService";

const MyLink = forwardRef((props, ref) => {
  let { href, children, ...rest } = props;
  return (
    <Link href={href}>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  );
});

MyLink.displayName = "MyLink";

function BurgerMenu({ user, bettingAllowed }) {
  return (
    <Menu as="div" className="relative md:hidden z-10">
      <Menu.Button className="inline-flex justify-center w-full rounded border border-polarNight shadow-lg px-4 py-2 bg-slate text-sm font-medium text-gray-700">
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
      </Menu.Button>
      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-slate ring ring-polarNight ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
        {routesLoggedIn(user, bettingAllowed).map((item) => (
          <Menu.Item key={item.name}>
            {({ active, hover }) => (
              <MyLink
                className={`${
                  active && "bg-slate"
                } flex items-center px-4 py-2 text-sm`}
                href={item.route}
              >
                {item.name}
              </MyLink>
            )}
          </Menu.Item>
        ))}
        <Menu.Item>
          {({ active, hover }) => (
            <div
              className={`${
                active && "bg-snowStorm2"
              } flex items-center px-4 py-2 text-sm`}
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logga ut
            </div>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}

const routesLoggedIn = (user, bettingAllowed) => [
  { name: "Hem", route: "/user-tournament" },
  {
    name: user && user.betSlip ? "Mitt tips" : "Gör ditt tips",
    route: bettingAllowed ? "/bet-slip" : `/placed-bets/${user._id}`,
  },
  { name: "Poängsystem", route: "/point-system" },
  { name: "Facit", route: "/championship" },
  { name: "Byt namn", route: "/user" },
];

const Navbar = () => {
  const { status } = useSession();
  const router = useRouter();
  const { data: config, isLoading: configLoading } = useQuery(
    ["config"],
    getConfig
  );

  const { data: user } = useQuery(
    ["user"],
    async () => {
      const { data } = await getUser();
      return data;
    },
    { enabled: status === "authenticated" }
  );

  useEffect(() => {
    if (router.pathname !== "/" && status === "unauthenticated") {
      router.push("/");
    }
  }, [router, status]);

  if (status === "loading") {
    return <div className="h-[60px]"></div>;
  }

  if (!user?.fullName) {
    return <div className="h-[60px]"></div>;
  }

  return (
    <nav
      className="bg-slate border-b border-polarNight p-2 mb-10 flex justify-between items-center md:justify-start"
      role="navigation"
      aria-label="main navigation"
    >
      {user && (
        <>
          <div className="flex-1 mr-5 md:hidden space-x-5">
            <Link href="/user-tournament">
              <a>{user.fullName}</a>
            </Link>
          </div>

          <BurgerMenu user={user} bettingAllowed={config?.bettingAllowed} />
        </>
      )}

      <div className="hidden md:flex md:justify-between w-full items-center">
        {status === "authenticated" ? (
          <div className="flex gap-4 flex-1 items-center">
            <>
              <Link href="/user-tournament">
                <a
                  className={
                    router.pathname === "/user-tournament"
                      ? "underline underline-offset-4"
                      : ""
                  }
                >
                  {"Hem"}
                </a>
              </Link>
              <Link
                href={
                  config?.bettingAllowed === false && user && user.betSlip
                    ? `/placed-bets/${user._id}`
                    : "/bet-slip"
                }
              >
                <a
                  className={
                    router.pathname === "/bet-slip"
                      ? "underline underline-offset-4"
                      : ""
                  }
                >
                  {user && user.betSlip ? "Mitt tips" : "Gör ditt tips"}
                </a>
              </Link>
            </>
            <Link href="/championship">
              <a
                className={
                  router.pathname === "/championship"
                    ? "underline underline-offset-4"
                    : ""
                }
              >
                Facit
              </a>
            </Link>
            <Link href="/point-system">
              <a
                className={
                  router.pathname === "/point-system"
                    ? "underline underline-offset-4"
                    : ""
                }
              >
                Poängsystem
              </a>
            </Link>

            <div className="text-right flex-1 mr-5 space-x-7 flex items-center justify-end">
              <Link href="/user">
                <a
                  className={
                    router.pathname === "/user"
                      ? "underline underline-offset-4 "
                      : ""
                  }
                >
                  {user.fullName}
                </a>
              </Link>
              <button
                className="bg-auroraRed  text-sm px-2 py-2 text-slate"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logga ut
              </button>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
