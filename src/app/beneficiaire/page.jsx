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
import { api, getUsers, getCurrentUser , getAssociations, getDelegations,getProgrammes, getRegions,getBeneficiares, getBeneByDele, getAssociationsByDele, getTypeHandicap, getServices, getSpecialite} from "/src/api";
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
 
  const [selectedCoordination, setSelectedCoordination] = useState(null);
 
  const [filteredEtablissements, setFilteredEtablissements] = useState([]);
  
 
  const { data: associations,refetch} = useQuery({
    queryKey: ['associations'],
    queryFn: getAssociations(),
  });

  const { data: region,} = useQuery({
    queryKey: ['region'],
    queryFn: getRegions(),
  });
  const { data: programme,} = useQuery({
    queryKey: ['programme'],
    queryFn: getProgrammes(),
  });

  const { data: typeHandicap,} = useQuery({
    queryKey: ['typeHandicap'],
    queryFn: getTypeHandicap(),
  });

  const { data: services,} = useQuery({
    queryKey: ['services'],
    queryFn: getServices(),
  });
  

  const { data: specialite,} = useQuery({
    queryKey: ['specialite'],
    queryFn: getSpecialite(),
  });
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser(),
  });

  const { data: beneficiares } = useQuery({
    queryKey: ['beneficiares'],
    queryFn: getBeneficiares(),
  });





  const province = userData?.province?.name;

  const { data: deleguation,refetchh} = useQuery({
    queryKey: ['deleguation'],
    queryFn: getDelegations(),
    enabled: !!userData
  });
  //console.log(province);
  const { data: BeneByDele, refetch: refetchBene, isLoading, isError } = useQuery({
    queryKey: ['BeneByDele', userData?.province?.name],
    queryFn: () => getBeneByDele(userData?.province?.name),
    enabled: !!province, // Ne lance la requête que si idAssociation est défini
});
const selectedDelegationn = userData?.province?.name 
  ? deleguation?.find(deleg => deleg.name === userData.province.name)
  : null;
console.log(selectedDelegationn);
const [data, setData] = useState([]);
console.log(BeneByDele);



  useEffect(() => {
    if (BeneByDele) {
      // Assurez-vous que associationById est un tableau
      setData(Array.isArray(BeneByDele) ? BeneByDele : [BeneByDele]);
    }
  }, [BeneByDele]);


  useEffect(() => {
    if (userData?.roles !== 'ADMIN_ROLES' && BeneByDele) {
      // Afficher les associations par délégation si le rôle n'est pas ADMIN_ROLES
      setData(Array.isArray(BeneByDele) ? BeneByDele : [BeneByDele]);
    } ;
    
    if (userData?.roles == 'ADMIN_ROLES' && beneficiares){
      // Afficher toutes les associations si le rôle est ADMIN_ROLES
      setData(Array.isArray(beneficiares) ? beneficiares : [beneficiares]);
    }
  }, [BeneByDele, beneficiares, userData?.roles]);


  const { data: AssociationByDele, refetch: refetchAsso} = useQuery({
    queryKey: ['AssociationByDele', userData?.province?.name],
    queryFn: () => getAssociationsByDele(userData?.province?.name),
    enabled: !!userData?.province?.name, // Ne lance la requête que si idAssociation est défini
});

  const options1 = (AssociationByDele || []).map(asso => ({
    value: asso.id,
    label: asso.name, // Assurez-vous que vous avez un champ `programmeName` ou remplacez-le par le champ approprié
  }));


  const options4 = (programme || []).map(programme => ({
    value: programme.id,
    label: programme.programmeName, // Assurez-vous que vous avez un champ `programmeName` ou remplacez-le par le champ approprié
  }));

  const options3 = (associations || []).map(asso => ({
    value: asso.id,
    label: asso.name, // Assurez-vous que vous avez un champ `programmeName` ou remplacez-le par le champ approprié
  }));


  const options5 = (Array.isArray(services) ? services : []).map(asso => ({
    value: asso.id,
    label: asso.serviceName, // Assurez-vous que vous avez un champ `serviceName` ou remplacez-le par le champ approprié
  }));
  

  const optionsexe = [
    { value: 'F', label: 'أنثى' },
    { value: 'M', label: 'ذكر' },
  
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOptionss, setSelectedOptionss] = useState([]);
 

  const [typeOfSubmit, settypeOfSubmit] = useState("create");
  const token = getCookie('token'); 
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const [selectedValue, setselectedValue] = useState({
    
    degreHandicap:'',
  
   });



  useEffect(() => {
    if (selectedValue && selectedValue.coordination) {
      // Cherche l'option correspondante à la coordination actuelle
      const initialOption = (refetchh || []).find(item => item.coordination === selectedValue.coordination);
      setSelectedCoordination(initialOption ? {
        value: initialOption.id.toString(),
        label: initialOption.coordination,
      } : null);
    }
  }, [selectedValue, refetchh]);




  const optionss = (refetchh || []).map(item => ({
    value: item.id.toString(),
    label: item.delegation,
  }));


  const filteredDelegations = (refetchh || []).filter(item => 
    item.coordination === selectedCoordination?.label
  );
  const delegationOptions = filteredDelegations.map(item => ({
    value: item.id.toString(),
    label: item.delegation,
  }));

  


  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: [] }],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ color: ["red", "#785412"] }],
      [{ background: ["red", "#785412"] }]
    ]
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "image",
    "background",
    "align",
    "size",
    "font"
  ];

 

  const sexMapping = {
    'F': 'أنثى', // Femme en arabe
    'M': 'ذكر'   // Homme en arabe
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
        <div className="capitalize  rtl:text-right">{row.original.province?.region?.name}</div>
      ),
    },
    {
      accessorKey: "province.name",
      id:"المندوبيات",
      header: "المندوبية ",
      cell: ({ row }) => (
        <div className="capitalize rtl:text-right"> {row.original.province?.name}</div>
      ),
    },


    {
      accessorKey: "association.name",
      id : "الجمعيات",
      header: " اسم الجمعية " ,
      cell: ({ row }) => (
        <div className="capitalize  rtl:text-right">{row.original.association?.name}</div>
      
    ), 
  },
    {
      accessorKey: "etablissements", // Utilisez "etablissements" car c'est la clé dans vos données
      header: "اسم المؤسسة",
      cell: ({ row }) => (
        <div className="capitalize  rtl:text-right">{row.original.etablissement?.name}</div>
      ),
    },

  
    
    {
      accessorKey: "fullName",
      header: "  اسم المستفيد",
      id:"أسماء المستفيدين",
      cell: ({ row }) => (
        <div className="capitalize  rtl:text-right">{row.original.fullName}</div>
      ),
    },

    {
      accessorKey: "sexe",
      header: " الجنس ",
      cell: ({ row }) => {
        const sexValue = row.getValue("sexe");
        // Utiliser le mapping pour remplacer les valeurs
        const sexInArabic = sexMapping[sexValue] || sexValue; // Valeur par défaut si non trouvée
        return (
          <div className="capitalize rtl:text-right">
            {sexInArabic}
          </div>
        );
      },
    },
   
   
  {
    accessorKey: "programme.programmeName",
    id:"البرامج",
    header: " نوع البرنامج " ,
    cell: ({ row }) => (
      <div className="capitalize rtl:text-right">{row.original.programme?.programmeName}</div>
    
  ), 
},


 
{
  accessorKey: "age",
  header: "  تاريخ الإزدياد   " ,
  cell: ({ row }) => (
    <div className="capitalize  rtl:text-right">{row.getValue("age")}</div>
  
), 
},

{
  accessorKey: "typeHandicap.handicap",
  header: "    نوع الإعاقة " ,
  cell: ({ row }) => (
    <div className="capitalize  rtl:text-right">{row.original.typeHandicap?.handicap}</div>
  
), 
},
{
  accessorKey: "degreHandicap",
  header: "   درجة الإعاقة " ,
  cell: ({ row }) => (
    <div className="capitalize  rtl:text-right">{row.getValue("degreHandicap")}</div>
  
), 
},
/*{
  accessorKey: "service_offert",
  header: "    الخدمات المقدمة " ,
  cell: ({ row }) => (
    <div className="capitalize  rtl:text-right">{row.getValue("service_offert")}</div>
  
), 
},*/

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
  
 
  useEffect(() => {
    if (selectedValue && selectedValue.delegations && selectedValue.delegations.length > 0) {
      setSelectedOptions(selectedValue.delegations.map(delegation => ({
        value: delegation.id.toString(),
        label: delegation.delegation,
      })));
    }
  }, [selectedValue]);
  
  useEffect(() => {
    if (selectedValue && selectedValue.delegations && selectedValue.coordination) {
      setSelectedOptionss([
        {
          value: selectedValue.coordination,
          label: selectedValue.coordination,
        }
      ]);
    }
  }, [selectedValue]);
 /* useEffect(() => {
    if (selectedValue && selectedValue.etablissement) {
      setSelectedOptionss([
        {
          value: selectedValue.etablissement,
          label: selectedValue.etablissement,
        }
      ]);
    }
  }, [selectedValue]);*/
  const handleSelect = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
    console.log([parseFloat(selectedOptions.value)]);
    // Autres manipulations si nécessaire
  };
  const handleSelectt = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
    console.log([parseFloat(selectedOptions.value)]);
    // Autres manipulations si nécessaire
  };
  
  
  //console.log(articles);
  function closeModal() {
    setIsOpen(false);
  }


  
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (typeOfSubmit === "create") {
     // console.log('Données envoyées au serveur:', selectedValue); 
      try {
        const parsedSelectedValue = {
          ...selectedValue,
          etablissement:selectedValue.etablissements, 
          province:selectedDelegationn
        };
        //formData.append('article', parsedSelectedValue);
       console.log('Données envoyées au serveur:',parsedSelectedValue); 
      const response = await api.post("/beneficiaire/add",parsedSelectedValue,
       {headers: {
         ...headers,
   
     }
              }
         
      )
        openModal()
        refetchBene()
        toast({
          description: "تمت إضافة المستفيد بنجاح",
          className: "bg-green-500 text-white",
          duration: 2000,
          title: "نجاح ",
        })
        setIsOpen(false);
      } catch (e) {
        toast({
          description: "حدث خطأ أثناء إضافة المستفيد",
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
        const response = await api.put("/beneficiaire/update/"+ selectedValue.id, 
        selectedValue, {
            headers: headers
                 
                })
          
        
                refetchBene()
        toast({
          description: "تم تحديث المعلومات بنجاح",
          className: "bg-green-500 text-white",
          duration: 2000,
          title: "نجاح",
        })
        setIsOpen(false);
      } catch (e) {
        toast({
          description: "حدث خطأ أثناء التحديث ",
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
  const optionsDegre = [
    { value: 'عميقة', label: 'عميقة' },
    { value: 'متوسطة', label: 'متوسطة' },
    { value: 'خفيفة', label: 'خفيفة' },
  ];
  const handleSelectChange1 = (selectedOption) => {
    setselectedValue(prevState => ({
      ...prevState,
      degreHandicap: selectedOption ? selectedOption.value : ''
    }));
  };


  const handleSelectChangeService = (selectedOptions) => {
    // selectedOptions sera un tableau d'objets
    const selectedServices = selectedOptions.map(option => ({
      id: option.value,
      label: option.label
    }),
  
       setselectedValue(prevState => ({
    ...prevState,
    services: selectedServices ? selectedServices : ''
  })));
    
    // Mettre à jour l'état ou effectuer d'autres actions avec selectedServices
  };
  /*const optionshandicap = [
    { value: 'الإعاقة الذهنية', label: 'الإعاقة الذهنية' },
    { value: 'التوحد', label: 'التوحد' },
    { value: 'التثلث الصبغي', label: 'التثلث الصبغي' },
    { value: 'IMC الشلل الدماغي', label: '  IMC الشلل الدماغي' },
    { value: 'IMOC الشلل الدماغي', label: 'IMOC الشلل الدماغي' },
    { value: 'الإعاقة الحركية', label: 'الإعاقة الحركية' },
    { value: 'الإعاقة السمعية', label: 'الإعاقة السمعية' },
    { value: 'الإعاقة البصرية', label: 'الإعاقة البصرية' },
    { value: 'الإعاقة المتعددة', label: 'الإعاقة المتعددة' },
    { value: 'اضطرابات التعلم', label: 'اضطرابات التعلم' },
    { value: 'جفاف الجلد المصطبغ', label: 'جفاف الجلد المصطبغ' }
];*/
  // Fonction pour gérer les changements dans le sélecteur


  const optionshandicap = (typeHandicap || []).map(asso => ({
    value: asso.id,
    label: asso.handicap, // Assurez-vous que vous avez un champ `programmeName` ou remplacez-le par le champ approprié
  }));


  const handleSelectChange2 = (selectedOption) => {
    setselectedValue(selectedOption);
  };

 
    const handleSelectChangePro = (selectedOption) => {
      setselectedValue({
        ...selectedValue,
        programme: programme.find(item => item.id === selectedOption?.value) || undefined,
      });
    };
      


    const handleSelectChangeTypHand = (selectedOption) => {
      setselectedValue({
        ...selectedValue,
        typeHandicap: typeHandicap.find(item => item.id === selectedOption?.value) || undefined,
      });
    };
    
   /* const handleSelectChangeAss = (selectedOption) => {
      setselectedValue({
        ...selectedValue,
        association: associations.find(item => item.id === selectedOption?.value) || undefined,
      });
    };*/

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
	
    
    const handleSelectChangeSexe = (selectedOption) => {
      setselectedValue({
        ...selectedValue,
        sexe: selectedOption ? selectedOption.value : undefined,
      });
    };

    /*const handleSelectChangeTypHand = (selectedOption) => {
      setselectedValue({
        ...selectedValue,
        typeHandicap: selectedOption ? selectedOption.value : undefined,
      });
    };*/
    
   {/* const handleSelectChangeEta = (selectedOption) => {
      setselectedValue({
        ...selectedValue,
        association: associations.find(item => item.id === selectedOption?.value) || undefined,
      });
    };*/}


    const handleSelectChangeEta = (selectedOption) => {
      setselectedValue({
        ...selectedValue,
        etablissements: selectedOption ? {
          id: selectedOption.value,
          name: selectedOption.label
        } : undefined
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
              ? "  إضافة مستفيد جديد"
              : "تحديث معلومات المستفيد"}
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
     اسم المستفيد
  </label>
  <input
    className="w-full border rounded-md px-3 py-2"
    type="text"
    id="fullName"
    placeholder="المستفيد"
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

{/*<div className="px-6 mb-4 flex flex-col w-full">
      <label className="block mb-1" htmlFor="association.name">
      إسم الجمعية  
      </label>
      <Select
        id="association.name"
        options={options1}
        
        value={options1.find(option => option.value === selectedValue?.association?.id)}
        onChange={handleSelectChangeAss}
        placeholder="اختر الجمعية"
        className="w-full"
      />
    </div>

<div className="px-6 mb-4 flex flex-col w-full">
      <label className="block mb-1" htmlFor="etablissement.name">
      إسم المؤسسة 
      </label>
      <Select
        id="etablissement.name"
        options={options3}
        value={selectedValue}
        onChange={handleSelectChangeEta}
        placeholder="اختر المؤسسة"
        className="w-full"
      />
    </div>
*/}

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
  <label className="block mb-1" htmlFor="etablissement.name">
    إسم المؤسسة 
  </label>
  <Select
    id="etablissement.name"
    options={filteredEtablissements.map(etablissement => ({
      value: etablissement.id,
      label: etablissement.name
    }))}
    value={selectedValue?.etablissement ? {
      value: selectedValue.etablissement.id,
      label: selectedValue.etablissement.name
    } : selectedValue?.etablissement?.name}
    onChange={handleSelectChangeEta}
    placeholder="اختر المؤسسة"
    className="w-full"
    required
  />
</div>
 
    <div className="px-6 mb-4 flex flex-col w-full">
      <label className="block mb-1" htmlFor="programme.programmeName">
      نوع البرنامج
      </label>
      <Select
        id="programme.programmeName"
        options={options4}
        value={options4.find(option => option.value === selectedValue?.programme?.id)}
        onChange={handleSelectChangePro}
        placeholder="اختر البرنامج"
        className="w-full"
        required
      />
    </div>
    <div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="age">
  تاريخ الإزدياد
  </label>
  <input
    className="w-full border rounded-md px-3 py-2"
    type="date"
    id="age"
    placeholder="السن"
    value={selectedValue?.age || ""}
    onChange={(e) => {
      setselectedValue({
        ...selectedValue,
        age: e.target.value,
      });
    }}
    required
  />
</div>

<div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="sexe">
  الجنس
  </label>
  <Select
        id="sexe"
        options={optionsexe}
        value={optionsexe.find(option => option.value === selectedValue?.sexe)}
        onChange={handleSelectChangeSexe}
        placeholder="الجنس  "
        className="w-full"
        required
      />
</div>
 <div className="px-6 mb-4 flex flex-col w-full">
      <label className="block mb-1" htmlFor="typeHandicap.handicap">
      نوع الإعاقة
      </label>
      <Select
        id="handicap_id"
        options={optionshandicap}
        //value={selectedValue?.typeHandicap?.handicap}
        value={optionshandicap.find(option => option.value === selectedValue?.typeHandicap?.id)}
        onChange={handleSelectChangeTypHand}
        placeholder="اختر نوع الإعاقة"
        className="w-full"
        required
      />
    </div>


    <div className="px-6 mb-4 flex flex-col w-full">
      <label className="block mb-1" htmlFor="degreHandicap">
      درجة الإعاقة 
      </label>
      <Select
        id="degreHandicap"
        options={optionsDegre}
        value={optionsDegre.find(option => option.label === selectedValue?.degreHandicap) || ""}
        onChange={handleSelectChange1}
        placeholder="اختر درجة الإعاقة"
        className="w-full"
        required
      />
    </div>   
    <div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="etablissement">
    الخدمات المقدمة
  </label>
  <Select
    id="etablissement"
    options={options5}
    value={selectedValue?.services?.map(service => options5.find(option => option.value === service.id))}
    onChange={handleSelectChangeService}
    placeholder=" اختر الخدمات المقدمة"
    isMulti
    className="w-full"
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
        title={" المستفيدين "}
        filterCols={[ 'المندوبيات', 'الجمعيات', 'البرامج','أسماء المستفيدين']}
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
      await api.delete("/beneficiaire/delete/"+selectedValue.id,{
        headers: headers
             
            } )

            refetchBene()
      toast({
        description: "تم الحذف بنجاح",
        className: "bg-green-500 text-white",
        duration: 2000,
        title: "نجاح",
      })
    
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

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser(),
  });
  const province = userData?.province?.name;
  
  const { data: deleguation,refetchh} = useQuery({
    queryKey: ['deleguation'],
    queryFn: getDelegations(),
    enabled: !!userData
  });
  //console.log(province);
  const { data: BeneByDele, refetch: refetchBene, isLoading, isError } = useQuery({
    queryKey: ['BeneByDele', userData?.province?.name],
    queryFn: () => getBeneByDele(userData?.province?.name),
    enabled: !!province, // Ne lance la requête que si idAssociation est défini
  });
  const selectedDelegationn = deleguation?.find(deleg => deleg.name === userData?.province?.name);
  console.log(selectedDelegationn);
  const [data, setData] = useState([]);
  console.log(BeneByDele);
  useEffect(() => {
    if (BeneByDele) {
      // Assurez-vous que associationById est un tableau
      setData(Array.isArray(BeneByDele) ? BeneByDele : [BeneByDele]);
    }
  }, [BeneByDele]);

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
