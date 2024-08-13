"use client";
import React, { useState } from 'react';
import { api, getTickets, getUsers, getCurrentUser } from "/src/api";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "/src/components/ui/use-toast";
import Image from 'next/image';

function ProfilePage() {
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('مندوب');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
  const [selectedValue, setSelectedValue] = useState();
  const { toast } = useToast();
  const token = getCookie('token'); 
  const headers = {
    Authorization: `Bearer ${token}`
  };
  
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser(),
  });
  
  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    if (oldPassword && newPassword && confirmNewPassword && newPassword === confirmNewPassword) {
      try {
        const parsedValue = {
          oldPassword: oldPassword, // تأكد من أن القيم محددة
          newPassword: newPassword,
          confirmPassword: confirmNewPassword,
        };
        await api.put("/auth/changepsw/" + userData.id, parsedValue, { headers });
        toast({
          description: "تغيير كلمة المرور بنجاح",
          className: "bg-green-500 text-white",
          duration: 2000,
          title: "نجاح",
        });
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setPasswordChangeMessage('تم تغيير كلمة المرور بنجاح.');
      } catch (error) {
        toast({
          description: "حدث خطأ أثناء تغيير كلمة المرور",
          className: "bg-red-500 text-white",
          duration: 2000,
          title: "خطأ",
        });
        console.error(error);
      }
    } else {
      setPasswordChangeMessage('يرجى ملء جميع الحقول بشكل صحيح.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f6fa' }}>
      <div style={{ width: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', backgroundColor: 'white', padding: '20px' /* Ajoutez du padding ici */ }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
          <div style={{ marginRight: '20px' }}>
            <Image src="/pp.jpg" alt="مستخدم" width={170} height={170} style={{ borderRadius: '50%' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', marginBottom: '5px' }}>{userData?.name}</h1>
            <p style={{ fontSize: '16px', color: '#666' }}>{userData?.email}</p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '20px' }}>
          <div style={{ flex: '1', backgroundColor: '#f0f0f0', borderRadius: '10px', padding: '20px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>المعلومات الشخصية</h2>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '150px' /* Assurez-vous que cette hauteur est suffisante */ }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>البريد الإلكتروني:</strong> {userData?.email}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>المنسقية:</strong> {userData?.province?.region?.name}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>المندوبية:</strong> {userData?.province?.name}
              </div>
            </div>
          </div>
          <div style={{ flex: '1', backgroundColor: '#f0f0f0', borderRadius: '10px', padding: '20px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>تغيير كلمة المرور</h2>
            <form onSubmit={handleSubmitPasswordChange}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>كلمة المرور القديمة:</label>
                <input type="password" style={{ padding: '5px', borderRadius: '3px', border: '1px solid #ccc', width: '100%' }} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>كلمة المرور الجديدة:</label>
                <input type="password" style={{ padding: '5px', borderRadius: '3px', border: '1px solid #ccc', width: '100%' }} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>تأكيد كلمة المرور الجديدة:</label>
                <input type="password" style={{ padding: '5px', borderRadius: '3px', border: '1px solid #ccc', width: '100%' }} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
              </div>
              <button type="submit" style={{ padding: '8px 83px', backgroundColor: '#343a40', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', margin: 'auto' }}>تغيير كلمة المرور</button>
              {passwordChangeMessage && <p style={{ color: 'green', marginTop: '10px' }}>{passwordChangeMessage}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

