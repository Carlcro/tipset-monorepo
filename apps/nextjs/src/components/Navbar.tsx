import React from "react";
import { forwardRef } from "react";
import { Menu } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { useAuth, SignOutButton } from "@clerk/nextjs";

/* const MyLink = forwardRef((props, ref) => {
  const { href, children, ...rest } = props;
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
    <Menu as="div" className="relative z-10 md:hidden">
      <Menu.Button className="inline-flex w-full justify-center rounded border border-polarNight bg-slate px-4 py-2 text-sm font-medium text-gray-700 shadow-lg">
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
      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-slate shadow-lg ring ring-polarNight ring-opacity-5 focus:outline-none">
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
} */

const routesLoggedIn = (user: any, bettingAllowed: boolean) => [
  { name: "Hem", route: "/user-tournament" },
  {
    name: user && user.betSlip ? "Mitt tips" : "Gör ditt tips",
    route: bettingAllowed ? "/bet-slip" : `/placed-bets/${user.id}`,
  },
  { name: "Poängsystem", route: "/point-system" },
  { name: "Facit", route: "/championship" },
  { name: "Byt namn", route: "/user" },
];

const Navbar = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { data: config } = trpc.championship.getConfig.useQuery();
  const { data: user } = trpc.user.getUser.useQuery(undefined, {
    enabled: !!isSignedIn,
  });

  if (!user?.fullName) {
    return <div className="h-[60px]"></div>;
  }

  return (
    <nav
      className="mb-10 flex items-center justify-between border-b border-polarNight bg-slate p-2 md:justify-start"
      role="navigation"
      aria-label="main navigation"
    >
      {user && (
        <>
          <div className="mr-5 flex-1 space-x-5 md:hidden">
            <Link href="/user-tournament">{user.fullName}</Link>
          </div>
          {/*           <BurgerMenu user={user} bettingAllowed={config?.bettingAllowed} />
           */}{" "}
        </>
      )}

      <div className="hidden w-full items-center md:flex md:justify-between">
        {true ? (
          <div className="flex flex-1 items-center gap-4">
            <>
              <Link
                className={
                  router.pathname === "/user-tournament"
                    ? "underline underline-offset-4"
                    : ""
                }
                href="/user-tournament"
              >
                Hem
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
              <Link
                className={
                  router.pathname === "/bet-slip"
                    ? "underline underline-offset-4"
                    : ""
                }
                href={
                  config?.bettingAllowed === false && user && user
                    ? `/placed-bets/${user.id}`
                    : "/bet-slip"
                }
              >
                {user && user.betSlip ? "Mitt tips" : "Gör ditt tips"}
              </Link>
            </>
            <Link
              className={
                router.pathname === "/championship"
                  ? "underline underline-offset-4"
                  : ""
              }
              href="/championship"
            >
              Facit
            </Link>
            <Link
              className={
                router.pathname === "/point-system"
                  ? "underline underline-offset-4"
                  : ""
              }
              href="/point-system"
            >
              Poängsystem
            </Link>

            <div className="mr-5 flex flex-1 items-center justify-end space-x-7 text-right">
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
              <SignOutButton />
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
