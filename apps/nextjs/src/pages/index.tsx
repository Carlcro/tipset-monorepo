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

  return (
    <>
      <Head>
        <title>Tipset</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-black bg-white flex h-screen flex-col items-center">
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
