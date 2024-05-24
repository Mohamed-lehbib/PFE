"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { Spin } from "antd";
import { motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TypingText from "@/components/typing-text";

interface FormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

const Auth = () => {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsSignUp(searchParams.get("mode") === "signup");
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await fetch(
        `/api/auth?mode=${isSignUp ? "signup" : "signin"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.error);
        return;
      }

      const result = await response.json();
      console.log("Success:", result);

      router.push("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-scree w-screen">
          <Spin tip="Loading" size="large" />
        </div>
      }
    >
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex w-full h-screen">
          <motion.div
            initial={{ opacity: 0, x: isSignUp ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-1/2 p-8 space-y-6 flex flex-col justify-center bg-white px-24"
          >
            <h2 className="text-3xl font-bold text-center">
              {isSignUp ? "Sign Up" : "Sign In"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {isSignUp && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {isSignUp && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                    className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              )}
              <button
                type="submit"
                className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </form>
            <div className="text-sm text-center text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() =>
                  router.push(`/auth?mode=${isSignUp ? "signin" : "signup"}`)
                }
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: isSignUp ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-1/2 p-8 space-y-6 flex flex-col justify-center items-center bg-blue-600 text-white rounded-l-xl px-24"
          >
            <h2 className="text-5xl font-extrabold text-center">
              Hello, Friend!
            </h2>
            <TypingText className="text-xl text-left">
              This app is created for generating admin dashboards with logic,
              just a few clicks away. Experience seamless and efficient
              dashboard creation like never before.
            </TypingText>
          </motion.div>
        </div>
      </div>
    </Suspense>
  );
};

export default Auth;
