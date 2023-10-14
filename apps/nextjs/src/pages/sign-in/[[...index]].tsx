import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <main className="text-black bg-white flex h-screen flex-col items-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Sign In
          </h1>
          <SignIn signUpUrl="/sign-up" />
        </div>
      </div>
    </main>
  );
};

export default SignInPage;
