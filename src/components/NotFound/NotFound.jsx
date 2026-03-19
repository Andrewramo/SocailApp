import { Link } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";
import { Helmet } from "react-helmet";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Not Found 404</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-28 h-28 sm:w-36 sm:h-36 bg-blue-100 rounded-full flex items-center justify-center">
                <SearchX size={52} className="text-[#1877f2] sm:w-16 sm:h-16" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#1877f2] rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
                <span className="text-white font-black text-sm">!</span>
              </div>
            </div>
          </div>

          {/* 404 */}
          <h1 className="text-8xl sm:text-9xl font-black text-[#1877f2] leading-none mb-2 tracking-tight">
            404
          </h1>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-3">
            الصفحة غير موجودة
          </h2>

          {/* Description */}
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-10 max-w-sm mx-auto">
            يبدو أن الصفحة التي تبحث عنها لا توجد أو تم نقلها أو حذفها.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1877f2] hover:bg-[#166fe5] active:scale-[0.98] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-200"
            >
              <Home size={17} />
              الرجوع للرئيسية
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm px-6 py-3 rounded-xl border border-slate-200 transition-all duration-200"
            >
              <ArrowLeft size={17} />
              الصفحة السابقة
            </button>
          </div>

          {/* Divider */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-xs text-slate-400 font-medium">
              Social<span className="text-[#1877f2]">App</span> ©{" "}
              {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
