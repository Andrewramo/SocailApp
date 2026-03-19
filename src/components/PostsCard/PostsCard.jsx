import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from "@heroui/react";
import Comment from "../Comment/Comment";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import CommentCreation from "../CommentCreation/CommentCreation";
import { HiDotsVertical } from "react-icons/hi";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import toast from "react-hot-toast";
import { Heart, MessageCircle, Share2, ArrowLeft } from "lucide-react";
import PostUpdate from "../PostUpdate/PostUpdate";

const PLACEHOLDER_IMAGE =
  "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

// ─────────────────────────────────────────────
// API Helper
// ─────────────────────────────────────────────
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function PostsCard({
  post,
  isPostDeatials = false,
  isMyProfile = false,
}) {
  // ── Disclosure ──────────────────────────────
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();

  // ── Post Data ───────────────────────────────
  const {
    body,
    createdAt,
    user,
    image,
    topComment,
    id,
    commentsCount = 0,
    likesCount,
    sharesCount,
    likes,
    bookmarked,
  } = post;
  const { name, photo, _id: userId } = user || {};

  // ── Context & Hooks ─────────────────────────
  const { userLoggedId } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ── Local State ─────────────────────────────
  const [liked, setliked] = useState(likes.includes(userLoggedId) || false);
  const [currentLikesCount, setcurrentLikesCount] = useState(likesCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(bookmarked || false);

  // ── Comments Query ───────────────────────────
  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ["getPostComment", id],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
        headers: getAuthHeader(),
      }),
    enabled: isPostDeatials,
  });

  const comments = isPostDeatials
    ? commentsData?.data?.data?.comments || []
    : topComment
      ? [topComment]
      : [];

  // ── Delete Post Mutation ─────────────────────
  const { mutate: deletePost, isPending: deleting } = useMutation({
    mutationFn: () =>
      axios.delete(`https://route-posts.routemisr.com/posts/${id}`, {
        headers: getAuthHeader(),
      }),
    onSuccess: () => {
      toast.success("تم حذف المنشور بنجاح");
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      if (isMyProfile)
        queryClient.invalidateQueries({ queryKey: ["getUserPosts"] });
      if (isPostDeatials) navigate("/");
    },
    onError: () => toast.error("حدث خطأ أثناء الحذف"),
  });

  // ── Like Post Mutation ───────────────────────
  const { mutate: likePost } = useMutation({
    mutationFn: () =>
      axios.put(
        `https://route-posts.routemisr.com/posts/${id}/like`,
        {},
        { headers: getAuthHeader() },
      ),
    onMutate: () => {
      const wasLiked = liked;
      setliked(!wasLiked);
      setcurrentLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));
    },
    onError: () => {
      const wasLiked = !liked;
      setliked(wasLiked);
      setcurrentLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));
    },
  });

  // ── Bookmark Post Mutation ───────────────────
  const { mutate: bookmarkPost } = useMutation({
    mutationFn: () =>
      axios.put(
        `https://route-posts.routemisr.com/posts/${id}/bookmark`,
        {},
        { headers: getAuthHeader() },
      ),
    onMutate: () => setIsBookmarked((prev) => !prev),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["getUserBookmarks"] }),
    onError: () => setIsBookmarked((prev) => !prev),
  });

  // ── Share Post Mutation ───────────────────────
  const { mutate: sharePost } = useMutation({
    mutationFn: () =>
      axios.post(
        `https://route-posts.routemisr.com/posts/${id}/share`,
        {},
        { headers: getAuthHeader() },
      ),
  });

  // ── Shared UI Elements ───────────────────────
  const BookmarkItem = (
    <DropdownItem
      key="bookmark"
      onPress={() => bookmarkPost()}
      className={isBookmarked ? "text-danger" : ""}
    >
      {isBookmarked ? "إلغاء الحفظ" : "حفظ"}
    </DropdownItem>
  );

  const UserInfo = () => (
    <div className="flex items-center gap-3">
      <Link to={`/profile/${userId}`} className="shrink-0">
        <img
          src={photo || PLACEHOLDER_IMAGE}
          alt={name}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-slate-100"
          onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
        />
      </Link>
      <div>
        <Link to={`/profile/${userId}`}>
          <p className="font-bold text-sm sm:text-base text-slate-900 hover:text-[#1877f2] transition-colors">
            {name}
          </p>
        </Link>
        <p className="text-xs text-slate-400">
          {new Date(createdAt).toLocaleString("ar-EG", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>
    </div>
  );

  const ActionButtons = () => (
    <div className="flex justify-around items-center py-1">
      {/* Like */}
      <button
        onClick={() => likePost()}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${liked ? "text-[#1877f2]" : "text-slate-500 hover:text-[#1877f2] hover:bg-blue-50"}`}
      >
        <Heart
          className={`w-4 h-4 sm:w-5 sm:h-5 transition ${liked ? "fill-[#1877f2]" : ""}`}
        />
        <span>
          إعجاب {currentLikesCount > 0 ? `(${currentLikesCount})` : ""}
        </span>
      </button>

      {/* Comment */}
      {isPostDeatials ? (
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-[#1877f2] hover:bg-blue-50 transition-all">
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>تعليق {commentsCount > 0 ? `(${commentsCount})` : ""}</span>
        </button>
      ) : (
        <Link
          to={`/postdetails/${id}`}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-[#1877f2] hover:bg-blue-50 transition-all"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>تعليق {commentsCount > 0 ? `(${commentsCount})` : ""}</span>
        </Link>
      )}

      {/* Share */}
      <button
        onClick={() => sharePost()}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-[#1877f2] hover:bg-blue-50 transition-all"
      >
        <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>مشاركة {sharesCount > 0 ? `(${sharesCount})` : ""}</span>
      </button>
    </div>
  );

  const OptionsMenu = () =>
    user?._id === userLoggedId ? (
      <>
        <Dropdown>
          <DropdownTrigger>
            <button className="p-2 rounded-full hover:bg-slate-100 transition">
              <HiDotsVertical className="text-slate-500 text-lg" />
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Post Actions">
            <DropdownItem key="edit" onPress={onEditOpen}>
              تعديل
            </DropdownItem>
            {BookmarkItem}
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              onPress={() => deletePost()}
              isDisabled={deleting}
            >
              {deleting ? "جاري الحذف..." : "حذف"}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <PostUpdate
          isOpen={isEditOpen}
          onOpenChange={onEditOpenChange}
          post={post}
          queryKey={isPostDeatials ? ["getSinglePost", id] : ["getAllPosts"]}
        />
      </>
    ) : (
      <Dropdown>
        <DropdownTrigger>
          <button className="p-2 rounded-full hover:bg-slate-100 transition">
            <HiDotsVertical className="text-slate-500 text-lg" />
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Post Actions">{BookmarkItem}</DropdownMenu>
      </Dropdown>
    );

  // ─────────────────────────────────────────────
  // Post Details View
  // ─────────────────────────────────────────────
  if (isPostDeatials) {
    return (
      <div className="min-h-screen bg-slate-50 py-6 px-3 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#1877f2] transition-colors"
          >
            <ArrowLeft size={18} />
            رجوع
          </button>

          {/* Post Card */}
          <article className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-5">
            {/* Header */}
            <div className="px-4 sm:px-5 pt-4 pb-3 flex items-center justify-between">
              <UserInfo />
              <OptionsMenu />
            </div>

            <Divider className="bg-slate-100" />

            {/* Content */}
            <div className="px-4 sm:px-5 py-4 space-y-4">
              {body && (
                <p className="text-slate-800 leading-relaxed text-sm sm:text-base whitespace-pre-wrap break-words">
                  {body}
                </p>
              )}

              {image && (
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={image}
                    alt="صورة المنشور"
                    className="w-full max-h-[560px] object-contain bg-black/5"
                  />
                </div>
              )}
            </div>

            <Divider className="bg-slate-100" />

            {/* Actions */}
            <div className="px-2 sm:px-3">
              <ActionButtons />
            </div>

            <Divider className="bg-slate-100" />

            {/* Comment Creation */}
            <div className="px-4 sm:px-5 py-4">
              <CommentCreation postId={id} querykey={["getPostComment", id]} />
            </div>
          </article>

          {/* Comments Section */}
          {commentsLoading ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              جاري تحميل التعليقات...
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-slate-700 px-1">
                التعليقات ({comments.length})
              </h2>
              {comments.map((comment) => (
                <Comment
                  postDetails={isPostDeatials}
                  key={comment._id}
                  comment={comment}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 text-sm">
              لا توجد تعليقات بعد
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Feed View
  // ─────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="px-4 sm:px-5 pt-4 pb-3 flex items-center justify-between">
        <UserInfo />
        <OptionsMenu />
      </div>

      <Divider className="bg-slate-100" />

      {/* Body */}
      <div className="px-4 sm:px-5 py-4 space-y-3">
        {body && (
          <p className="text-slate-800 leading-relaxed text-sm sm:text-base whitespace-pre-wrap break-words">
            {body}
          </p>
        )}

        {image && (
          <div className="rounded-xl overflow-hidden border border-slate-200">
            <img
              src={image}
              alt="Post image"
              className="w-full h-auto max-h-[480px] object-cover"
            />
          </div>
        )}
      </div>

      <Divider className="bg-slate-100" />

      {/* Actions */}
      <div className="px-2 sm:px-3">
        <ActionButtons />
      </div>

      {/* Comment Creation */}
      <div className="px-4 sm:px-5 pb-4 border-t border-slate-100 pt-3">
        <CommentCreation postId={id} querykey={["getAllPosts"]} />
      </div>

      {/* Top Comment */}
      {comments.length > 0 && (
        <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-100 space-y-2">
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
