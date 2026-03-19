import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import toast from "react-hot-toast";
import { useDisclosure } from "@heroui/react";
import CommentUpdate from "../CommentUpdate/CommentUpdate";

const PLACEHOLDER_IMAGE =
  "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

export default function Comment({ comment, postDetails = false }) {
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();
  const {
    commentCreator,
    content,
    image,
    createdAt,
    post: postId,
    _id: commentId,
  } = comment;
  const { name, photo } = commentCreator || {};

  // تنسيق التاريخ بشكل أنيق (يمكنك تعديله حسب احتياجك)
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString("ar-EG", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "منذ قليل";

  const { userLoggedId } = useContext(AuthContext);
  const query = useQueryClient();
  function deleteComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      toast.success("تم حذف التعليق بنجاح");
      if (postDetails) {
        query.invalidateQueries({ queryKey: ["getPostComment", postId] });
      } else {
        query.invalidateQueries({ queryKey: ["getAllPosts"] });
      }
    },
    onError: (e) => {
      toast.error("حدث خطأ أثناء الحذف");
    },
  });
  return (
    <div
      className="
    flex items-start gap-3 
    py-3 px-4 
    rounded-xl 
    bg-gray-50/70 
    border border-gray-200/60 
    hover:bg-gray-100/70 
    transition-colors duration-200
  "
    >
      {/* صورة صاحب التعليق */}
      <img
        src={photo || PLACEHOLDER_IMAGE}
        alt={name || "مستخدم"}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-gray-300/50 shadow-sm"
        onError={(e) => {
          e.target.src = PLACEHOLDER_IMAGE;
        }}
      />

      {/* المحتوى */}
      <div className="flex-1 min-w-0">
        {/* الاسم + التاريخ + أزرار الحذف والتعديل */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-gray-900 text-[15px] truncate">
              {name || "مستخدم"}
            </span>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>

          {/* الأزرار - بتظهر بس لو صاحب التعليق */}
          {commentCreator?._id === userLoggedId ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onEditOpen}
                className="text-xs text-blue-500 hover:text-blue-700 transition"
              >
                تعديل
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => {
                  mutate();
                }}
                className="text-xs text-red-400 hover:text-red-600 transition"
              >
                حذف
              </button>
            </div>
          ) : postId === userLoggedId ? (
            <button
              onClick={() => {
                mutate();
              }}
              className="text-xs text-red-400 hover:text-red-600 transition"
            >
              حذف
            </button>
          ) : null}
        </div>

        {/* نص التعليق */}
        {content && (
          <p className="text-gray-800 leading-relaxed text-[15px] break-words">
            {content}
          </p>
        )}

        {/* صورة التعليق إذا وجدت */}
        {image && (
          <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 max-w-[360px]">
            <img
              src={image}
              alt="صورة التعليق"
              className="max-h-[280px] w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
      </div>
      <CommentUpdate
        isOpen={isEditOpen}
        onOpenChange={onEditOpenChange}
        comment={comment}
        queryKey={postDetails ? ["getPostComment", postId] : ["getAllPosts"]}
      />
    </div>
  );
}
