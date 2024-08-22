import Link from "next/link";
import { FaUser, FaUsers } from "react-icons/fa";
import { MdDevices } from "react-icons/md";
import { FaUserFriends } from 'react-icons/fa';

import { FaMapMarker } from 'react-icons/fa';
import { BiMapPin } from 'react-icons/bi';
import { FaShareAlt } from 'react-icons/fa';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { FaSitemap } from 'react-icons/fa';
import { useQuery } from "@tanstack/react-query";
import { api, getDelegations, getUsers, getCurrentUser } from "/src/api/index.js";
import { FaAddressBook } from 'react-icons/fa';
import { FaFolderOpen } from 'react-icons/fa';
import { FaBookReader    } from 'react-icons/fa';
import {FaUserGraduate,FaBuilding , FaBook, FaNewspaper , FaFileAlt ,FaFeatherAlt , FaCheckCircle, FaClipboardList , 
  FaHandHoldingHeart,FaPeopleArrows ,FaHandshake , FaHandsHelping , FaBriefcase, FaUserCircle, FaChartBar} from 'react-icons/fa';
import { setCookie, deleteCookie } from "cookies-next";
import Image from 'next/image';
const Sidebar = () => {
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser(),
  });
  
  
  
  const roles = [
    
    {
      value: "1",
      label: "Siège",
    },
    {
      value: "2",
      label: "Délégué",
    },
  
    {
      value: "3",
      label: "Coordinateur",
    },
  
     {
      value: "4",
      label: "Service technique",
    },
   
  ];
  return (
    
    
     
    <nav className="flex items-center justify-between bg-gray-700 text-white h-20 px-6">
      <img src="en.png" alt="Logo" className="h-10" />
{(userData?.roles === "ADMIN_ROLES" && (
     <div className="flex items-center">
            <Link
              href="/"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-white hover:text-gray-800 border-l-4 border-transparent hover:border-gray-500 pr-6"
            >
             <span className="inline-flex justify-center items-center ml-4">
              <FaClipboardList  className="w-8 h-4" />
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
              الصفحة الرئيسية
              </span>
            </Link>
            </div>
 ))}


{(userData?.roles !== "ADMIN_ROLES" && (
             <div className="flex items-center">
         
         <Link
           href="/statistiques"
           className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-white hover:text-gray-800 border-l-4 border-transparent hover:border-gray-500 pr-6"
         >
           <span className="inline-flex justify-center items-center ml-4">
           <FaChartBar className="w-8 h-4" />
           </span>
           <span className="ml-2 text-sm tracking-wide truncate">
           إحصائيات
           </span>
         </Link>
       
      </div>))}

            <div className="flex items-center">
         
            <Link
              href="/association"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-white hover:text-gray-800 border-l-4 border-transparent hover:border-gray-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
              <FaHandHoldingHeart className="w-8 h-4" />
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                الجمعيات
              </span>
            </Link>
          
         </div>

         <div className="flex items-center">
         
         <Link
           href="/cadres"
           className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-white hover:text-gray-800 border-l-4 border-transparent hover:border-gray-500 pr-6"
         >
           <span className="inline-flex justify-center items-center ml-4">
           <FaBriefcase className="w-8 h-4" />
           </span>
           <span className="ml-2 text-sm tracking-wide truncate">
             أطر الجمعيات
           </span>
         </Link>
       
      </div>







      <div className="flex items-center">
         
         <Link
           href="/beneficiaire"
           className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-white hover:text-gray-800 border-l-4 border-transparent hover:border-gray-500 pr-6"
         >
           <span className="inline-flex justify-center items-center ml-4">
           <FaUserFriends className="w-8 h-4" />
           </span>
           <span className="ml-2 text-sm tracking-wide truncate">
             المستفيدين
           </span>
         </Link>
       
      </div>
  
{/*

{(userData?.roles === "ADMIN_ROLES" && (
         <div className="flex items-center">
            <Link
              href="/utilisateurs"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-500 text-white hover:text-gray-800 border-l-4 border-transparent hover:border-gray-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-1">
                <FaUsers className="w-5 h-5" />
              </span>
              <span className="ml-2 text-l font-serif tracking-wide truncate">
              Gestion des Utilisateurs
              </span>
            </Link>
          </div>
       
        ))}*/}
        <div className="py-4 space-y-1">
          <Link
            href="/user"
            className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-white hover:text-gray-800 border-l-4 border-transparent hover:border-gray-500 pr-6"
          >
            <span className="inline-flex justify-center items-center ml-1">
              <FaUserCircle className="w-5 h-5" />
            </span>
            <span className="ml-2 text-sm font-serif tracking-wide truncate">
            حسابي
            </span>
          </Link>
        </div>
        <div className="ml-4 hover:text-gray-700 font-serif hover:bg-gray-100 p-2 rounded-full">
                        <button onClick={() => {
                          deleteCookie("token");
                          window.location.href = "/login";
                        }}>تسجيل الخروج</button>
                      </div>
    </nav>
  );
};

export default Sidebar;
