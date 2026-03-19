import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as zod from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
const schema = zod
  .object({
    name: zod
      .string()
      .min(3, "min length is 3 chars")
      .max(10, "max length is 10 chars")
      .nonempty("please enter your name"),
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
    rePassword: zod.string().nonempty("please confirm your password"),
    dateOfBirth: zod
      .string()
      .refine((date) => {
        const userValue = new Date(date);
        const currentDate = new Date();
        if (currentDate.getFullYear() - userValue.getFullYear() > 10) {
          return true;
        } else {
          return false;
        }
      }, "You must be at least 10 years old")
      .nonempty("please enter your birthday"),
    // zod.string().nonempty("please confirm your password"),
    // dateOfBirth: zod.coerce
    //   .date()
    //   .refine((value) => {
    //     const currentDate = new Date().getFullYear();
    //     const userValue = value.getFullYear();

    //     return currentDate - userValue >= 10;
    //   }, "You must be at least 10 years old")
    //   .transform((date) => {
    //     return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()} `; // this will return date in string
    //   }),
    gender: zod
      .string("please select your gender")
      .regex(/^(male|female)$/, "please select your gender"),
  })
  .refine(
    (values) => {
      if (values.password === values.rePassword) {
        return true;
      } else {
        return false;
      }
    },
    { error: "doesn't match", path: ["rePassword"] },
  );

export default function Register({ switchToLogin }) {
  const navigate = useNavigate();
  const [apiError, setapiError] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
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
  function handleRegister(user) {
    setisLoading(true);
    console.log(user);

    axios
      .post(`https://route-posts.routemisr.com/users/signup`, user)
      .then((res) => {
        console.log(res.data.message);
        if (res.data.message === "account created") {
          setisLoading(false);
          console.log(res.data);
          if (switchToLogin) switchToLogin();
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);
        toast.error(err.response.data.message);
        setisLoading(false);
      });

    // if (user.password === user.rePassword) {
    //   console.log(user);
    // } else {
    //   setError("rePassword", { message: "doesn't match" });
    // }
  }

  const passwordValue = watch("password");
  // const passwordValue = getValues("password");
  return (
    <>
      <Helmet>
        <title>Creat Account </title>
      </Helmet>
      <form onSubmit={handleSubmit(handleRegister)}>
        <div className="space-y-5">
          {/* name */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">الاسم</label>
            <input
              {...register("name")}
              type="text"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="مثال: أحمد"
            />
            {errors.name && touchedFields.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* email */}
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

          {/* password */}
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

          {/* rePassword */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">تأكيد كلمة المرور</label>
            <input
              {...register("rePassword")}
              type="password"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
            />
            {errors.rePassword && touchedFields.rePassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.rePassword.message}
              </p>
            )}
          </div>

          {/* date */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">تاريخ الميلاد</label>
            <input
              {...register("dateOfBirth")}
              type="date"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.dateOfBirth && touchedFields.dateOfBirth && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          {/* gender */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-2">النوع</label>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("gender")}
                  type="radio"
                  value="male"
                  className="w-4 h-4"
                />
                <span>ذكر</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("gender")}
                  type="radio"
                  value="female"
                  className="w-4 h-4"
                />
                <span>أنثى</span>
              </label>
            </div>

            {errors.gender && touchedFields.gender && (
              <p className="text-red-500 text-sm mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold disabled:bg-slate-700 hover:bg-blue-700 transition"
          >
            {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
          </button>
        </div>
      </form>
    </>
  );
}
