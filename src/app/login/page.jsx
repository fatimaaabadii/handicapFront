'use client';
import { api } from "/src/api/index.js";
import { useToast } from "/src/components/ui/use-toast";
import React, { useState } from "react";
import { setCookie } from "cookies-next";
import { useMutation } from "@tanstack/react-query";
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Image from 'next/image';

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const login = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setCookie("token", response.data, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      toast({
        description: "تم تسجيل الدخول بنجاح",
        className: "bg-green-500 text-white",
        duration: 2000,
        title: "نجاح",
      });
      window.location.href = "/association";
    } catch (error) {
      toast({
        description: "فشل تسجيل الدخول",
        variant: "destructive",
        duration: 2000,
        title: "خطأ",
      });
    }
  };

  const { mutate } = useMutation({ mutationFn: login });

  function handleSubmit(event) {
    event.preventDefault();
    mutate();
  }

  return (
    <>
     <style jsx global>{`
        .background {
          background: url('/4.png') no-repeat center center fixed;
          background-size: cover;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .bg-gradient-to-r {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        }
      `}
      </style>
      <div className="background">
      <div className="p-8 w-full lg:w-1/3 bg-white rounded-lg shadow-lg ">
        <div className="mb-8 flex justify-center">
          <Image src="/en.png" alt="شعار" width={100} height={20} />
        </div>
        <h2 className="text-2xl text-center font-serif  mb-6">    برنامج تحسين تمدرس الأطفال في وضعية إعاقة</h2>
        <h3 className="text-xl  font-serif text-center mb-4">تسجيل الدخول</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-serif">البريد الإلكتروني</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                <FaUser className="text-gray-400" />
              </span>
              <input
                type="text"
                id="email"
                name="email"
                className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:border-blue-500"
                autoComplete="off"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-serif">كلمة المرور</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                <FaLock className="text-gray-400" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-10 focus:outline-none focus:border-blue-500"
                required
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-800 to-blue-900 hover:bg-blue-900 text-white font-semibold rounded-md py-2 px-4 w-full transition duration-200"
            >
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
