import axios from "axios";
import PostsCard from "../PostsCard/PostsCard";
import HashLoader from "react-spinners/HashLoader";
import { useQuery } from "@tanstack/react-query";
import PostCreation from "../PostCreation/PostCreation";
import { Helmet } from "react-helmet";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import SuggestionContact from "./../SuggestionContact/SuggestionContact";
import { Home as HomeIcon, FileText, Globe, Bookmark } from "lucide-react";

const tabs = [
  { name: "feeds", icon: <HomeIcon size={18} />, label: "News Feed" },
  { name: "my posts", icon: <FileText size={18} />, label: "My Posts" },
  { name: "community", icon: <Globe size={18} />, label: "Community" },
  { name: "saved", icon: <Bookmark size={18} />, label: "Saved" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("community");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userLoggedId } = useContext(AuthContext);

  // ── API Functions ────────────────────────────
  const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/posts`, {
        headers: getAuthHeader(),
        params: { sort: "-createdAt" },
      }),
  });

  const { data: feedData } = useQuery({
    queryKey: ["getFeed"],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/posts/feed`, {
        headers: getAuthHeader(),
        params: { only: "following" },
      }),
    enabled: activeTab === "feeds",
  });

  const { data: bookmarkData } = useQuery({
    queryKey: ["getUserBookmarks"],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/users/bookmarks`, {
        headers: getAuthHeader(),
      }),
    enabled: activeTab === "saved",
  });

  const { data: myPostsData } = useQuery({
    queryKey: ["getUserPosts"],
    queryFn: () =>
      axios.get(
        `https://route-posts.routemisr.com/users/${userLoggedId}/posts`,
        { headers: getAuthHeader() },
      ),
    enabled: !!userLoggedId && activeTab === "my posts",
  });

  const { data: suggestionsData } = useQuery({
    queryKey: ["getSuggestions"],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/users/suggestions`, {
        headers: getAuthHeader(),
        params: { limit: "5" },
      }),
    staleTime: 1000 * 60 * 5,
  });

  // ── Data ─────────────────────────────────────
  const suggestionContacts = suggestionsData?.data?.data?.suggestions || [];
  const myPosts = myPostsData?.data?.data?.posts || [];
  const savedPosts = bookmarkData?.data?.data?.bookmarks || [];
  const feedPosts = feedData?.data?.data?.posts || [];
  const communityPosts = data?.data?.data?.posts || [];

  const activePosts =
    activeTab === "community"
      ? communityPosts
      : activeTab === "feeds"
        ? feedPosts
        : activeTab === "saved"
          ? savedPosts
          : myPosts;

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-blue-50">
        <HashLoader color="#2563eb" size={80} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-blue-50">
        <div className="text-center p-10 bg-white/90 rounded-3xl shadow-xl border border-blue-100">
          <h1 className="text-3xl font-bold text-blue-700 mb-4">حدث خطأ</h1>
          <p className="text-gray-600 text-lg">يرجى المحاولة مرة أخرى لاحقًا</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Mobile Tab Bar */}
        <div className="lg:hidden sticky top-14 z-30 bg-white border-b border-slate-200 px-3 py-2">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.name
                    ? "bg-blue-50 text-[#1877f2]"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex max-w-screen-2xl mx-auto">
          {/* Left Sidebar */}
          <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 h-[calc(100vh-64px)] sticky top-16 bg-white border-r border-slate-200 overflow-y-auto">
            <div className="p-5 flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">
                Menu
              </p>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${
                      activeTab === tab.name
                        ? "bg-blue-50 text-[#1877f2] shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span
                      className={
                        activeTab === tab.name
                          ? "text-[#1877f2]"
                          : "text-slate-400"
                      }
                    >
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="flex-1 min-w-0 px-3 sm:px-6 py-6">
            <div className="max-w-2xl mx-auto space-y-5">
              <PostCreation />

              {activePosts.length > 0 ? (
                activePosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <PostsCard post={post} />
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-200">
                  <p className="text-lg font-semibold">لا توجد منشورات بعد</p>
                  <p className="mt-1 text-sm">ابدأ بنشر شيء جديد!</p>
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden xl:flex flex-col w-72 2xl:w-80 shrink-0 h-[calc(100vh-64px)] sticky top-16 bg-white border-l border-slate-200 overflow-y-auto">
            <div className="p-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Suggestions
              </p>
              <div className="space-y-3">
                {suggestionContacts.map((user) => (
                  <SuggestionContact user={user} key={user._id} />
                ))}
              </div>
              {suggestionContacts.length > 0 && (
                <button className="mt-5 w-full text-center text-sm font-semibold text-[#1877f2] hover:underline transition">
                  See all suggestions →
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
