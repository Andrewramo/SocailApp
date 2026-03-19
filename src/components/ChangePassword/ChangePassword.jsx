import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { Helmet } from "react-helmet";

const fields = [
  {
    label: "Current password",
    placeholder: "Enter current password",
    zodName: "currentPassword",
  },
  {
    label: "New password",
    placeholder: "Enter new password",
    zodName: "newPassword",
  },
  {
    label: "Confirm new password",
    placeholder: "Re-enter new password",
    zodName: "confirmPassword",
  },
];

const schema = zod
  .object({
    currentPassword: zod.string().min(1, "Current password is required"),
    newPassword: zod
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/,
        "Password 8–20 chars, include uppercase, lowercase, number & special char.",
      )
      .min(8, "At least 8 characters"),
    confirmPassword: zod.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ChangePassword() {
  const [showPasswords, setshowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  function togglePassword(field) {
    setshowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schema),
  });

  function change(values) {
    const newData = {
      password: values.currentPassword,
      newPassword: values.newPassword,
    };
    mutate(newData);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (values) =>
      axios.patch(
        `https://route-posts.routemisr.com/users/change-password`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "Content-Type": "application/json",
          },
        },
      ),
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور بنجاح ✓");
    },
    onError: () => {
      toast.error("حدث خطأ، تأكد من كلمة المرور الحالية");
    },
  });

  return (
    <>
      <Helmet>
        <title>Change Password Page</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md sm:max-w-xl lg:max-w-3xl">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
            {/* Header */}
            <div className="bg-[#1877f2] px-6 py-7 sm:px-10 sm:py-9 lg:px-14 lg:py-10">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white/25 rounded-2xl flex items-center justify-center shrink-0">
                  <KeyRound size={22} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                    Change Password
                  </h1>
                  <p className="text-white/80 text-xs sm:text-sm lg:text-base mt-1 leading-relaxed">
                    Keep your account secure with a strong password.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(change)}
              className="px-6 py-7 sm:px-10 sm:py-9 lg:px-14 lg:py-10 space-y-6"
            >
              {/* Fields Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {fields.map(({ label, placeholder, zodName }) => (
                  <div
                    key={label}
                    className={
                      zodName === "confirmPassword" ? "lg:col-span-2" : ""
                    }
                  >
                    <label className="block mb-1.5 text-sm font-bold text-slate-700">
                      {label}
                    </label>
                    <div className="relative">
                      <input
                        {...register(zodName)}
                        type={showPasswords[zodName] ? "text" : "password"}
                        placeholder={placeholder}
                        className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm text-slate-800 bg-slate-50 outline-none transition
                        ${
                          errors[zodName]
                            ? "border-rose-300 focus:border-rose-400 bg-rose-50/30"
                            : "border-slate-200 focus:border-[#1877f2] focus:bg-white focus:ring-2 focus:ring-[#1877f2]/10"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword(zodName)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                      >
                        {showPasswords[zodName] ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>
                    </div>
                    {errors[zodName] && (
                      <p className="mt-1.5 text-xs font-semibold text-rose-500">
                        {errors[zodName].message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Hint */}
              <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <ShieldCheck
                  size={16}
                  className="text-blue-500 mt-0.5 shrink-0"
                />
                <p className="text-xs sm:text-sm text-blue-700 font-medium leading-relaxed">
                  Use at least 8 characters with a mix of letters, numbers, and
                  symbols.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#1877f2] hover:bg-[#166fe5] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold text-sm sm:text-base lg:text-lg py-3 sm:py-3.5 lg:py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-300/50"
              >
                {isPending ? "جاري التحديث..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
