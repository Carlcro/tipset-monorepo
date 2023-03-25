import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";

import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Home: NextPage = () => {
  const betslip = trpc.betslip.createBetSlip.useMutation();

  const addUsertournament = () => {
    betslip.mutate({
      bets: [
        {
          matchId: 1,
          team1Id: "clfnv5dup0048vy6q0azscosd",
          team2Id: "clfnv5dup0049vy6qv8v83n7a",
          team1Score: 1,
          team2Score: 1,
        },
        {
          matchId: 2,
          team1Id: "clfnv5dup004avy6q1md9ty5q",
          team2Id: "clfnv5duq004bvy6qam4kj26a",
          team1Score: 3,
          team2Score: 2,
        },
      ],
      goalScorerId: "clfnv5dlt0002vy6qgino4se4",
    });
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> Turbo
          </h1>
          <AuthShowcase />

          <button onClick={addUsertournament}>Create!</button>
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
          <p className="text-center text-2xl text-white">
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
        <p className="text-center text-2xl text-white">
          <Link href="/sign-in">Sign In</Link>
        </p>
      )}
    </div>
  );
};
