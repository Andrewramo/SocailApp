import { useContext, useRef, useState } from "react";
import {
  Bookmark,
  FileText,
  MapPin,
  Mail,
  Calendar,
  Users,
  Camera,
  Venus,
  Mars,
} from "lucide-react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import HashLoader from "react-spinners/HashLoader";
import { AuthContext } from "./../Context/AuthContext";
import toast from "react-hot-toast";
import PostsCard from "./../PostsCard/PostsCard";
import { Helmet } from "react-helmet";

const PLACEHOLDER_IMAGE =
  "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

function getMyProfile() {
  return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
  });
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const fileRef = useRef(null);
  const { setuserPhoto, userLoggedId } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // ── Queries ──────────────────────────────────
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getMyProfile"],
    queryFn: getMyProfile,
  });

  const { data: dataPosts } = useQuery({
    queryKey: ["getUserPosts", userLoggedId],
    queryFn: () =>
      axios.get(
        `https://route-posts.routemisr.com/users/${userLoggedId}/posts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      ),
    enabled: !!userLoggedId,
  });

  const { data: bookmarkData } = useQuery({
    queryKey: ["getUserBookmarks"],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/users/bookmarks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }),
  });

  // ── Mutation ─────────────────────────────────
  const { mutate } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      if (fileRef.current?.files?.[0])
        formData.append("photo", fileRef.current.files[0]);
      return axios.put(
        `https://route-posts.routemisr.com/users/upload-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
    },
    onSuccess: (res) => {
      toast.success("تم تغيير الصورة بنجاح ✓");
      setuserPhoto(res.data.data.photo);
      queryClient.invalidateQueries({ queryKey: ["getMyProfile"] });
    },
    onError: () => toast.error("حدث خطأ أثناء تغيير الصورة، حاول مرة أخرى"),
  });

  // ── Loading & Error ───────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <HashLoader color="#1877f2" size={70} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl border border-slate-200">
          <h1 className="text-2xl font-bold text-[#1877f2] mb-3">حدث خطأ</h1>
          <p className="text-slate-500">يرجى المحاولة مرة أخرى لاحقًا</p>
        </div>
      </div>
    );
  }

  // ── Data ─────────────────────────────────────
  const {
    bookmarksCount,
    createdAt,
    dateOfBirth,
    email,
    followersCount,
    followingCount,
    gender,
    name,
    photo,
    username,
    postsCount,
  } = data?.data?.data.user;
  const posts = dataPosts?.data.data.posts || [];
  const saved = bookmarkData?.data.data.bookmarks || [];

  return (
    <>
      <Helmet>
        <title>{name}'s Profile Page </title>
      </Helmet>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-5">
          {/* ── Profile Card ─────────────────────── */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm">
            {/* Cover */}
            <div className="relative h-40 sm:h-52 lg:h-64 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-600 overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                  backgroundSize: "60px 60px",
                }}
              />
              <div className="absolute top-8 right-12 w-32 h-32 rounded-full bg-blue-400/10 blur-2xl" />
              <label className="absolute top-3 right-3 cursor-pointer flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full transition backdrop-blur-sm">
                <Camera size={12} />
                تغيير الغلاف
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>

            {/* Profile Info */}
            <div className="px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8">
              {/* Avatar Row */}
              <div className="flex flex-wrap items-end justify-between -mt-12 sm:-mt-14 lg:-mt-16 mb-4 gap-3">
                <div className="relative group shrink-0">
                  <img
                    src={photo || PLACEHOLDER_IMAGE}
                    alt={name}
                    className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-white object-cover shadow-md"
                  />
                  <label className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition cursor-pointer">
                    <Camera size={18} className="text-white" />
                    <input
                      ref={fileRef}
                      onChange={() => mutate()}
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#1877f2] text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100 mb-1">
                  <Users size={12} />
                  Route Posts member
                </div>
              </div>

              {/* Name */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                {name}
              </h1>
              <p className="text-slate-400 text-sm lg:text-base mt-0.5">
                {username}
              </p>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-3 gap-3 lg:gap-4">
                {[
                  { label: "Followers", value: followersCount },
                  { label: "Following", value: followingCount },
                  { label: "Bookmarks", value: bookmarksCount },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-slate-50 rounded-2xl p-3 lg:p-5 text-center border border-slate-200/80"
                  >
                    <p className="text-[9px] sm:text-[11px] lg:text-xs font-bold text-slate-400 uppercase tracking-wide">
                      {s.label}
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* About + Mini Stats */}
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
                {/* About */}
                <div className="bg-slate-50 rounded-2xl p-4 lg:p-5 border border-slate-200/80">
                  <p className="text-sm lg:text-base font-bold text-slate-700 mb-3">
                    About
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      {
                        icon: <Mail size={14} className="text-[#1877f2]" />,
                        text: email,
                      },
                      {
                        icon: <Calendar size={14} className="text-[#1877f2]" />,
                        text: dateOfBirth
                          ? new Date(dateOfBirth).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "—",
                      },
                      {
                        icon:
                          gender === "male" ? (
                            <Mars size={14} className="text-[#1877f2]" />
                          ) : (
                            <Venus size={14} className="text-pink-500" />
                          ),
                        text: gender || "—",
                      },
                      {
                        icon: <Users size={14} className="text-[#1877f2]" />,
                        text: `Joined ${new Date(createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
                      },
                    ].map((row, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 text-sm lg:text-base text-slate-600"
                      >
                        <span className="shrink-0">{row.icon}</span>
                        <span className="truncate">{row.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini Stats */}
                <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[140px]">
                  {[
                    { label: "My posts", value: posts?.length ?? postsCount },
                    { label: "Saved", value: bookmarksCount },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex-1 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 lg:py-4"
                    >
                      <p className="text-[10px] lg:text-xs font-bold text-[#1877f2] uppercase tracking-wider">
                        {s.label}
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-blue-800 mt-1">
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Posts Section ───────────────────── */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm">
            {/* Tabs */}
            <div className="flex items-center justify-between px-4 sm:px-5 lg:px-6 py-3 border-b border-slate-100 bg-slate-50/60">
              <div className="flex gap-1.5">
                {[
                  {
                    key: "posts",
                    label: "My Posts",
                    icon: <FileText size={14} />,
                  },
                  {
                    key: "saved",
                    label: "Saved",
                    icon: <Bookmark size={14} />,
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeTab === tab.key
                        ? "bg-white text-[#1877f2] shadow-sm border border-slate-200/80"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
              <span className="bg-blue-50 text-[#1877f2] text-xs font-bold px-3 py-1 rounded-full">
                {activeTab === "posts" ? posts?.length : saved?.length}
              </span>
            </div>

            {/* Posts List */}
            <div className="divide-y divide-slate-100">
              {(activeTab === "posts" ? posts : saved).length > 0 ? (
                (activeTab === "posts" ? posts : saved).map((post) => (
                  <div key={post._id} className="p-3 sm:p-4">
                    <PostsCard post={post} isMyProfile />
                  </div>
                ))
              ) : (
                <div className="text-center py-14 text-slate-400">
                  <p className="font-semibold text-sm">لا توجد منشورات بعد</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
