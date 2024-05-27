// src/pages/_app.tsx
import { useSignIn, useSignUp } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";
import "@radix-ui/themes/styles.css";
import { Box, Button, Tabs } from "@radix-ui/themes";
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
      setFormErrors({});

      if (!isLoaded) {
        return;
      }

      try {
        const result = await signUp.create({
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailAddress: formData.email,
          password: formData.password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          router.push("/");
        } else {
          console.log(result);
        }
      } catch (err: any) {
        console.error("error", err.errors[0].longMessage);
      }
    }
  };

  return (
    <div>
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
      setFormErrors({});

      if (!isLoaded) {
        return;
      }

      try {
        const result = await signIn.create({
          identifier: formData.email,
          password: formData.password,
        });

        if (result.status === "complete") {
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
        <Button
          type="submit"
          className="text-white w-full rounded-md bg-blue-500 px-4 py-1 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}

const PortfolioLandingPage = () => {
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

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-center space-x-6">
        <div className="mx-auto mt-10 w-[300px] space-y-3 rounded-lg border bg-slate p-6 shadow-sm">
          <Tabs.Root defaultValue="signIn">
            <Tabs.List>
              <Tabs.Trigger value="signIn">Sign Up</Tabs.Trigger>
              <Tabs.Trigger value="signUp">Sign In</Tabs.Trigger>
            </Tabs.List>
            <Box px="4" pt="3" pb="2">
              <Tabs.Content value="signIn">
                <SignUpForm />
              </Tabs.Content>

              <Tabs.Content value="signUp">
                <SignInForm />
              </Tabs.Content>
              <Button className="w-full" variant="soft" onClick={logInAsGuest}>
                Or log in as a Guest
              </Button>
            </Box>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
};

export default PortfolioLandingPage;
