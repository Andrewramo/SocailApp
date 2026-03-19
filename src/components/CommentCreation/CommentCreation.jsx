import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/esm/PulseLoader";

export default function CommentCreation({ postId, querykey }) {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      body: "",
      image: null,
    },
  });

  const queryClient = useQueryClient();

  const formData = new FormData();

  const createComment = async (data) => {
    if (!data.body.trim() && !data.image?.[0]) return;

    if (data.body?.trim()) {
      formData.append("content", data.body.trim());
    }
    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
  };

  const { isPending, mutate } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: querykey });
      toast.success("تم إضافة التعليق بنجاح 👍");
      formData.delete("content");
      formData.delete("image");
    },
    onError: (err) => {
      console.error(err);
      toast.error("فشل إضافة التعليق، حاول مرة أخرى");
    },
  });

  const onSubmit = (values) => {
    mutate(values);
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-gray-200/60 mt-3">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-3 w-full"
      >
        <div className="relative flex-1">
          <input
            {...register("body")}
            type="text"
            placeholder="اكتب تعليقك..."
            className="w-full border border-gray-300 rounded-full py-3 px-5 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 transition-all text-gray-800 placeholder-gray-500"
            disabled={isPending}
          />

          <label
            htmlFor="commentImage"
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </label>

          <input
            {...register("image")}
            type="file"
            id="commentImage"
            accept="image/*"
            className="hidden"
            disabled={isPending}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="min-w-[90px] px-5 py-3 bg-blue-600 text-white rounded-full font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          {isPending ? (
            <PulseLoader color="#ffffff" size={8} margin={4} />
          ) : (
            "إرسال"
          )}
        </button>
      </form>
    </div>
  );
}
