"use client";
import { DataTable } from "/src/components/ttable/index";
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
import { useRouter } from 'next/navigation';
import { api, getUsers, getCurrentUser , getAssociations, getDelegations,getProgrammes, getRegions, getEtablissement, getAssociationsById} from "/src/api";
import { QueryClient, QueryClientProvider } from 'react-query';
import ReactDOM from 'react-dom';
import React from 'react';
import Multiselect from "multiselect-react-dropdown";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import ReactQuill from "react-quill";
import { useParams } from 'next/navigation';
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
  
  //const Editor = React.lazy(() => import("react-draft-wysiwyg"));
  const [selectedCoordination, setSelectedCoordination] = useState(null);
  const [selectedDelegation, setSelectedDelegation] = useState(null);
  
  
  
  const router = useRouter();
  const params = useParams();
  const idAssociation = params.id;
  const { data: associationById, refetch: refetchAssociation, isLoading, isError } = useQuery({
    queryKey: ['associationById', idAssociation],
    queryFn: () => getAssociationsById(idAssociation),
    enabled: !!idAssociation, // Ne lance la requête que si idAssociation est défini
});
  //console.log(idAssociation);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOptionss, setSelectedOptionss] = useState([]);
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


  const { data: association,refetch} = useQuery({
    queryKey: ['association'],
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
  
  
  


  console.log(associationById);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (associationById) {
      // Assurez-vous que associationById est un tableau
      setData(Array.isArray(associationById) ? associationById : [associationById]);
    }
  }, [associationById]);
  const { data: programme,} = useQuery({
    queryKey: ['programme'],
    queryFn: getProgrammes(),
  });
  
  const { data: etablissement,} = useQuery({
    queryKey: ['etablissement'],
    queryFn: getEtablissement(),
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

 


 
 


 

const dataWithAssociationNames = etablissement?.map((etablissement) => {
  
  // Trouvez l'association qui contient cet établissement
  const matchedAssociation = association?.find((assoc) =>
    assoc.etablissements.some((etab) => etab.id === etablissement.id)
  );

  // Ajoutez le nom de l'association ou un texte par défaut
  return {
    ...etablissement,
    association_name: matchedAssociation ? matchedAssociation.name : "Non disponible"
  };
});
  const delegationColumns = [
    {
      id: 'id',
      header: 'id',
      accessorKey: 'id',
      enableSorting: true,
      sortDescFirst: true,
    },
   /* {
      accessorKey: "region",
      header: "الجهة ",
      cell: ({ row }) => (
        <div className="capitalize rtl:text-right ">{row.getValue("region")}</div>
      ),
    },
   /* {
      accessorKey: "prenom",
      header: "المندوبية ",
      cell: ({ row }) => (
        <div className="capitalize rtl:text-right">{row.getValue("prenom")}</div>
      ),
    },
     {
  accessorKey: "province_id",
  header: "المندوبية",
  cell: ({ row }) => {
    const provinceId = row.getValue("province_id");
    const provinceName = useMemo(() => {
      if (!refetchh) return "Chargement...";
      const province = refetchh.find(p => p.province_id === provinceId);
      return province ? province.name : "Inconnu";
    }, [provinceId, refetchh]);

    return (
      <div className="capitalize rtl:text-right">{provinceName}</div>
    );
  },
},*/
    {
      accessorKey: "name",
      header: "  اسم الجمعية",
      cell: ({ row }) => (
        
        <div className="capitalize ">{row.getValue("name")}</div>
      ),
    },
   
    {
      accessorKey: "etablissements",
      header: "اسم المؤسسة",
      cell: ({ row }) => {
        const etablissements = row.original.etablissements || [];
        // Crée une chaîne de noms séparés par des virgules
        const etablissementsNames = etablissements.map(etab => etab.name).join(', ');
        return (
          <div className="capitalize ">{etablissementsNames}</div>
        );
      },
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
            { /* <DropdownMenuItem
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

  //use query to get data from the server
 
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser(),
  });
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
          etablissement_id: parseFloat(selectedValue.id),
           name:selectedValue.name
        
        };
        //formData.append('article', parsedSelectedValue);
       console.log('Données envoyées au serveur:', parsedSelectedValue); 
      const response = await api.post("/Etablissement/add",parsedSelectedValue, 
       {headers: {
         ...headers,
   
     }
              }
         
       )
        openModal()
        refetch()
        toast({
          description: "تمت إضافة المؤسسة بنجاح",
          className: "bg-green-500 text-white",
          duration: 2000,
          title: "نجاح",
        })
        setIsOpen(false);
      } catch (e) {
        toast({
          description: "حدث خطأ أثناء إضافة المؤسسة",
          className: "bg-red-500 text-white",
          duration: 2000,
          title: "خطأ",
        })
      }
    
        
    
    }
    else if (typeOfSubmit === "update" ) {
      console.log(selectedValue);
      try {
        const parsedSelectedValue = {
          ...selectedValue,
          etablissements: selectedValue.etablissements.map(etablissement => ({
            ...etablissement,
            name: etablissement.name.trim() 
          }))
        };
        
        
        console.log('Données envoyées au serveur:', parsedSelectedValue);
       // console.log(selectedValue);
      const response = await api.put("/association/update/"+ selectedValue.id, 
        parsedSelectedValue, {
            headers: headers
                 
                })
                console.log(response);
          
        
                refetchAssociation()
        toast({
          description: "تم تحديث المعلومات بنجاح",
          className: "bg-green-500 text-white",
          duration: 2000,
          title: "نجاح",
        })
        setIsOpen(false);
      } catch (e) {
        toast({
          description: "حدث خطأ أثناء تحديث المعلومات",
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

  // Fonction pour gérer les changements dans le sélecteur
  const handleSelectChange2 = (selectedOption) => {
    setselectedValue(selectedOption);
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
              ? "إضافة مؤسسة جديدة"
              : "تحديث معلومات المؤسسة"}
          </h2>
         




          <div className="px-6 mb-4 flex flex-col w-full">
  <label className="block mb-1" htmlFor="etablissements">
    أسماء المؤسسات
  </label>
  {selectedValue.etablissements && selectedValue.etablissements.length > 0 ? (
    selectedValue.etablissements.map((etablissement, index) => (
      <div key={etablissement.id} className="flex mb-2">
        <input
          className="w-full border rounded-md px-3 py-2"
          type="text"
          value={etablissement.name}
          onChange={(e) => {
            const updatedEtablissements = [...selectedValue.etablissements];
            updatedEtablissements[index].name = e.target.value;
            setselectedValue({
              ...selectedValue,
              etablissements: updatedEtablissements,
            });
          }}
        />
      </div>
    ))
  ) : (
    <p>Pas d&apos;établissements à afficher</p>
  )}
</div>



    
          <div className="mt-4 px-6 flex justify-end">
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md">
          إرسال
            </button>
          </div>
        </form>
      </Modal>
      <DataTable
        title={" معلومات حول المؤسسات المسيرة من طرف هذه الجمعية   "}
        filterCol="name"
        columns={delegationColumns}
        //filteredData
        data={data || []}
        refetch={refetchAssociation}
       // data={dataWithAssociationNames || []}
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
