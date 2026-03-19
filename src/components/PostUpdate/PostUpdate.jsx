import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { LuImageUp } from "react-icons/lu";
import { TbXboxX } from "react-icons/tb";
import toast from "react-hot-toast";

export default function PostUpdate({ post, onOpenChange, isOpen, queryKey }) {
  const textRef = useRef(null);
  const fileRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (isOpen && post) {
      if (textRef.current) textRef.current.value = post.body || "";
      setPreviewImage(post.image || null);
    }
  }, [isOpen, post]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setPreviewImage(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  function getForm() {
    const formDate = new FormData();

    formDate.append("body", textRef.current.value.trim() || "");
    if (fileRef.current?.files?.[0]) {
      formDate.append("image", fileRef.current.files[0]);
    }
    return formDate;
  }

  function updatePost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post.id}`,
      getForm(),
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
  }
  const query = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: updatePost,
    onSuccess: async (e) => {
      console.log(e.data);
      toast.success("تم تعديل المنشور بنجاح");
      await query.refetchQueries({ queryKey: queryKey });
      onOpenChange(false);
    },
    onError: () => toast.error("حدث خطأ أثناء التعديل"),
  });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-xl font-semibold text-gray-800 border-b pb-3">
              تعديل المنشور
            </ModalHeader>

            <ModalBody className="py-5 space-y-5">
              <textarea
                ref={textRef}
                placeholder="بم تفكر يا صديقي؟"
                rows={5}
                className="w-full resize-none bg-white border border-gray-300 rounded-xl py-4 px-5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 transition-all duration-200"
              />
              {previewImage && (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={previewImage}
                    alt="معاينة المنشور"
                    className="max-h-[380px] w-full object-contain bg-black/5"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition"
                  >
                    <TbXboxX size={22} />
                  </button>
                </div>
              )}
            </ModalBody>

            <ModalFooter className="border-t pt-4 flex items-center justify-between">
              <label className="cursor-pointer group">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <div className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition">
                  <LuImageUp size={24} />
                  <span className="font-medium text-sm group-hover:underline">
                    تغيير الصورة
                  </span>
                </div>
              </label>
              <div className="flex items-center gap-3">
                <Button variant="light" color="danger" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  color="primary"
                  isLoading={isPending}
                  onPress={() => {
                    mutate();
                  }}
                >
                  {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
