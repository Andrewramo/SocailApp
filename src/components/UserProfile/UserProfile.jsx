import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, UserPlus, UserMinus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import PostsCard from "../PostsCard/PostsCard";
import { Helmet } from "react-helmet";

const PLACEHOLDER_IMAGE =
  "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const query = useQueryClient();

  // ── Queries ──────────────────────────────────
  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["getUserProfile", userId],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/users/${userId}/profile`, {
        headers: getAuthHeader(),
      }),
  });

  const {
    data: userPosts,
    isLoading: postsLoading,
    isError: postsError,
  } = useQuery({
    queryKey: ["getUserProfilePosts", userId],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/users/${userId}/posts`, {
        headers: getAuthHeader(),
      }),
  });

  // ── Follow Mutation ───────────────────────────
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axios.put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {},
        { headers: getAuthHeader() },
      ),
    onSuccess: (res) => {
      query.setQueryData(["getUserProfile", userId], (oldData) => ({
        ...oldData,
        data: {
          ...oldData.data,
          data: { ...oldData.data.data, isFollowing: res.data.data.following },
        },
      }));
    },
  });

  if (userLoading || postsLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <HashLoader color="#1877f2" size={70} />
      </div>
    );
  }

  if (userError || postsError) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl border border-slate-200">
          <h1 className="text-2xl font-bold text-[#1877f2] mb-3">حدث خطأ</h1>
          <p className="text-slate-500">يرجى المحاولة مرة أخرى لاحقًا</p>
        </div>
      </div>
    );
  }

  const { name, username, photo } = userData?.data?.data?.user;
  const { isFollowing } = userData?.data?.data;
  const posts = userPosts?.data?.data.posts || [];

  return (
    <>
      <Helmet>
        <title>{name}'s Profile Page </title>
      </Helmet>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-5">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#1877f2] transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {/* Profile Card - بدون overflow-hidden عشان الصورة تطلع فوق */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            {/* Cover - overflow-hidden هنا بس */}
            <div className="h-40 sm:h-52 lg:h-56 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-600 relative overflow-hidden rounded-t-2xl">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                  backgroundSize: "60px 60px",
                }}
              />
              <div className="absolute top-8 right-12 w-32 h-32 rounded-full bg-blue-400/10 blur-2xl" />
            </div>

            {/* Info */}
            <div className="px-4 sm:px-6 lg:px-8 pb-6">
              {/* Avatar + Follow Row */}
              <div className="flex items-end justify-between -mt-10 sm:-mt-12 lg:-mt-14 mb-5">
                <img
                  src={photo || PLACEHOLDER_IMAGE}
                  alt={name}
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full border-4 border-white object-cover shadow-md shrink-0 z-30"
                  onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
                />
                <button
                  onClick={() => mutate()}
                  disabled={isPending}
                  className={`inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-extrabold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                    isFollowing
                      ? "bg-white text-slate-700 border border-slate-300 hover:bg-red-50 hover:text-red-500 hover:border-red-300"
                      : "bg-[#1877f2] text-white hover:bg-[#166fe5] shadow-md shadow-blue-200"
                  }`}
                >
                  {isFollowing ? (
                    <UserMinus size={15} />
                  ) : (
                    <UserPlus size={15} />
                  )}
                  {isPending ? "..." : isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                {name}
              </h1>
              <p className="text-slate-400 text-sm lg:text-base mt-0.5">
                {username}
              </p>
            </div>
          </div>

          {/* Posts */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm">
            <div className="px-4 sm:px-5 lg:px-6 py-3 border-b border-slate-100 bg-slate-50/60">
              <p className="text-sm font-bold text-slate-700">
                المنشورات{" "}
                <span className="text-[#1877f2] font-extrabold">
                  ({posts.length})
                </span>
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post._id} className="p-3 sm:p-4">
                    <PostsCard post={post} />
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
