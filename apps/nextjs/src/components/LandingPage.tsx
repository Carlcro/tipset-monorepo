import { SignInButton } from "@clerk/nextjs";
import { Button } from "@radix-ui/themes";

const LandingPage = () => {
  return (
    <div className="grid min-h-screen place-content-center">
      <h1>Välkommern till Tipset</h1>
      <SignInButton>
        <Button>Sign In</Button>
      </SignInButton>
    </div>
  );
};

export default LandingPage;
