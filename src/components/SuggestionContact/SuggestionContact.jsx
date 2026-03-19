import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const PLACEHOLDER_IMAGE =
  "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";
function followFeature(userId) {
  return axios.put(
    `https://route-posts.routemisr.com/users/${userId}/follow`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
}

export default function SuggestionContact({ user }) {
  const { name, username, photo, followersCount, _id } = user || {};
  const [isFollowing, setIsFollowing] = useState(false);
  const query = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: () => followFeature(_id),
    onSuccess: (res) => {
      console.log("succuss");
      setIsFollowing(res.data.data.following);
      query.invalidateQueries({ queryKey: ["getSuggestions"] });
    },
  });

  return (
    <div className="flex items-center justify-between p-4 bg-white/85 rounded-2xl shadow-md hover:shadow-lg hover:bg-blue-50/80 transition-all duration-300 border border-blue-100/50 group">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Link to={`/profile/${_id}`} className="shrink-0">
          <img
            src={photo || PLACEHOLDER_IMAGE}
            alt={name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-200 group-hover:ring-blue-400 transition-all "
            onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
          />
        </Link>
        <div className="flex flex-col min-w-0">
          <Link to={`/profile/${_id}`}>
            <p className="font-semibold text-gray-900 text-base leading-tight truncate">
              {name}
            </p>
          </Link>

          <Link to={`/profile/${_id}`}>
            <p className="text-sm text-blue-700 leading-tight truncate">
              {username}
            </p>
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">
            {followersCount} followers
          </p>
        </div>
      </div>

      <button
        onClick={() => mutate()}
        disabled={isPending}
        className={`ml-3 px-4 py-1.5 text-sm font-medium rounded-full shadow-md transition-all duration-300 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed ${
          isFollowing
            ? "bg-white text-slate-700 border border-slate-300 hover:bg-red-50 hover:text-red-500 hover:border-red-300"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isPending ? "..." : isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
}
