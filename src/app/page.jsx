"use client";
import React, { useState } from 'react';
//import React from 'react';
import styled from 'styled-components';
import { api, getUsers, getCurrentUser , getAssociations, getDelegations,getProgrammes, getRegions, getAssociationsByDele, getDashboard} from "/src/api";
import { useQuery } from "@tanstack/react-query";
//import { PieChart, Pie, Cell, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Sector } from 'recharts';
// Styled components
const DashboardContainer = styled.div`
  direction: rtl;
  padding: 24px;
  background-color: #f0f2f5;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 24px;
  color: #1890ff;
  font-size: 28px;
  font-weight: bold;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  width: 30%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.div`
  font-size: 16px;
  color: #8c8c8c;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
`;

const ChartsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ChartCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  width: 48%;
  margin-bottom: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h2`
  font-size: 18px;
  color: #1890ff;
  margin-bottom: 16px;
  text-align: center;
`;

const BarChartCard = styled(ChartCard)`
  width: 100%;
  height: 400px;
`;
// Couleurs pour les graphiques
const COLORS = [
  '#0088FE', // Bleu
  '#00C49F', // Vert
  '#FFBB28', // Jaune
  '#FF8042', // Orange
  '#8884D8', // Violet
  '#FF6F61', // Rouge corail
  '#6A5ACD', // Bleu ardoise
  '#FFD700', // Or
  '#40E0D0', // Turquoise
  '#9ACD32', // Vert lime
  '#FF1493'  // Rose profond
];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};




// Composant principal du dashboard
const Dashboard = ({ data }) => {
  // Données fictives pour l'exemple

  const { data: dashboard,} = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard(),
  });
  const mockData = {
    totalAssociations: 150,
    totalEstablishments: 300,
    totalBeneficiaries: 5000,
    beneficiariesByGender: [
      { name: 'ذكور', value: dashboard?.getNbrBeneficiairesParSexeM },
      { name: 'إناث', value: dashboard?.getNbrBeneficiairesParSexeF },
    ],
    beneficiariesByProgram: [
      { name: 'برنامج أ', value: dashboard?.nbrBeneficiairesParProgrammeA },
      { name: 'برنامج ب', value: dashboard?.getNbrBeneficiairesParProgrammeB },
      { name: 'برنامج ج', value: dashboard?.getNbrBeneficiairesParProgrammeC  },
     
    ],
    beneficiariesByAge: [
      { name: '0-18', value: 1200 },
      { name: '19-30', value: 1800 },
      { name: '31-50', value: 1500 },
      { name: '51+', value: 500 },
    ],
    beneficiariesByDisabilityType: [
      { name: 'الإعاقة الذهنية', value: dashboard?.getnbrHandicapMental },
      { name: 'التوحد', value: dashboard?.getNbrAutisme },
      { name: 'التثلث الصبغي', value: dashboard?.getNbrTrisomie },
      { name: 'IMC الشلل الدماغي', value: dashboard?.getNbrIMC },
      { name: 'IMOC الشلل الدماغي', value:  dashboard?.getNbrIMOC },



      { name: ' الإعاقة الحركية', value:  dashboard?.getNbrHandicapMvmt },

      
     /* { name: 'الإعاقة السمعية', value:  dashboard?.getNbrHandicapAuditif },
      { name: ' الإعاقة البصرية ', value:  dashboard?.getNbrOptique },
      { name: 'الإعاقة المتعددة', value:  dashboard?.getNbrhandicapMultiple },*/

      { name: 'الإعاقة السمعية', value:  dashboard?.getNbrHandicapAuditif },
      { name: ' الإعاقة البصرية ', value:  dashboard?.getNbrOptique },
      { name: 'الإعاقة المتعددة', value:  dashboard?.getNbrhandicapMultiple },
   
      { name: '  اضطرابات التعلم', value:  dashboard?.getNbrTroubleApprentissage },
      { name: 'جفاف الجلد المصطبغ ', value:  dashboard?.getNbrPeauSeche },
    ],
    beneficiariesByService: [
      { name: 'التربية الخاصة', value:  dashboard?.getNbrBeneficiairesParServiceSpecialEducation },
      { name: 'تصحيح النطق', value:  dashboard?.getNbrBeneficiairesParServiceSpeechCorrection },
      { name: 'الترويض الحركي', value:  dashboard?.getNbrBeneficiairesParServiceMotorRehabilitation },
      { name: 'النفسي الحركي', value:  dashboard?.getNbrBeneficiairesParServicePsychomotor },
      { name: 'العلاج الوظيفي', value:  dashboard?.getNbrBeneficiairesParServiceOccupationalTherapy },
      { name: 'الدعم و المواكبة النفسية', value:  dashboard?.getNbrBeneficiairesParServicePsychologicalSupport },
      { name: 'التأهيل المهني', value:  dashboard?.getNbrBeneficiairesParServiceProfessionalRehabilitation },
    ],



     fonctionnairesBySpecialite : [
      { name: 'مدير', value: dashboard?.getFonctParSpecialiteDirecteur },
      { name: 'المنسق التربوي', value: dashboard?.getFonctParSpecialiteCoordateurPédagogique },
      { name: 'السائق', value: dashboard?.getFonctParSpecialitechauffeur },
      { name: 'مرافقات النقل', value: dashboard?.getFonctParSpecilitetransport },
      { name: 'تربية خاصة', value: dashboard?.getFonctParSpecialiteEducationSpeciale },
      { name: 'التأهيل المهني', value: dashboard?.getFonctParSpecialiteformationprofessionnelle },
      { name: 'تصحيح النطق', value: dashboard?.getFonctParSpecialiteCorrectionprononciation },
      { name: 'الترويض الطبي', value: dashboard?.getFonctParSpecialiteDressagemédical },
      { name: 'تخصص نفسي حركي', value: dashboard?.getFonctParSpecialitepsychomotrice },
      { name: 'العلاج الوظيفي المهني', value: dashboard?.getFonctParSpecialiteErgothérapie },
      { name: 'تخصص الدعم النفسي', value: dashboard?.getFonctParSpecialitesoutienpsychologique },
      { name: 'أطر المطعمة', value: dashboard?.getFonctParSpecialitemarqueterie }
    ],
  };

  // Utiliser les données réelles si elles sont fournies, sinon utiliser les données fictives
   const dashboardData = data || mockData;
   const [activeIndex, setActiveIndex] = useState(null);
   const [activeIndex1, setActiveIndex1] = useState(null);
   const [activeIndex2, setActiveIndex2] = useState(null);
   const [activeIndex3, setActiveIndex3] = useState(null);

   const onPieEnter = (_, index) => {
     setActiveIndex(index);
   };

   const onPieEnter1 = (_, index) => {
    setActiveIndex1(index);
  };

  const onPieEnter2 = (_, index) => {
    setActiveIndex2(index);
  };

  const onPieEnter3 = (_, index) => {
    setActiveIndex3(index);
  };

   const dataRegion = dashboard?.getBeneParRegion?.map(([region, count]) => ({
    name: region,
    value: count
  }));

  console.log(dataRegion);

  //console.log(dashboard);
  return (
    <DashboardContainer>
      <Title>لوحة المعلومات</Title>
      
      <StatsContainer>
        <StatCard>
          <StatTitle>إجمالي الجمعيات</StatTitle>
          <StatValue>{dashboard?.nbrAssociations}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>إجمالي المؤسسات</StatTitle>
          <StatValue>{dashboard?.nbrEtablissements}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>إجمالي المستفيدين</StatTitle>
          <StatValue>{dashboard?.nbrBeneficiaries}</StatValue>
        </StatCard>
      </StatsContainer>

      <ChartsContainer>
      <ChartCard>
  <ChartTitle>المستفيدون حسب الجنس</ChartTitle>
  <ResponsiveContainer width="100%" height={400}>
    <PieChart>
      <Pie
        activeIndex={activeIndex}
        activeShape={renderActiveShape}
        data={dashboardData.beneficiariesByGender}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        onMouseEnter={onPieEnter}
      >
        {dashboardData.beneficiariesByGender.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Legend 
        layout="vertical" 
        align="right" 
        verticalAlign="middle"
        wrapperStyle={{
          direction: 'ltr',
          textAlign: 'middle'
        }}
      />
    </PieChart>
  </ResponsiveContainer>
</ChartCard>


<ChartCard>
  <ChartTitle>المستفيدون حسب البرنامج</ChartTitle>
  <ResponsiveContainer width="100%" height={400}>
    <PieChart>
      <Pie
        activeIndex={activeIndex1}
        activeShape={renderActiveShape}
        data={dashboardData.beneficiariesByProgram}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        onMouseEnter={onPieEnter1}
      >
        {dashboardData.beneficiariesByProgram.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Legend 
        layout="vertical" 
        align="right" 
        verticalAlign="middle"
        wrapperStyle={{
          direction: 'ltr',
          textAlign: 'middle'
        }}
      />
    </PieChart>
  </ResponsiveContainer>
</ChartCard>


       

        
        <ChartCard>
      <ChartTitle>المستفيدون حسب نوع الإعاقة</ChartTitle>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            activeIndex={activeIndex2}
            activeShape={renderActiveShape}
            data={dashboardData.beneficiariesByDisabilityType}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter2}
          >
            {dashboardData.beneficiariesByDisabilityType.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend 
            layout="vertical" 
            align="right" 
            verticalAlign="middle"
            wrapperStyle={{
              direction: 'ltr',
              textAlign: 'middle'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
       {/* <ChartCard>
          <ChartTitle>المستفيدون حسب العمر</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.beneficiariesByAge}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {dashboardData.beneficiariesByAge.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>*/}



<ChartCard>
  <ChartTitle>عدد المستفيدين حسب الخدمة المقدمة</ChartTitle>
  <ResponsiveContainer width="100%" height={400}>
    <PieChart>
      <Pie
        activeIndex={activeIndex3}
        activeShape={renderActiveShape}
        data={dashboardData.beneficiariesByService}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        onMouseEnter={onPieEnter3}
      >
        {dashboardData.beneficiariesByService.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Legend 
        layout="vertical" 
        align="right" 
        verticalAlign="middle"
        wrapperStyle={{
          direction: 'ltr',
          textAlign: 'middle'
        }}
      />
    </PieChart>
  </ResponsiveContainer>
</ChartCard>

      </ChartsContainer>

     




      <BarChartCard>
  <ChartTitle>عدد المستفيدين حسب الجهة</ChartTitle>
  <ResponsiveContainer width="100%" height={500}>
    <BarChart
      data={dataRegion}
      margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis 
        dataKey="name" 
        angle={-90} 
       // textAnchor="end" 
        height={150}
        interval={0}
        tick={{fontSize: 12}}
        tickMargin={70}
      />
      <YAxis 
        tickFormatter={(value) => Math.round(value)}
        domain={[0, 'dataMax + 1']}
        allowDecimals={false}
        tickMargin={10}
      />
      <Tooltip cursor={{fill: 'rgba(0, 0, 0, 0.1)'}} />
      <Legend wrapperStyle={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: '20px',
            textAlign: 'left'
          
          }} />
      <Bar 
        dataKey="value" 
        fill="#4e79a7" 
        name="عدد المستفيدين"
        barSize={30}
      />
    </BarChart>
  </ResponsiveContainer>
</BarChartCard>




<BarChartCard>
  <ChartTitle>عدد الأطر حسب التخصص   </ChartTitle>
  <ResponsiveContainer width="100%" height={500}>
    <BarChart
      data={dashboardData.fonctionnairesBySpecialite}
      margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis 
        dataKey="name" 
        angle={-90} 
       // textAnchor="end" 
        height={150}
        interval={0}
        tick={{fontSize: 12}}
        tickMargin={70}
      />
      <YAxis 
        tickFormatter={(value) => Math.round(value)}
        domain={[0, 'dataMax + 1']}
        allowDecimals={false}
        tickMargin={10}
      />
      <Tooltip cursor={{fill: 'rgba(0, 0, 0, 0.1)'}} />
      <Legend wrapperStyle={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: '20px',
            textAlign: 'left'
          
          }} />
      <Bar 
        dataKey="value" 
        fill="#4e79a7" 
        name="عدد الأطر "
        barSize={30}
      />
    </BarChart>
  </ResponsiveContainer>
</BarChartCard>
    </DashboardContainer>
  );
};

export default Dashboard;