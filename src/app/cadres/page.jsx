"use client";

import { DataTable } from "/src/components/table/table";
import dynamic from 'next/dynamic';
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import  { useEffect } from 'react';
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useState ,useRef, useMemo} from "react";
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Modal from "react-modal";
import { ToastAction } from "/src/components/ui/toast"
import JoditEditor from 'jodit-react';
import { useToast } from "/src/components/ui/use-toast"
import { useQuery } from "@tanstack/react-query";
import Dropdown from "/src/components/dropdown";
import { Button } from "/src/components/ui/button";
import { api, getUsers, getCurrentUser , getAssociations, getDelegations,getProgrammes, getRegions, getCadres,getBeneByDele, getAssociationsByDele, getTypeHandicap, getServices, getCadresByDele, getSpecialite} from "/src/api";
import { QueryClient, QueryClientProvider } from 'react-query';
import ReactDOM from 'react-dom';
import React from 'react';
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
  
  const [filteredEtablissements, setFilteredEtablissements] = useState([]);

  const [typeOfSubmit, settypeOfSubmit] = useState("create");
  const token = getCookie('token'); 
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const [selectedValue, setselectedValue] = useState(
 );

 const { data: userData } = useQuery({
  queryKey: ['user'],
  queryFn: getCurrentUser(),
});


const { data: cadres } = useQuery({
  queryKey: ['cadres'],
  queryFn: getCadres(),
});

  const { data: AssociationByDele, refetch: refetchAsso} = useQuery({
    queryKey: ['AssociationByDele', userData?.province?.name],
    queryFn: () => getAssociationsByDele(userData?.province?.name),
    enabled: !!userData?.province?.name, 
});



const delegation = userData?.province?.name;
//console.log(province);
const { data: CadresByDele, refetch: refetch, isLoading, isError } = useQuery({
  queryKey: ['CadresByDele', userData?.province?.name],
  queryFn: () => getCadresByDele(userData?.province?.name),
  enabled: !!delegation, // Ne lance la requête que si idAssociation est défini
});

 console.log(CadresByDele);
 const [data, setData] = useState([]);
 useEffect(() => {
  if (userData?.roles !== 'ADMIN_ROLES' && CadresByDele) {
    // Afficher les associations par délégation si le rôle n'est pas ADMIN_ROLES
    setData(Array.isArray(CadresByDele) ? CadresByDele : [CadresByDele]);
  } ;
  
  if (userData?.roles == 'ADMIN_ROLES' && cadres){
    // Afficher toutes les associations si le rôle est ADMIN_ROLES
    setData(Array.isArray(cadres) ? cadres : [cadres]);
  }
}, [CadresByDele, cadres, userData?.roles]);
 const { data: associations,refetchH} = useQuery({
  queryKey: ['associations'],
  queryFn: getAssociations(),
});
console.log(data);
const { data: specialite,} = useQuery({
  queryKey: ['specialite'],
  queryFn: getSpecialite(),
});

const { data: deleguation,refetchh} = useQuery({
  queryKey: ['deleguation'],
  queryFn: getDelegations(),
  enabled: !!userData
});

const selectedDelegationn = deleguation?.find(deleg => deleg.name === userData?.province?.name);
console.log(selectedDelegationn);
  
  


const options4 = (specialite || []).map(specialite => ({
  value: specialite.id,
  label: specialite.specialite, // Assurez-vous que vous avez un champ `programmeName` ou remplacez-le par le champ approprié
}));

  // Fonction pour gérer les changements dans le sélecteur
  const handleSelectChangePro = (selectedOption) => {
    setselectedValue({
      ...selectedValue,
      specialite: specialite.find(item => item.id === selectedOption?.value) || undefined,
    });
  };



  const delegationColumns = [
    {
      id: 'id',
      header: 'id',
      accessorKey: 'id',
      enableSorting: true,
      sortDescFirst: true,
    },
    {
      accessorKey: "province.region.name",
      header: "الجهة ",
      cell: ({ row }) => (
        <div className="capitalize  rtl:text-right">{row.original.province.region.name}</div>
      ),
    },
    {
      accessorKey: "province.name",
      header: "المندوبية ",
      id:"المندوبيات",
      cell: ({ row }) => (
        <div className="capitalize rtl:text-right"> {row.original.province.name}</div>
      ),
    },
    {
      accessorKey: "association.name",
      header: " إسم الجمعية " ,
      id : "الجمعيات",
      cell: ({ row }) => (
        <div className="capitalize rtl:text-right">{row.original.association.name}</div>
      
    ), 
  },
    
    {
      accessorKey: "fullName",
      header: " إسم الإطار",
      id :  "إسم الإطار",
      cell: ({ row }) => (
        <div className="capitalize  rtl:text-right">{row.original.fullName}</div>
      ),
    },
   
    {
      accessorKey: "specialite.specialite",
      header: "مجال التخصص" ,
      cell: ({ row }) => (
        <div className="capitalize  rtl:text-right">{row.original.specialite.specialite}</div>
      
    ), 
  },

  
  {
    accessorKey: "salaireMensuel",
    header: "الأجر الشهري بالدرهم " ,
    cell: ({ row }) => (
      <div className="capitalize  rtl:text-right">{row.getValue("salaireMensuel")}</div>
    
  ), 
},


 
{
  accessorKey: "contrat",
  header: "  صيغة التعاقد   " ,
  cell: ({ row }) => (
    <div className="capitalize  rtl:text-right">{row.getValue("contrat")}</div>
  
), 
},

{
  accessorKey: "cnss",
  header:" التصريح ب (CNSS)",
  cell: ({ row }) => (
    <div className="capitalize  rtl:text-right">{row.getValue("cnss")}</div>
  
), 
},

{
  accessorKey: "fraisCnss",
  header: " تأدية مصاريف CNSS للإطار    " ,
  cell: ({ row }) => (
    <div className="capitalize  rtl:text-right">{row.getValue("fraisCnss")}</div>
  
), 
},

{
  accessorKey: "montantAnnuel",
  header: "المبلغ الإجمالي السنوي",
  cell: ({ row }) => (
    <div className="capitalize rtl:text-right">{row.getValue("montantAnnuel")}</div>
  
), 
},


    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

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
              <DropdownMenuItem
                onClick={() => {
                  setselectedValue(row.original);
                 // console.log(selectedValue.id);
                  setModelDeleteIsOpen(true);
                }}
              >
                حذف
              </DropdownMenuItem>
             
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const { toast } = useToast()

  //use query to get data from the server
  
 
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
          
          province:selectedDelegationn,
         // specialite:specialite
        };
        //formData.append('article', parsedSelectedValue);
       console.log('Données envoyées au serveur:', parsedSelectedValue); 
     const response = await api.post("/fonctionnaire/add",parsedSelectedValue, 
     {headers: {
      ...headers,
   
    }
            }
        
      )
        openModal()
        refetch()
        toast({
          description: "تمت إضافة الإطار بنجاح",
          className: "bg-green-500 text-white",
          duration: 2000,
          title: "نجاح",
        })
        setIsOpen(false);
      } catch (e) {
        toast({
          description: "حدث خطأ أثناء إضافة الإطار",
          className: "bg-red-500 text-white",
          duration: 2000,
          title: "خطأ",
        })
      }
    
        
    
    }
    else if (typeOfSubmit === "update" ) {
      console.log(selectedValue);
      try {
        
        
        //console.log('Données envoyées au serveur:', parsedSelectedValue);
       // console.log(selectedValue);
        const response = await api.put("/fonctionnaire/update/"+ selectedValue.id, 
          selectedValue, {
            headers: headers
                 
                })
          
        
        refetch()
        toast({
          description: "تم تحديث المعلومات بنجاح",
          className: "bg-green-500 text-white",
          duration: 2000,
          title: "نجاح",
        })
        setIsOpen(false);
      } catch (e) {
        toast({
          description: " حدث خطأ أثناء تحديث المعلومات",
          className: "bg-red-500 text-white",
          duration: 2000,
          title: "خطأ",
        })
      }
    }
  
  }


  const options2 = [
    { value: 'academic-year', label: 'سنة دراسية' },
    { value: 'financial-year', label: 'سنة مالية' },
    { value: 'other', label: 'أخرى' },
  ];
  const handleSelectChange1 = (selectedOption) => {
    setselectedValue(prevState => ({
      ...prevState,
      contrat: selectedOption ? selectedOption.value : ''
    }));
  };


  /*const handleSelectChange2 = (selectedOption) => {
    setselectedValue(prevState => ({
      ...prevState,
      cnss: selectedOption ? selectedOption.value : ''
    }));
  };

  const handleSelectChange3 = (selectedOption) => {
    setselectedValue(prevState => ({
      ...prevState,
      fraisCnss: selectedOption ? selectedOption.value : ''
    }));
  };*/


  const handleSelectChange2 = (selectedOption) => {
    setselectedValue(prevState => ({
      ...prevState,
      cnss: selectedOption ? selectedOption.value : '',
      fraisCnss: selectedOption?.value === 'لا' ? 'لا' : prevState.fraisCnss,
      montantAnnuel: selectedOption?.value === 'لا' ? '' : prevState.montantAnnuel,
    }));
  };
  
  const handleSelectChange3 = (selectedOption) => {
    setselectedValue(prevState => ({
      ...prevState,
      fraisCnss: selectedOption ? selectedOption.value : '',
      montantAnnuel: selectedOption?.value === 'لا' ? '' : prevState.montantAnnuel,
    }));
  };
  // Fonction pour gérer les changements dans le sélecteur


  const handleSelectChangeAss = (selectedOption) => {
    const selectedAssociation = associations.find(
      item => item.id === selectedOption?.value
    );
  
    setselectedValue({
      ...selectedValue,
      association: selectedAssociation || undefined,
    });
  
    if (selectedAssociation) {
      setFilteredEtablissements(selectedAssociation.etablissements);
    } else {
      setFilteredEtablissements([]);
    }
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
              ? "  إضافة إطار جديد"
              : "تحديث معلومات الإطار"}
          </h2>
         




          <div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="coordination">
  المنسقية
  </label>
  <input
    className="w-full border rounded-md px-3 py-2"
    type="text"
    id="region"
    placeholder="المنسقية"
    value={userData?.province?.region?.name}
    readOnly
  />
</div>

<div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="delegation">
  المندوبية
  </label>
  <input
    className="w-full border rounded-md px-3 py-2"
    type="text"
    id="delegation"
    placeholder="المندوبية"
    value={userData?.province?.name}
    readOnly
  />
</div>


<div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="fullName">
     اسم الإطار
  </label>
  <input
    className="w-full border rounded-md px-3 py-2"
    type="text"
    id="fullName"
    placeholder="الإطار"
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
  <label className="block mb-1" htmlFor="association.name">
    إسم الجمعية  
  </label>
  <Select
    id="association.name"
    options={AssociationByDele?.map(assoc => ({
      value: assoc.id,
      label: assoc.name
    }))}
    value={selectedValue?.association ? {
      value: selectedValue.association.id,
      label: selectedValue.association.name
    } : null}
    onChange={handleSelectChangeAss}
    placeholder="اختر الجمعية"
    className="w-full"
    required
  />
</div>

    <div className="px-6 mb-4 flex flex-col w-full">
      <label className="block mb-1" htmlFor="specialite.specialite">
      مجال التخصص
      </label>
      <Select
        id="specialite.specialite"
        options={options4}
        value={options4.find(option => option.value === selectedValue?.specialite?.id)}
        onChange={handleSelectChangePro}
        placeholder="اختر مجال التخصص"
        className="w-full"
        required
      />
    </div>
   
    <div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="salaireMensuel">
  الأجر الشهري بالدرهم
  </label>
  <input
    className="w-full border rounded-md px-3 py-2"
    type="number"
    id="salaireMensuel"
    placeholder="الأجر الشهري بالدرهم"
    value={selectedValue?.salaireMensuel || ""}
    onChange={(e) => {
      setselectedValue({
        ...selectedValue,
        salaireMensuel: e.target.value,
      });
    }}
    required
  />
</div>







  

<div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="contrat">
    صيغة التعاقد
  </label>
  <Select
    id="contrat"
    options={[
      { value: 'حصة أسبوعية كاملة' , label: 'حصة أسبوعية كاملة' },
      { value: 'نصف حصة أسبوعية', label: 'نصف حصة أسبوعية' },
      { value: 'ربع حصة أسبوعية' , label: 'ربع حصة أسبوعية' },

      { value: 'متطوع', label: 'متطوع' },
      { value:  'موضوع رهن الإشارة', label: 'موضوع رهن الإشارة' }
    ]}
    value={[
      { value: 'حصة أسبوعية كاملة', label: 'حصة أسبوعية كاملة' },
      { value: 'نصف حصة أسبوعية' , label: 'نصف حصة أسبوعية' },
      { value: 'موضوع رهن الإشارة', label: 'موضوع رهن الإشارة' },

      { value: 'متطوع', label: 'متطوع' },
      { value: 'ربع حصة أسبوعية', label: 'ربع حصة أسبوعية' }
    ].find(option => option.label === selectedValue?.contrat) || ""}
    onChange={handleSelectChange1}
    placeholder=" "
    className="w-full"
    required
  />
</div>







<div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="cnss">
    التصريح بالصندوق الوطني للضمان الاجتماعي CNSS
  </label>
  <Select
    id="cnss"
    options={[
      { value: 'نعم', label: 'نعم' },
      { value: 'لا', label: 'لا' },
    ]}
    value={[
      { value: 'نعم', label: 'نعم' },
      { value: 'لا', label: 'لا' },
    ].find(option => option.label === selectedValue?.cnss) || ""}
    onChange={handleSelectChange2}
    placeholder=" "
    className="w-full"
    required
  />
</div>

<div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="fraisCnss">
    يتم تأدية مصاريف الصندوق الوطني للضمان الاجتماعي CNSS للاطر المصرح بها من دعم برنامج تحسين ظروف تمدرس الأطفال في وضعية إعاقة
  </label>
  <Select
    id="fraisCnss"
    options={[
      { value: 'نعم', label: 'نعم' },
      { value: 'لا', label: 'لا' },
    ]}
    value={[
      { value: 'نعم', label: 'نعم' },
      { value: 'لا', label: 'لا' },
    ].find(option => option.label === selectedValue?.fraisCnss) || ""}
    onChange={handleSelectChange3}
    placeholder=" "
    className="w-full"
    required
    isDisabled={selectedValue?.cnss === 'لا'}
  />
</div>

<div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="montantAnnuel">
    المبلغ الإجمالي السنوي المأدى للصندوق الوطني للضمان الاجتماعي عن الإطار(خاص بالبرنامج)
  </label>
  <input
    className="w-full border rounded-md px-3 py-2"
    type="number"
    id="montantAnnuel"
    placeholder="المبلغ السنوي بالدرهم"
    value={selectedValue?.montantAnnuel || ""}
    onChange={(e) => {
      setselectedValue({
        ...selectedValue,
        montantAnnuel: e.target.value,
      });
    }}
    required
    disabled={selectedValue?.cnss === 'لا' || selectedValue?.fraisCnss === 'لا'}
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
        title={"  أطر الجمعيات  "}
        filterCols={[ 'المندوبيات', 'الجمعيات', 'إسم الإطار']}
        
      
        columns={delegationColumns}
        //filteredData
        data={data || []}
        setOpenModal={openModal}
        settypeOfSubmit={settypeOfSubmit}
        canAdd={true}
      />
    </div>
  );
};

export default Page;


 


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
      await api.delete("/fonctionnaire/delete/"+selectedValue.id,{
        headers: headers
             
            } )
            toast({
              description: "تم الحذف بنجاح",
              className: "bg-green-500 text-white",
              duration: 2000,
              title: "نجاح",
            })
            refetch()
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
