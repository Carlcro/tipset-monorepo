// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useSignIn,
  useSignUp,
} from "@clerk/nextjs";
import { RecoilRoot } from "recoil";
import { trpc } from "../utils/trpc";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { appWithTranslation } from "next-i18next";
import nextI18nConfig from "../../next-i18next.config.mjs";
import "@radix-ui/themes/styles.css";
import { Button, Theme } from "@radix-ui/themes";
import { env } from "../env/client.mjs";
import { useState } from "react";
import { useRouter } from "next/router";

type SignUpData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type SignInData = Omit<SignUpData, "firstName" | "lastName">;

type SignUpFormErrors = {
  [K in keyof SignUpData]?: string;
};

type SignInFormErrors = {
  [K in keyof SignInData]?: string;
};

function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();

  const router = useRouter();
  const [formData, setFormData] = useState<SignUpData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<SignUpFormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validate = (values: SignUpData): SignUpFormErrors => {
    const errors: SignUpFormErrors = {};
    if (!values.firstName) {
      errors.firstName = "First name is required";
    }
    if (!values.lastName) {
      errors.lastName = "Last name is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email address is invalid";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate(formData);
    if (Object.keys(errors).length) {
      setFormErrors(errors);
    } else {
      // Submit your form
      console.log("Form submitted", formData);
      setFormErrors({});

      if (!isLoaded) {
        return;
      }

      console.log("hej");
      try {
        const result = await signUp.create({
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailAddress: formData.email,
          password: formData.password,
        });

        console.log("result", result);

        if (result.status === "complete") {
          console.log(result);
          await setActive({ session: result.createdSessionId });
          router.push("/");
        } else {
          /*Investigate why the login hasn't completed */
          console.log(result);
        }
      } catch (err: any) {
        console.error("error", err.errors[0].longMessage);
      }
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-center text-2xl font-bold">Sign Up</h1>
      <form onSubmit={handleSubmit} className="mb-3 space-y-3">
        <div>
          <label
            htmlFor="firstName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          {formErrors.firstName && (
            <p className="mt-1 text-xs text-red-500">{formErrors.firstName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          {formErrors.lastName && (
            <p className="mt-1 text-xs text-red-500">{formErrors.lastName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          {formErrors.email && (
            <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          {formErrors.password && (
            <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
          )}
        </div>
        <Button
          type="submit"
          className="text-white w-full rounded-md bg-blue-500 px-4 py-1 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
}

function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();

  const router = useRouter();
  const [formData, setFormData] = useState<SignInData>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<SignInFormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validate = (values: SignInData): SignInFormErrors => {
    const errors: SignInFormErrors = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email address is invalid";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate(formData);
    if (Object.keys(errors).length) {
      setFormErrors(errors);
    } else {
      // Submit your form
      console.log("Form submitted", formData);
      setFormErrors({});

      if (!isLoaded) {
        return;
      }

      console.log("hej");
      try {
        const result = await signIn.create({
          identifier: formData.email,
          password: formData.password,
        });

        console.log("result", result);

        if (result.status === "complete") {
          console.log(result);
          await setActive({ session: result.createdSessionId });
          router.push("/");
        } else {
          /*Investigate why the login hasn't completed */
          console.log(result);
        }
      } catch (err: any) {
        console.error("error", err.errors[0].longMessage);
      }
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-center text-2xl font-bold">Sign In</h1>
      <form onSubmit={handleSubmit} className="mb-3 space-y-3">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          {formErrors.email && (
            <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          {formErrors.password && (
            <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
          )}
        </div>
      </form>
    </div>
  );
}

const LoggedOut = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [onSignUp, setOnSign] = useState(true);
  const router = useRouter();

  const logInAsGuest = async () => {
    if (!isLoaded) {
      return;
    }
    const result = await signIn?.create({
      identifier: "test@test.com",
      password: "123",
      strategy: "password",
    });

    if (result?.status === "complete") {
      await setActive({ session: result.createdSessionId });
      router.push("/");
    }
  };

  if (env.NEXT_PUBLIC_IS_PORTFOLIO === "yes") {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex justify-center space-x-6">
          <div className="mx-auto mt-10 w-[300px] space-y-3 rounded-lg border bg-slate p-6 shadow-sm">
            {onSignUp ? <SignUpForm /> : <SignInForm />}
            <Button
              className="w-full"
              variant="surface"
              onClick={() => setOnSign(!onSignUp)}
            >
              {onSignUp ? "Go to Sign in" : "Go to Sign up"}
            </Button>
            <Button className="w-full" variant="soft" onClick={logInAsGuest}>
              Or log in as a Guest
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    return <RedirectToSignIn />;
  }
};

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  const cpk = env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  console.log(env.NEXT_PUBLIC_IS_PORTFOLIO);
  return (
    <ClerkProvider {...pageProps} publishableKey={cpk}>
      <RecoilRoot>
        <Theme>
          <SignedIn>
            <Navbar />
            <Component {...pageProps} />
          </SignedIn>
          <SignedOut>
            <LoggedOut></LoggedOut>
          </SignedOut>
          <ToastContainer />
        </Theme>
      </RecoilRoot>
    </ClerkProvider>
  );
};

const I18nApp = appWithTranslation(MyApp, nextI18nConfig);
const TRPCApp = trpc.withTRPC(I18nApp);

export default TRPCApp;
