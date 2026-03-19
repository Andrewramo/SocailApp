import {
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { Home, Settings, LogOut, User, Menu, X } from "lucide-react";

export default function MyNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { IsLog, setIsLog, userPhoto } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogOut() {
    localStorage.removeItem("userToken");
    setIsLog(null);
    navigate("/auth");
  }

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-[#1877f2] rounded-xl flex items-center justify-center shadow-md shadow-blue-200 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-sm">S</span>
              </div>
              <span className="font-black text-slate-900 text-lg tracking-tight hidden sm:block">
                Social<span className="text-[#1877f2]">App</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden sm:flex items-center gap-2">
              {IsLog !== null && (
                <>
                  <Link
                    to="/"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-[#1877f2] transition-all"
                  >
                    <Home size={16} />
                    Home
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-[#1877f2] transition-all"
                  >
                    <User size={16} />
                    Profile
                  </Link>
                </>
              )}
              {IsLog === null && (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#1877f2] hover:bg-[#166fe5] shadow-md shadow-blue-200 transition-all"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {IsLog !== null && (
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                      <Avatar
                        size="sm"
                        src={userPhoto}
                        className="w-7 h-7"
                        isBordered
                        color="primary"
                      />
                      <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                        Account
                      </span>
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Profile Actions"
                    variant="flat"
                    className="min-w-[180px]"
                  >
                    <DropdownItem
                      key="profile"
                      textValue="Profile"
                      startContent={
                        <User size={15} className="text-slate-500" />
                      }
                    >
                      <Link className="block w-full" to="/profile">
                        Profile
                      </Link>
                    </DropdownItem>
                    <DropdownItem
                      key="settings"
                      textValue="Settings"
                      startContent={
                        <Settings size={15} className="text-slate-500" />
                      }
                    >
                      <Link className="block w-full" to="/changepassword">
                        Settings
                      </Link>
                    </DropdownItem>
                    <DropdownItem
                      key="logout"
                      color="danger"
                      textValue="Log Out"
                      startContent={<LogOut size={15} />}
                      onClick={handleLogOut}
                    >
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="sm:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-14 z-40 bg-white border-b border-slate-200 shadow-lg px-4 py-4 space-y-1">
          {IsLog !== null ? (
            <>
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1877f2] transition"
              >
                <Home size={17} /> Home
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1877f2] transition"
              >
                <User size={17} /> Profile
              </Link>
              <Link
                to="/changepassword"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1877f2] transition"
              >
                <Settings size={17} /> Settings
              </Link>
              <button
                onClick={() => {
                  handleLogOut();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition"
              >
                <LogOut size={17} /> Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white bg-[#1877f2] hover:bg-[#166fe5] transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
