import React, { useContext, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { TbXboxX } from "react-icons/tb";
import { LuImageUp } from "react-icons/lu";
import { ImageIcon } from "lucide-react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../Context/AuthContext";

const PLACEHOLDER_IMAGE =
  "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

export default function PostCreation() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [previewImage, setPreviewImage] = useState(null);
  const textRef = useRef(null);
  const fileRef = useRef(null);
  const queryClient = useQueryClient();
  const { userPhoto } = useContext(AuthContext);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setPreviewImage(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const getFormData = () => {
    const formData = new FormData();
    if (textRef.current?.value.trim())
      formData.append("body", textRef.current.value.trim());
    if (fileRef.current?.files?.[0])
      formData.append("image", fileRef.current.files[0]);
    return formData;
  };

  const { isPending, mutate } = useMutation({
    mutationFn: () =>
      axios.post("https://route-posts.routemisr.com/posts", getFormData(), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getUserPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getFeed"] });
      if (textRef.current) textRef.current.value = "";
      setPreviewImage(null);
      if (fileRef.current) fileRef.current.value = "";
      toast.success("تم نشر المنشور بنجاح ✓");
      onOpenChange(false);
    },
    onError: () => toast.error("حدث خطأ أثناء النشر، حاول مرة أخرى"),
  });

  return (
    <>
      {/* Trigger Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start gap-3">
          <img
            src={userPhoto || PLACEHOLDER_IMAGE}
            alt="avatar"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-slate-100 shrink-0 mt-1"
            onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
          />
          {/* Textarea-style trigger */}
          <div
            onClick={onOpen}
            className="flex-1 min-h-[80px] bg-slate-100 hover:bg-slate-200/70 text-slate-400 text-sm rounded-2xl py-3 px-4 cursor-pointer transition-colors duration-200 border border-transparent hover:border-blue-200"
          >
            بم تفكر يا صديقي؟
          </div>
        </div>

        {/* Quick Action */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-center">
          <button
            onClick={onOpen}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#1877f2] transition-colors px-4 py-1.5 rounded-xl hover:bg-blue-50"
          >
            <ImageIcon size={17} />
            إضافة صورة
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        placement="center"
        motionProps={{
          variants: {
            enter: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {/* Modal Header */}
              <ModalHeader className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <img
                  src={userPhoto || PLACEHOLDER_IMAGE}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover border-2 border-slate-100"
                  onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
                />
                <span className="text-base font-bold text-slate-800">
                  إنشاء منشور جديد
                </span>
              </ModalHeader>

              {/* Modal Body */}
              <ModalBody className="py-5 space-y-4">
                <textarea
                  ref={textRef}
                  placeholder="بم تفكر يا صديقي؟"
                  rows={5}
                  className="w-full resize-none bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/10 focus:bg-white transition-all duration-200"
                />

                {previewImage && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <img
                      src={previewImage}
                      alt="معاينة المنشور"
                      className="max-h-[320px] w-full object-contain bg-black/5"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2.5 right-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition"
                    >
                      <TbXboxX size={18} />
                    </button>
                  </div>
                )}
              </ModalBody>

              {/* Modal Footer */}
              <ModalFooter className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <label className="cursor-pointer group">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <div className="flex items-center gap-2 text-[#1877f2] hover:text-blue-800 transition text-sm font-semibold">
                    <LuImageUp size={20} />
                    <span className="group-hover:underline">إضافة صورة</span>
                  </div>
                </label>

                <div className="flex items-center gap-2.5">
                  <Button
                    variant="light"
                    color="danger"
                    onPress={onClose}
                    className="font-semibold text-sm"
                  >
                    إلغاء
                  </Button>
                  <Button
                    color="primary"
                    isLoading={isPending}
                    onPress={() => mutate()}
                    className="min-w-[100px] font-bold text-sm"
                  >
                    {isPending ? "جاري النشر..." : "نشر"}
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
