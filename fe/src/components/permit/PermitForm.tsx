'use client';
import { useCallback, useRef } from 'react';
import { PermitJenis } from '@/types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import GwpForm from './GwpForm';
import HwpForm from './HwpForm';
import CseForm from './CseForm';
import ElpForm from './ElpForm';
import EwpForm from './EwpForm';
import LwpForm from './LwpForm';
import RwpForm from './RwpForm';
import WhpForm from './WhpForm';
import JsaForm from './JsaForm';

interface PermitFormProps { jenis: PermitJenis; data: Record<string,unknown>; onChange: (d: Record<string,unknown>)=>void; }

const DEPT = [
  {value:'Produksi',label:'Produksi'},{value:'Maintenance',label:'Maintenance'},{value:'Engineering',label:'Engineering'},
  {value:'Quality Control',label:'QC'},{value:'Warehouse',label:'Warehouse'},{value:'Logistik',label:'Logistik'},
  {value:'HR & GA',label:'HR & GA'},{value:'Finance',label:'Finance'},{value:'Lainnya',label:'Lainnya'},
];

const JL: Record<PermitJenis,string> = {gwp:'General Work Permit (GWP)',hwp:'Hot Work Permit (HWP)',cse:'Confined Space Entry (CSE)',elp:'Electrical Work Permit (ELP)',ewp:'Excavation Work Permit (EWP)',lwp:'Lifting Work Permit (LWP)',rwp:'Radiography Work Permit (RWP)',whp:'Work at Height Permit (WHP)'};
const JD: Record<PermitJenis,string> = {gwp:'FM-BSHS-19/01',hwp:'FM-BSHS-19/03',cse:'FM-BSHS-19/02',elp:'FM-BSHS-19/05',ewp:'FM-BSHS-19/06',lwp:'FM-BSHS-19/07',rwp:'FM-BSHS-19/08',whp:'FM-BSHS-19/04'};

export default function PermitForm({ jenis, data, onChange }: PermitFormProps) {
  const dataRef = useRef(data);
  dataRef.current = data;
  const u = useCallback((k:string,v:unknown) => onChange({...dataRef.current,[k]:v}), [onChange]);
  const handleJSAChange = useCallback((rows: any[]) => u('jsa_tahapan', rows), [u]);

  const sub = (()=>{
    switch(jenis){
      case 'gwp': return <GwpForm data={data} onChange={onChange}/>;
      case 'hwp': return <HwpForm data={data} onChange={onChange}/>;
      case 'cse': return <CseForm data={data} onChange={onChange}/>;
      case 'elp': return <ElpForm data={data} onChange={onChange}/>;
      case 'ewp': return <EwpForm data={data} onChange={onChange}/>;
      case 'lwp': return <LwpForm data={data} onChange={onChange}/>;
      case 'rwp': return <RwpForm data={data} onChange={onChange}/>;
      case 'whp': return <WhpForm data={data} onChange={onChange}/>;
      default: return null;
    }
  })();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white">
        <h3 className="font-bold text-base sm:text-lg">{JL[jenis]}</h3>
        <p className="text-blue-100 text-xs sm:text-sm">No. Dokumen: {JD[jenis]}</p>
      </div>

      {/* Sub Form */}
      {sub}

      {/* JSA - Wajib */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
          <h4 className="font-semibold text-gray-800 dark:text-white text-sm">Job Safety Analysis (JSA)</h4>
          <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-semibold">WAJIB</span>
        </div>
        <JsaForm value={(data.jsa_tahapan as any[])||[]} onChange={handleJSAChange}/>
      </div>
    </div>
  );
}
