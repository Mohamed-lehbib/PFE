"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TypingText from "@/components/typing-text";
import LoadingOverlay from "react-loading-overlay-ts";
import { message as messageApi } from "antd";

interface FormData {
  name?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

const Auth = () => {
  const [mode, setMode] = useState("signin"); // Default mode is "signin"
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMode(searchParams.get("mode") ?? "signin");
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsActive(true);
    try {
      const response = await fetch(`/api/auth?mode=${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();
      console.log("Response Status:", response.status);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          console.error("Error:", errorData.error);
          messageApi.error({
            content: `Failed to ${mode}: ${errorData.error}`,
            duration: 10,
            className: "custom-class",
          });
        } catch (e) {
          console.error("Error parsing response as JSON:", e);
          messageApi.error({
            content: `Failed to ${mode}: ${responseText}`,
            duration: 10,
            className: "custom-class",
          });
        }
        setIsActive(false);
        return;
      }

      const result = JSON.parse(responseText);
      console.log("Success:", result);
      messageApi.success({
        content: `${mode} successfully`,
        duration: 2,
        className: "custom-class",
      });
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      messageApi.error({
        content: `Failed to ${mode}: ${error}`,
        duration: 10,
        className: "custom-class",
      });
    }
    setIsActive(false);
  };

  const handleForgotPassword = () => {
    router.push(`/signin?mode=reset-password`);
    console.log("clicked");
  };

  const getTitle = (mode: string) => {
    switch (mode) {
      case "signup":
        return "Sign Up";
      case "signin":
        return "Sign In";
      default:
        return "Reset Password";
    }
  };

  return (
    <LoadingOverlay active={isActive} spinner>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex w-full h-screen">
          <motion.div
            initial={{ opacity: 0, x: mode === "signup" ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-1/2 p-8 space-y-6 flex flex-col justify-center bg-white px-24"
          >
            <h2 className="text-3xl font-bold text-center">{getTitle(mode)}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {mode === "signup" && (
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
              {mode !== "reset-password" && (
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
              )}
              {mode === "signup" && (
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
                {getTitle(mode)}
              </button>
            </form>
            {mode === "signin" && (
              <div className="text-sm text-center text-gray-600">
                <button
                  onClick={handleForgotPassword}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot Password?
                </button>
              </div>
            )}
            {mode !== "reset-password" && (
              <div className="text-sm text-center text-gray-600">
                {mode === "signup"
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  onClick={() =>
                    router.push(
                      `/signin?mode=${mode === "signup" ? "signin" : "signup"}`
                    )
                  }
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  {mode === "signup" ? "Sign In" : "Sign Up"}
                </button>
              </div>
            )}
            {mode === "reset-password" && (
              <div className="text-sm text-center text-gray-600">
                <span>Try signing in again</span>
                <button
                  onClick={() => router.push(`/signin?mode=signin`)}
                  className="font-medium text-blue-600 hover:text-blue-500 ml-1"
                >
                  Back
                </button>
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: mode === "signup" ? 100 : -100 }}
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
    </LoadingOverlay>
  );
};

export default Auth;
