"use client";
import { DataTable } from "/src/components/ttable/index";
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import  { useEffect } from 'react';
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useState ,useRef, useMemo} from "react";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Modal from "react-modal";


import { useToast } from "/src/components/ui/use-toast"
import { useQuery } from "@tanstack/react-query";
import Dropdown from "/src/components/dropdown";
import Link from "next/link";
import { Button } from "/src/components/ui/button";
import { api, getUsers, getCurrentUser , getAssociations, getDelegations,getProgrammes, getRegions, getAssociationsByDele} from "/src/api";
import { QueryClient, QueryClientProvider } from 'react-query';
import ReactDOM from 'react-dom';
import React from 'react';
//import { useRouter } from 'next/router';
import Multiselect from "multiselect-react-dropdown";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import ReactQuill from "react-quill";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "/src/components/ui/dropdown-menu";
import { Switch } from "/src/components/ui/switch";

const Page = () => {
  const customStyless = {
    content: {
      top: "50%",
      left: "50%", // Centrer horizontalement
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      padding: "0",
      width: "80vw", // Définit la largeur à 80% de la largeur de la vue
      maxWidth: "500px", // Définit une largeur maximale pour la modal
      maxHeight: "80vh", // Limite la hauteur de la modal à 80% de la hauteur de la vue
      overflowY: "auto", // Ajoute une barre de défilement verticale si la modal dépasse la hauteur de la vue
    },
};
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modelDeleteIsOpen, setModelDeleteIsOpen] = useState(false);
 
  const [value, setValue] = useState();
  //const Editor = React.lazy(() => import("react-draft-wysiwyg"));
  const [selectedCoordination, setSelectedCoordination] = useState(null);
  const [selectedDelegation, setSelectedDelegation] = useState(null);
  const [options1, setOptions1] = useState([]);
  
  
 
  const { data: associations,refetch} = useQuery({
    queryKey: ['associations'],
    queryFn: getAssociations(),
  });
  const { data: deleguation,refetchh} = useQuery({
    queryKey: ['deleguation'],
    queryFn: getDelegations(),
  });
  const { data: region,} = useQuery({
    queryKey: ['region'],
    queryFn: getRegions(),
  });
  const { data: programme,} = useQuery({
    queryKey: ['programme'],
    queryFn: getProgrammes(),
  });
  
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser(),
  });
  const delegation = userData?.province?.name;
  //console.log(province);
  const { data: AssociationByDele, refetch: refetchBene, isLoading, isError } = useQuery({
    queryKey: ['AssociationByDele', userData?.province?.name],
    queryFn: () => getAssociationsByDele(userData?.province?.name),
    enabled: !!delegation, // Ne lance la requête que si idAssociation est défini
});

const [data, setData] = useState([]);

 /* useEffect(() => {
    if (AssociationByDele) {
      // Assurez-vous que associationById est un tableau
      setData(Array.isArray(AssociationByDele) ? AssociationByDele : [AssociationByDele]);
    }
  }, [AssociationByDele]);*/
  useEffect(() => {
    if (userData?.roles !== 'ADMIN_ROLES' && AssociationByDele) {
      // Afficher les associations par délégation si le rôle n'est pas ADMIN_ROLES
      setData(Array.isArray(AssociationByDele) ? AssociationByDele : [AssociationByDele]);
    } ;
    
    if (userData?.roles == 'ADMIN_ROLES' && associations){
      // Afficher toutes les associations si le rôle est ADMIN_ROLES
      setData(Array.isArray(associations) ? associations : [associations]);
    }
  }, [AssociationByDele, associations, userData?.roles]);

  console.log(AssociationByDele);

 
  const [comboBoxOpen, setComboBoxOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [typeOfSubmit, settypeOfSubmit] = useState("create");
  const token = getCookie('token'); 
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const [selectedValue, setselectedValue] = useState({
    delegation: [],
  });




  const handleSelectCoordination = (selectedOption) => {
    setSelectedCoordination(selectedOption);
  };




  useEffect(() => {
    if (selectedValue && selectedValue.delegation && selectedValue.delegation.length > 0) {
      // Transforme le tableau de délégations en un tableau d'options pour le composant Select
      const initialSelections = selectedValue.delegation.map(item => ({
        value: item.id.toString(),
        label: item.delegation,
      }));
      setSelectedDelegation(initialSelections);
    }
  }, [selectedValue]);

  const handleSelectDelegation = (selectedOptions) => {
    setSelectedDelegation(selectedOptions);
  };

 

  
 
 const router = useRouter();

  const delegationColumns = [
    {
      id: 'id',
      header: 'id',
      accessorKey: 'association_id',
      enableSorting: true,
      sortDescFirst: true,
    },
    {
      accessorKey: "province.region.name",
      header: "الجهة ",
      cell: ({ row }) => (
        <div className="capitalize  rtl:text-right">{row.original?.deleguation?.region?.name}</div>
      ),
    },
    {
      accessorKey: "deleguation.name",
      id:"delegation",
      header: "المندوبية ",
      cell: ({ row }) => (
        <div className="capitalize rtl:text-right"> {row.original?.deleguation?.name}</div>
      ),
    },
   /*{
  accessorKey: "province_id",
  header: "المندوبية",
  cell: ({ row }) => {
    const provinceId = row.getValue("province_id");
    const provinceName = useMemo(() => {
      if (!provinceData) return "Chargement...";
      const province = provinceData.find(p => p.province_id === provinceId);
      return province ? province.name : "Inconnu";
    }, [provinceId, provinceData]);

    return (
      <div className="capitalize rtl:text-right">{provinceName}</div>
    );
  },
},*/
    {
      accessorKey: "name",
      header: "  اسم الجمعية",
      cell: ({ row }) => (
        <div className="capitalize  rtl:text-right">{row.getValue("name")}</div>
      ),
    },
   
    {
      accessorKey: "programme.programmeName",
      header: "نوع البرنامج ",
      cell: ({ row }) => (
        <div className="capitalize  rtl:text-right">{row.original.programme?.programmeName}</div>
      
    ), 
  },

  {
    accessorKey: "emploiSelonAnnee",
    header: "اشتغال وفق السنة (الدراسية/ المالية/أخر)",
    cell: ({ row }) => (
      <div className="capitalize  rtl:text-right">{row.getValue("emploiSelonAnnee")}</div>
    ),
  },
  
    {
      accessorKey: "fullName",
      header: "    اسم و نسب رئيس(ة) الجمعية",
      cell: ({ row }) => (
        <div className="capitalize  rtl:text-right">{row.getValue("fullName")}</div>
      ),
    },
    
    {
        accessorKey: "telephone",
        header: "رقم الهاتف",
        cell: ({ row }) => (
          <div className="capitalize  rtl:text-right">{row.getValue("telephone")}</div>
        ),
      },

      {
        accessorKey: "adresse",
        header: "عنوان مقر الجمعية",
        cell: ({ row }) => (
          <div className="capitalize rtl:text-right">{row.getValue("adresse")}</div>
        ),
      },

      {
        accessorKey: "email",
        header: "البريد الإلكتروني  ",
        cell: ({ row }) => (
          <div className=" rtl:text-right">{row.getValue("email")}</div>
        ),
      },
    
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        
        const association = row.original;

      const handleViewEtablissement = () => {
        router.push({
          pathname:  `/etablissements/${association.id}`,
          query: { id: association.id }
        });
      };
       
          
         
      
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>القائمة</DropdownMenuLabel>
              
              <Link href={row.original.id ? `/etablissements/${row.original.id}` : `#`}>
              <DropdownMenuItem>  لائحة المؤسسات التابعة لها  </DropdownMenuItem>
            </Link>
            
              
               
             
              <DropdownMenuItem
                onClick={() => {
                  //get selected row data
                  setselectedValue(row.original);
                  const partenaireId = row.original.id; // Récupération de l'ID de l'employé
   
    

                  setIsOpen(true);
                  settypeOfSubmit("update");
                  
                }}
              >
               تحديث 
              </DropdownMenuItem>
              {/*<DropdownMenuItem
                onClick={() => {
                  setselectedValue(row.original);
                 // console.log(selectedValue.id);
                  setModelDeleteIsOpen(true);
                }}
              >
                حذف
              </DropdownMenuItem>*/}
             
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const { toast } = useToast()


 
  function openModal() {
    setIsOpen(true);
  }
 
  
  
  

  function closeModal() {
    setIsOpen(false);
  }




 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (typeOfSubmit === "create") {
     
      try {
        const parsedSelectedValue = {
          ...selectedValue,
          association_id: parseFloat(selectedValue.id),
          //idDelegations: [parseFloat(selectedDelegation.value)],
          province_id: parseFloat(selectedDelegation.value),
          programme_id:parseFloat(selectedProgramme.label),


          name:selectedValue.name,
          adresse: selectedValue.adresse,
          email: selectedValue.email,
          emploi_selon_annee: selectedValue.emploi_selon_annee,
          full_name:selectedValue.full_name,
          telephone:selectedValue.telephone

 
          
        };
     
       console.log('Données envoyées au serveur:', parsedSelectedValue); 
      const response = await api.post("/association/add",parsedSelectedValue, 
       {headers: {
         ...headers,
   
     }
              }
         
       )
        openModal()
        refetch()
        toast({
          description: "تم إنشاء الجمعية بنجاح",
          className: "bg-green-500 text-white",
          duration: 2000,
          title: "نجاح",
        })
        setIsOpen(false);
      } catch (e) {
        toast({
          description: "خطأ أثناء إنشاء جمعية جديدة",
          className: "bg-red-500 text-white",
          duration: 2000,
          title: "خطأ",
        })
      }
    
        
    
    }
    else if (typeOfSubmit === "update" ) {
      
      try {
       
        console.log('Données envoyées au serveur:', selectedValue);
       // console.log(selectedValue);
      const response = await api.put("/association/update/"+ selectedValue.id, 
        selectedValue ,{
            headers: headers
                 
                })
          
        
                refetchBene()
        toast({
          description: "تم التحديث بنجاح",
          className: "bg-green-500 text-white",
          duration: 2000,
          title: "نجاح ",
        })
        setIsOpen(false);
      } catch (e) {
        toast({
          description: "حدث خطأ أثناء تحديث المعلومات لهذه الجمعية",
          className: "bg-red-500 text-white",
          duration: 2000,
          title: "خطأ",
        })
      }
    }
  
  }


  const options2 = [
    { value: 'سنة دراسية', label: 'سنة دراسية' },
    { value: 'سنة مالية', label: 'سنة مالية' },
    { value:  'أخرى', label: 'أخرى' },
  ];


  const handleSelectEmploiSelonAnnee = (selectedOption) => {
    setselectedValue({
      ...selectedValue,
      emploiSelonAnnee: selectedOption ? selectedOption.value : undefined,
    });
  };
  
  // Fonction pour gérer les changements dans le sélecteur
 /* const handleSelectChange2 = (selectedOption) => {
    setselectedValue(selectedOption);
  };*/

 

    
    const delegationOptions = (deleguation || []).map(item => ({
      value: item.id,
      label: item.name, // Assurez-vous que vous avez un champ `name` ou remplacez-le par le champ approprié
    }));
   
    const regionOptions = (region || []).map(item => ({
      value: item.id,
      label: item.name, // Assurez-vous que vous avez un champ `name` ou remplacez-le par le champ approprié
    }));
    const handleSelectRegion = (selectedOption) => {
      setselectedValue({
        ...selectedValue,
        deleguation: associations.find(item => item.deleguation.region.id === selectedOption?.value) || undefined,
      });
    };



    const programmeOptions = (programme || []).map(programme => ({
      value: programme.id,
      label: programme.programmeName, // Assurez-vous que vous avez un champ `programmeName` ou remplacez-le par le champ approprié
    }));

    const handleSelectChange = (selectedOption) => {
      setselectedValue({
        ...selectedValue,
        programme: programme.find(item => item.id === selectedOption?.value) || undefined,
      });
    };
  return (
    
    <div className="px-10 py-4" id="Subs">
      <DeleteModal
        closeModal={() => setModelDeleteIsOpen(false)}
        modalIsOpen={modelDeleteIsOpen}
        selectedValue={selectedValue}
        refetch={refetch}
        toast={toast}
      />
     
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyless}
        contentLabel="Example Modal"
      >
        <form className="max-w-lg mx-auto py-8 bg-white shadow-md rounded-md" onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold mb-4 px-6 text-center">
            {typeOfSubmit === "create"
              ? "إضافة جمعية جديدة"
              : "تحديث معلومات الجمعية"}
          </h2>
         



       { /*  <div className="px-6 mb-4 flex flex-col w-full">
      <label className="block mb-1" htmlFor="region">
        المنسقية
      </label>
      <Select
        id="region"
        options={regionOptions}
        value={regionOptions.find(option => option.value === selectedValue?.deleguation?.region?.id)}
        onChange={handleSelectRegion}
        placeholder="اختر المنسقية"
      />
    </div>

<div className="px-6 mb-4 flex flex-col w-full">
      <label className="block mb-1" htmlFor="delegation">
        المندوبية
      </label>
      <Select
        options={delegationOptions}
        value={delegationOptions.find(option => option.value === selectedValue?.deleguation?.id)}
        onChange={(selectedOption) => {
          setselectedValue({
            ...selectedValue,
            deleguation: deleguation.find(item => item.id === selectedOption?.value) || undefined,
          });
        }}
        placeholder="اختر المندوبية"
      />
    </div>
<div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="name">
  اسم الجمعية 
  </label>
  <input
    className="w-full border rounded-md px-3 py-2"
    type="text"
    id="name"
    placeholder="الجمعية"
    value={selectedValue?.name || ""}
    onChange={(e) => {
      setselectedValue({
        ...selectedValue,
        name: e.target.value,
      });
    }}
  />
</div>*/}



<div className="px-6 mb-4 flex flex-col w-full">
      <label className="block mb-1" htmlFor="deleguation.region.name">
        المنسقية
      </label>
      <input
        className="w-full border rounded-md px-3 py-2"
        type="text"
         id="deleguation.region.name"
    
    value={selectedValue?.deleguation?.region?.name || ""}
    readOnly
  />
    </div>

<div className="px-6 mb-4 flex flex-col w-full">
      <label className="block mb-1" htmlFor="deleguation.name">
        المندوبية
      </label>
      <input
        className="w-full border rounded-md px-3 py-2"
        type="text"
         id="delegation"
    
    value={selectedValue?.deleguation?.name || ""}
    readOnly
  />
    </div>
<div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="name">
  اسم الجمعية 
  </label>
  <input
    className="w-full border rounded-md px-3 py-2"
    type="text"
    id="name"
    
    value={selectedValue?.name || ""}
    readOnly
  />
</div>

<div className="px-6 mb-4 flex flex-col w-full">
      <label className="block mb-1" htmlFor="programme">
        نوع البرنامج
      </label>
      <Select
        id="programme"
        options={programmeOptions}
        value={programmeOptions.find(option => option.value === selectedValue?.programme?.id)}
        onChange={handleSelectChange}
        placeholder="اختر البرنامج"
        className="w-full"
        required
        
      />
    </div>

    <div className="px-6 mb-4 flex flex-col w-full">
      <label className="block mb-1" htmlFor="emploiSelonAnnee">
        اشتغال وفق السنة
      </label>
      <Select
        id="emploiSelonAnnee"
        name="emploiSelonAnnee"
        options={options2}
        value={options2.find(option => option.label === selectedValue?.emploiSelonAnnee)}
        onChange={handleSelectEmploiSelonAnnee}
        placeholder="اختر نوع السنة"
        className="w-full"
        required
      />
    </div>

<div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="fullName">
  اسم و نسب رئيس(ة) الجمعية
  </label>
  <input
    className="w-full border rounded-md px-3 py-2"
    type="text"
    id="fullName"
    placeholder="الاسم"
    value={selectedValue?.fullName || ""}
    onChange={(e) => {
      setselectedValue({
        ...selectedValue,
        fullName: e.target.value,
      });
    }}
    required
  />
</div>

<div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="telephone">
  رقم الهاتف
  </label>
  <input
    className="w-full border rounded-md px-3 py-2"
    type="text"
    id="telephone"
    placeholder="رقم الهاتف "
  
    value={selectedValue?.telephone || ""}
    onChange={(e) => {
      setselectedValue({
        ...selectedValue,
        telephone: e.target.value,
      });
    }}
    required
  />
</div>

<div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="adresse">
  عنوان مقر الجمعية
  </label>
  <input
    className="w-full border rounded-md px-3 py-2"
    type="text"
    id="adresse"
    placeholder=" عنوان مقر الجمعية "
    value={selectedValue?.adresse || ""}
    onChange={(e) => {
      setselectedValue({
        ...selectedValue,
        adresse: e.target.value,
      });
    }}
    required
  />
</div>

<div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="email">
  البريد الإلكتروني
  </label>
  <input
    className="w-full border rounded-md px-3 py-2"
    type="text"
    id="email"
    placeholder=" البريد الإلكتروني"
    value={selectedValue?.email || ""}
    onChange={(e) => {
      setselectedValue({
        ...selectedValue,
        email: e.target.value,
      });
    }}
    required
  />
</div>


          <div className="mt-4 px-6 flex justify-end">
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md">
          إرسال
            </button>
          </div>
        </form>
      </Modal>
      <DataTable
        title={"معلومات حول الجمعيات "}
        filterCol="delegation"
        columns={delegationColumns}
        //filteredData
        data={data || []}
       // if user.roles=admin : data=associations
        setOpenModal={openModal}
        settypeOfSubmit={settypeOfSubmit}
        canAdd={true}
      />
    </div>
  );
};

export default Page;


const styles = {
  attachmentList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  attachmentItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
  imagePreview: {
    maxWidth: '70px',
    maxHeight: '70px',
    marginRight: '10px',
    borderRadius: '4px',
  },
  fileIcon: {
    fontSize: '24px',
    marginRight: '10px',
  },
  fileName: {
    flexGrow: 1,
  },
  downloadLink: {
    textDecoration: 'none',
    color: '#7a7a7a',
    cursor: 'pointer',
    margin: '0 40px',
  },
  downloadLinkHover: {
    textDecoration: 'underline',
  },
  tableHeader: {
    backgroundColor: '#ccc',
    color: '#333',
    padding: '10px',
    textAlign: 'center',
  },
  space: {
    margin: '0 40px', // Ajout d'un espace de 10 pixels entre les deux liens
  },
};




const DeleteModal = ({ modalIsOpen, afterOpenModal, closeModal, selectedValue, refetch, toast }) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "0",
      width: "fit-content",
    },
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie('token'); 
    const headers = {
        Authorization: `Bearer ${token}`
    };
    try {
      await api.delete("/association/delete/"+selectedValue.id,{
        headers: headers
             
            } )
      toast({
        description: "تم الحذف بنجاح",
        className: "bg-green-500 text-white",
        duration: 2000,
        title: "نجاح",
      })
      refetchBene()
      closeModal()
    } catch (e) {
      toast({
        description: "حدث خطأ أثناء الحذف",
        className: "bg-red-500 text-white",
        duration: 2000,
        title: "خطأ",
      })
      console.log(e);
    }
  }



  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <form className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold mb-4">حذف</h2>
        <div className="mb-4">
          <p>هل أنتم متأكدون من رغبتكم في حذف هذا العنصر؟</p>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded-md">
          
          إلغاء
          </button>
          <button
            type="submit"
            className="bg-gray-500 text-white px-4 py-2 rounded-md">
          
          حذف
          </button>
        </div>
      </form>
    </Modal>
  );



  
};
