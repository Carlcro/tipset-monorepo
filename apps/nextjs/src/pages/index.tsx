import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Navbar from "../components/Navbar";

const Home: NextPage = () => {
  const answerSheetUpdate = trpc.answerSheet.updatePoints.useMutation();

  const action = () => {
    answerSheetUpdate.mutate({
      calculateAllPoints: true,
    });
  };

  /*   return (
    <>
      <Navbar></Navbar>
      <LandingPage></LandingPage>;
    </>
  ); */
  return (
    <>
      <Head>
        <title>Tipset</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-white flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Navbar></Navbar>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <AuthShowcase />

          <button onClick={action}>Create!</button>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined,
    { enabled: !!isSignedIn },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {isSignedIn && (
        <>
          <p className="text-white text-center text-2xl">
            {secretMessage && (
              <span>
                {" "}
                {secretMessage} click the user button!
                <br />
              </span>
            )}
          </p>
          <div className="flex items-center justify-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "3rem",
                    height: "3rem",
                  },
                },
              }}
            />
          </div>
        </>
      )}
      {!isSignedIn && (
        <p className="text-white text-center text-2xl">
          <Link href="/sign-in">Sign In</Link>
        </p>
      )}
    </div>
  );
};

function LandingPage() {
  return (
    <div className="bg-gray-100">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt="Workflow"
              />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <a
                href="#"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-900 transition duration-150 ease-in-out hover:text-gray-500 focus:text-gray-500 focus:outline-none"
              >
                Products
              </a>
              <a
                href="#"
                className="ml-4 rounded-md px-3 py-2 text-sm font-medium text-gray-900 transition duration-150 ease-in-out hover:text-gray-500 focus:text-gray-500 focus:outline-none"
              >
                Features
              </a>
              <a
                href="#"
                className="ml-4 rounded-md px-3 py-2 text-sm font-medium text-gray-900 transition duration-150 ease-in-out hover:text-gray-500 focus:text-gray-500 focus:outline-none"
              >
                About
              </a>
              <a
                href="#"
                className="ml-4 rounded-md px-3 py-2 text-sm font-medium text-gray-900 transition duration-150 ease-in-out hover:text-gray-500 focus:text-gray-500 focus:outline-none"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div className="py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold leading-10 text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
              Tailwind Landing Page
            </h1>
            <div className="mx-auto mt-5 max-w-md">
              <p className="text-xl leading-7 text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas sit amet dapibus turpis, vel dapibus nisl.
              </p>
              <form className="mt-12 flex" action="#" method="POST">
                <input
                  aria-label="Email address"
                  className="bg-white focus:border-indigo-500 focus:shadow-outline-indigo w-full appearance-none rounded-l-md border border-gray-300 py-4 px-6 leading-5 text-gray-700 transition duration-150 ease-in-out focus:outline-none"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                />
                <span className="inline-flex rounded-r-md shadow-sm">
                  <button
                    type="submit"
                    className="border-transparent text-white bg-indigo-500 hover:bg-indigo-400 inline-flex items-center rounded-r-md border px-6 py-4 text-base font-medium leading-6 focus:outline-none"
                  >
                    Knapp
                  </button>
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
