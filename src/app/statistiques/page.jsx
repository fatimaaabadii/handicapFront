"use client";
import React from "react";
import { DataTable } from "/src/components/tablee/table";
import { api, getUsers, getCurrentUser , getAssociations, getDelegations,getProgrammes, getRegions, getAssociationsByDele, getDashboard} from "/src/api";
import { useQuery } from "@tanstack/react-query"; // Assurez-vous que le composant DataTable est importé correctement




const columnsBeneficiaries = [
  { accessorKey: 'province', header: 'المندوبية' },
  { accessorKey: 'association', header: 'الجمعية' },
  { accessorKey: 'programme', header: 'البرنامج' },
  { accessorKey: 'value', header: 'عدد المستفيدين' },
];

const columnsOfficials = [
  { accessorKey: 'province', header: 'المندوبية' },
  { accessorKey: 'association', header: 'الجمعية' },
  { accessorKey: 'value', header: 'عدد الموظفين' },
];

const styles = {
  pageContainer: {
    padding: '20px 20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f9',
    color: '#333',
  },
  title: {
    textAlign: 'center',
    margin: '40px 0',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  tableContainer: {
    marginBottom: '30px',
    marginRight: '80px',
    marginLeft: '80px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
  },
};

function StatisticsPage() {

    const { data: dashboard,} = useQuery({
        queryKey: ['dashboard'],
        queryFn: getDashboard(),
      });
    const dataRegion = dashboard?.getBeneParDeleEtAsso?.map(([province, association,programme, count]) => ({
        province: province,
        association: association,
        programme:programme,
        value: count
      })) || [];




      const dataFonctionnaires = dashboard?.getFoncParDeleEtAsso?.map(([province, association, count]) => ({
        province: province,
        association: association,
        value: count
      })) || [];
      
      const { data: userData } = useQuery({
        queryKey: ['user'],
        queryFn: getCurrentUser(),
      });
      
      const filteredData = dataRegion.filter(item => item.province === userData?.province?.name);
      const filteredData2 = dataFonctionnaires.filter(item => item.province === userData?.province?.name);
      console.log(filteredData);
  return (

    
    <div style={styles.pageContainer} id="Subs">
      <h1 style={styles.title}>إحصائيات</h1>

      <div style={styles.tableContainer}>
        <DataTable
          title="عدد المستفيدين حسب الجمعية و المندوبية"
          columns={columnsBeneficiaries}
          data={filteredData}
          filterCols={['association']}
        />
      </div>

      <div style={styles.tableContainer}>
        <DataTable
          title="عدد الموظفين حسب الجمعية و المندوبية"
          columns={columnsOfficials}
          data={filteredData2}
          filterCols={['association']}
        />
      </div>
    </div>
  );
}

export default StatisticsPage;

