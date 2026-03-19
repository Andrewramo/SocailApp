import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import PostsCard from "../PostsCard/PostsCard";
import HashLoader from "react-spinners/HashLoader";

export default function PostDetails() {
  const { id } = useParams();

  function getSinglePost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getSinglePost", id],
    queryFn: getSinglePost,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-blue-50">
        <HashLoader color="#1877f2" size={70} />
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

  return <PostsCard post={data?.data.data.post} isPostDeatials />;
}
