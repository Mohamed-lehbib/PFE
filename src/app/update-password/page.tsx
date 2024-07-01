"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, message as messageApi } from "antd";
import { createClient } from "@/utils/supabase/client";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const UpdatePassword = () => {
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: updatedData, error } = await supabase.auth.updateUser({
        password: data.password,
      });
      if (error) {
        throw error;
      }
      messageApi.success({
        content: "Password updated successfully",
        duration: 2,
        className: "custom-class",
      });
      router.push("/");
    } catch (error: any) {
      console.error("Error:", error);
      messageApi.error({
        content: `Failed to update password: ${error.message}`,
        duration: 10,
        className: "custom-class",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full h-screen">
        <div className="w-full md:w-1/2 p-8 space-y-6 flex flex-col justify-center bg-white md:px-24 h-full">
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
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-[2.5rem]"
            >
              Update Password
            </Button>
          </form>
        </div>
        <div className="hidden md:flex w-1/2 p-8 space-y-6 flex-col justify-center items-center bg-blue-600 text-white rounded-l-xl px-24">
          <h2 className="text-5xl font-extrabold text-center">
            Hello, Friend!
          </h2>
          <p className="text-xl text-left">
            This app is created for generating admin dashboards with logic, just
            a few clicks away. Experience seamless and efficient dashboard
            creation like never before.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
