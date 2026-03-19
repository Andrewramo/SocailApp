import { useState } from "react";
import Login from "./../Login/Login";
import Register from "../Register/Register";

export default function Auth() {
  const [isActive, setisActive] = useState("login");

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* LEFT SIDE - مخفي على الموبايل */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 text-white items-center justify-center p-10">
          <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
            alt="Auth"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative z-10 max-w-md">
            <h1 className="text-4xl font-bold mb-4">مرحباً بك في موقعنا</h1>
            <p className="text-lg leading-relaxed opacity-90">
              منصة تواصل اجتماعي حديثة توفر لك مشاركة الصور، المنشورات، والتواصل
              مع أصدقائك بسهولة.
            </p>
            <div className="mt-6 space-y-2 text-blue-100">
              <p>⚡ سريع و آمن</p>
              <p>📷 مشاركة صور عالية الجودة</p>
              <p>💬 تواصل مع أصدقائك في أي وقت</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 min-h-screen bg-white flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-10">
          {/* Logo - بيظهر بس على الموبايل */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2">
              <div className="w-9 h-9 bg-[#1877f2] rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
                <span className="text-white font-black text-base">S</span>
              </div>
              <span className="font-black text-slate-900 text-xl tracking-tight">
                Social<span className="text-[#1877f2]">App</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-2">
              منصة التواصل الاجتماعي
            </p>
          </div>

          {/* Max width container */}
          <div className="w-full max-w-md mx-auto">
            {/* TABS */}
            <div className="flex bg-slate-100 rounded-2xl p-1 mb-8">
              <button
                onClick={() => setisActive("login")}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                  isActive === "login"
                    ? "bg-white text-[#1877f2] shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => setisActive("register")}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                  isActive === "register"
                    ? "bg-white text-[#1877f2] shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                إنشاء حساب
              </button>
            </div>

            {/* TAB CONTENT */}
            {isActive === "login" && <Login />}
            {isActive === "register" && (
              <Register switchToLogin={() => setisActive("login")} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
