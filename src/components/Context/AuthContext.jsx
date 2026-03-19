import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const AuthContext = createContext();

// ✅ الـ queryFn برا الكمبوننت عشان مش تتعمل function جديدة في كل render
function getMyProfile() {
  return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
}

export default function AuthContextProvider({ children }) {
  const [IsLog, setIsLog] = useState(null);
  const [userLoggedId, setuserLoggedId] = useState(null);
  const [userPhoto, setuserPhoto] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      setIsLog(localStorage.getItem("userToken"));
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      const jwt = jwtDecode(localStorage.getItem("userToken"));
      setuserLoggedId(jwt.user);
    }
  }, [IsLog]);

  // ✅ useQuery هنا بيجيب البيانات مرة واحدة لما التطبيق يفتح
  // ✅ enabled: !!IsLog يعني بيشتغل بس لو في توكن
  const { data } = useQuery({
    queryKey: ["getMyProfile"],
    queryFn: getMyProfile,
    enabled: !!IsLog,
  });

  // ✅ لما البيانات تيجي بيحط الصورة في الـ state
  useEffect(() => {
    if (data) {
      setuserPhoto(data?.data?.data.user.photo);
    }
  }, [data]);

  return (
    <AuthContext.Provider
      value={{ IsLog, setIsLog, userLoggedId, setuserPhoto, userPhoto }}
    >
      {children}
    </AuthContext.Provider>
  );
}
