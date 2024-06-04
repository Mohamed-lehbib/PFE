"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingOverlay from "react-loading-overlay-ts";
import { message as messageApi } from "antd";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const UpdatePassword = () => {
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsActive(true);
    try {
      const response = await fetch(`/api/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email, newPassword: data.password }),
      });

      const responseText = await response.text();
      console.log("Response Status:", response.status);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          console.error("Error:", errorData.error);
          messageApi.error({
            content: `Failed to update password: ${errorData.error}`,
            duration: 10,
            className: "custom-class",
          });
        } catch (e) {
          console.error("Error parsing response as JSON:", e);
          messageApi.error({
            content: `Failed to update password: ${responseText}`,
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
        content: "Password updated successfully",
        duration: 2,
        className: "custom-class",
      });

      router.push("/signin?mode=signin");
    } catch (error) {
      console.error("Error:", error);
      messageApi.error({
        content: `Failed to update password: ${error}`,
        duration: 10,
        className: "custom-class",
      });
    }
    setIsActive(false);
  };

  return (
    <LoadingOverlay active={isActive} spinner>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex w-full h-screen">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-1/2 p-8 space-y-6 flex flex-col justify-center bg-white px-24"
          >
            <h2 className="text-3xl font-bold text-center">Update Password</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  value={email ?? ""}
                  readOnly
                  {...register("email")}
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
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "New Password is required",
                  })}
                  className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword", {
                    required: "Confirm New Password is required",
                    validate: (value) =>
                      value === watch("password") ?? "Passwords do not match",
                  })}
                  className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Update Password
              </button>
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-1/2 p-8 space-y-6 flex flex-col justify-center items-center bg-blue-600 text-white rounded-l-xl px-24"
          >
            <h2 className="text-5xl font-extrabold text-center">
              Hello, Friend!
            </h2>
            <p className="text-xl text-left">
              This app is created for generating admin dashboards with logic,
              just a few clicks away. Experience seamless and efficient
              dashboard creation like never before.
            </p>
          </motion.div>
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default UpdatePassword;
