import { Button } from "@radix-ui/themes";
import { SignInButton } from "@clerk/nextjs";
import Container from "./Container";
import SubmitButton from "./SubmitButton";

const LandingPage = () => {
  return (
    <>
      <section className="w-full pt-12 md:pt-24 lg:pt-32">
        <div className="container space-y-10 xl:space-y-16">
          <div className="grid gap-4 px-10 md:grid-cols-2 md:gap-16">
            <Container>
              <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                Predict Euro 2024 results and top the leaderboard!
              </h1>
            </Container>

            <div className="flex flex-col items-start space-y-4">
              <p className="mx-auto max-w-[700px] md:text-xl">
                Enter your predicted scores for each match of the European
                Football Cup 2024 and rack up points based on how close you are
                to the actual outcomes. Compete against friends and family in
                custom groups, and aim for the top to claim ultimate bragging
                rights. Join now and show off your football foresight
              </p>
              <div className="space-x-4">
                <SignInButton>
                  <SubmitButton size={"4"}>Sign In</SubmitButton>
                </SignInButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
