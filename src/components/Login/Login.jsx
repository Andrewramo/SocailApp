import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Link, useNavigate } from "react-router-dom";
import * as zod from "zod";
import { AuthContext } from "../Context/AuthContext";
import { Helmet } from "react-helmet";

const schema = zod.object({
  email: zod
    .email("enter a valid email")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "enter a valid email")
    .nonempty("please enter your email"),
  password: zod
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/,
      "Password 8–20 chars, include uppercase, lowercase, number & special char.",
    )
    .nonempty("please create password"),
});

export default function Login() {
  const navigate = useNavigate();
  const [apiError, setapiError] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const { IsLog, setIsLog } = useContext(AuthContext);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const {
    register,
    handleSubmit,
    watch,
    setError,
    getValues,
    formState: { errors, touchedFields },
  } = form;
  function handleLogin(user) {
    setisLoading(true);

    axios
      .post(`https://route-posts.routemisr.com/users/signin`, user)
      .then((res) => {
        console.log(res.data.message);
        if (res.data.message === "signed in successfully") {
          console.log(res.data.data.token);
          localStorage.setItem("userToken", res.data.data.token);
          setIsLog(res.data.data.token);
          navigate("/");
        }

        setisLoading(false);
      })
      .catch((err) => {
        console.log(err.response.data.message);

        toast.error(err.response.data.errors);
        setisLoading(false);
      });
  }

  return (
    <>
      <Helmet>
        <title>Sign In </title>
      </Helmet>
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="space-y-5">
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">البريد الإلكتروني</label>
            <input
              {...register("email")}
              type="email"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="example@mail.com"
            />
            {errors.email && touchedFields.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">كلمة المرور</label>
            <input
              {...register("password")}
              type="password"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
            />
            {errors.password && touchedFields.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold  disabled:bg-slate-700 hover:bg-blue-700 transition"
          >
            {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
          </button>
        </div>
      </form>
    </>
  );
}
