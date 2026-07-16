'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
});

export default function LandingPage() {
  const [stats, setStats] = useState({
    board_month: '-',
    board_year: '-',
    working_days: { last_month: '0', this_month: '0' },
    safe_manhours: { last_month: '0', this_month: '0' },
    safe_manhours_recap: '0',
    last_accident: '-',
    current_datetime: { day: '0', hours: '00:00', date: '-' }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/landing-stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#1E88E5] flex items-center justify-center text-white font-bold">Memuat Papan Informasi...</div>;
  }

  // Helper for physical-style yellow number blocks
  const renderYellowBlocks = (value: string | number) => {
    const str = String(value).replace(/,/g, '');
    const len = str.length;
    // Auto-scale on mobile depending on digits count (supports up to 7+ digits cleanly)
    const mobileWidth = len >= 7 ? 'w-[17px] h-7 text-[10px]' : len >= 6 ? 'w-5 h-8 text-xs' : 'w-6 h-8 text-base';
    return (
      <div className="flex gap-0.5 sm:gap-1">
        {str.split('').map((char, i) => (
          <div key={i} className={`${mobileWidth} sm:w-10 sm:h-12 bg-[#FFEB3B] text-black font-bold sm:text-2xl flex items-center justify-center rounded-sm shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)] border border-[#FBC02D] font-mono`}>
            {char}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-2 sm:p-4 lg:py-8 font-sans relative">
      
      {/* Login Button - Kept minimal in top right */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50">
        <Link href="/login" className="bg-white/50 hover:bg-white text-gray-700 px-2.5 py-1 sm:px-4 sm:py-2 rounded font-bold text-xs sm:text-sm transition-all border border-gray-300 shadow">
          Login &rarr;
        </Link>
      </div>

      {/* Main Board Container - Matching the physical board */}
      <div className="w-full max-w-[1000px] bg-white rounded-md shadow-2xl overflow-hidden border-[6px] sm:border-[12px] border-gray-300 flex flex-col">
        
        {/* WHITE HEADER SECTION */}
        <div className="bg-white px-3 sm:px-8 py-2.5 sm:py-3.5 relative flex flex-col gap-1.5 sm:gap-3 shrink-0">
          {/* Top Row: Logos & Titles */}
          <div className="flex justify-between items-center">
            
            {/* Left side: Text & Logo */}
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-2xl md:text-3xl font-black uppercase tracking-wide leading-none">
                PT. INDUSTRI NABATI LESTARI
              </h1>
              <p className="text-green-700 font-bold italic text-[8px] sm:text-xs tracking-widest mt-1 sm:mt-1.5">
                PALM OIL REFINERY & FRACTIONATION
              </p>
            </div>

            {/* Right side: Subsidiary Logos */}
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-[10px] font-bold text-gray-800 mb-1">SUBSIDIARY OF :</p>
              <div className="flex gap-1.5 items-center">
                 <div className="h-7 w-[56px] relative">
                    <Image src="/Picture1.png" alt="Logo INL" fill className="object-contain" priority />
                 </div>
                 <div className="h-7 w-[72px] relative">
                    <Image src="/Logo_Holding_Perkebunan_Nusantara_III.png" alt="Logo Holding Perkebunan Nusantara" fill className="object-contain" priority />
                 </div>
                 <div className="h-7 w-[34px] relative">
                    <Image src="/Logo_PTPN_IV.png" alt="Logo PTPN IV" fill className="object-contain" priority />
                 </div>
              </div>
            </div>
          </div>

          {/* Center Titles */}
          <div className="text-center">
            <h2 className="text-xs sm:text-xl md:text-3xl font-black uppercase tracking-wider leading-none text-[#1976D2]">
              INFORMASI KESELAMATAN KERJA
            </h2>
            <h3 className="text-[9px] sm:text-sm md:text-base font-bold uppercase tracking-widest mt-0.5 sm:mt-1 text-[#0D47A1]">
              HSE PERFORMANCE BOARD
            </h3>
          </div>
        </div>

        {/* BLUE MAIN SECTION */}
        <div className="bg-[#1E88E5] text-white flex-1 p-2 sm:p-4 flex flex-col justify-between">
          
          {/* SAFETY STATUS ROW (TOP BLUE BAR) */}
          <div className="border-b-2 border-white/40 pb-2 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-base sm:text-2.5xl font-bold uppercase tracking-widest text-center sm:text-left">
              SAFETY STATUS
            </div>
            
            <div className="flex items-center justify-center gap-4 sm:gap-12">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="text-right text-[8px] sm:text-xs font-bold uppercase leading-tight">
                  <p>BULAN</p>
                  <p className="opacity-80">MONTHLY</p>
                </div>
                {renderYellowBlocks(stats.board_month)}
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="text-right text-[8px] sm:text-xs font-bold uppercase leading-tight">
                  <p>TAHUN</p>
                  <p className="opacity-80">YEAR</p>
                </div>
                {renderYellowBlocks(stats.board_year)}
              </div>
            </div>
          </div>

          {/* MAIN GRID - 3 COLUMNS */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-y-4 lg:gap-x-8 lg:gap-y-4 items-center w-full my-auto">
            
            {/* HEADERS ROW (Desktop Only) */}
            <div className="hidden lg:block"></div> {/* Empty top-left */}
            <div className="text-center text-xs font-bold uppercase leading-tight hidden lg:block">
              <p>BULAN KEMARIN</p>
              <p className="opacity-90">LAST MONTH</p>
            </div>
            <div className="text-center text-xs font-bold uppercase leading-tight hidden lg:block">
              <p>BULAN INI</p>
              <p className="opacity-90">THIS MONTH</p>
            </div>

            {/* ROW 1: TOTAL WORKING DAYS */}
            <div className="col-span-1 lg:col-span-3 lg:contents border-b border-white/20 pb-3 lg:pb-0">
              <div className="text-[10px] sm:text-xs md:text-sm font-bold uppercase leading-tight mb-2 lg:mb-0">
                <p>JUMLAH HARI KERJA SAMPAI HARI INI</p>
                <p className="font-normal opacity-85 text-[8px] sm:text-xs">TOTAL WORKING DAYS UP TO DATE</p>
              </div>
              <div className="flex items-center justify-between lg:contents w-full">
                <div className="flex flex-col items-center lg:items-stretch">
                  <span className="lg:hidden text-[7px] font-bold opacity-80 mb-1">BULAN KEMARIN</span>
                  {renderYellowBlocks(stats.working_days.last_month)}
                </div>
                <div className="flex flex-col items-center lg:items-stretch">
                  <span className="lg:hidden text-[7px] font-bold opacity-80 mb-1">BULAN INI</span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    {renderYellowBlocks(stats.working_days.this_month)}
                    <div className="text-[8px] sm:text-xs font-bold uppercase leading-none shrink-0">
                      <p>HARI</p>
                      <p className="opacity-80">DAY</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: TOTAL MANHOURS */}
            <div className="col-span-1 lg:col-span-3 lg:contents border-b border-white/20 pb-3 lg:pb-0">
              <div className="text-[10px] sm:text-xs md:text-sm font-bold uppercase leading-tight mb-2 lg:mb-0">
                <p>JUMLAH JAM KERJA TANPA KECELAKAAN</p>
                <p className="font-normal opacity-85 text-[8px] sm:text-xs">TOTAL MANHOURS WORKED WITHOUT LOSE ACCIDENT</p>
              </div>
              <div className="flex items-center justify-between lg:contents w-full">
                <div className="flex flex-col items-center lg:items-stretch">
                  <span className="lg:hidden text-[7px] font-bold opacity-80 mb-1">BULAN KEMARIN</span>
                  {renderYellowBlocks(stats.safe_manhours.last_month)}
                </div>
                <div className="flex flex-col items-center lg:items-stretch">
                  <span className="lg:hidden text-[7px] font-bold opacity-80 mb-1">BULAN INI</span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    {renderYellowBlocks(stats.safe_manhours.this_month)}
                    <div className="text-[8px] sm:text-xs font-bold uppercase leading-none shrink-0">
                      <p>JAM</p>
                      <p className="opacity-80">HOURS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 3: TOTAL SAFE WORKED DAYS */}
            <div className="col-span-1 lg:col-span-3 lg:contents border-b border-white/20 pb-3 lg:pb-0">
              <div className="text-[10px] sm:text-xs md:text-sm font-bold uppercase leading-tight mb-2 lg:mb-0">
                <p>JUMLAH JAM KERJA SELAMAT</p>
                <p className="font-normal opacity-85 text-[8px] sm:text-xs">TOTAL SAFE WORKED DAYS</p>
              </div>
              <div className="flex items-center justify-between lg:contents w-full">
                <div className="flex flex-col items-center lg:items-stretch">
                  <span className="lg:hidden text-[7px] font-bold opacity-80 mb-1">BULAN KEMARIN</span>
                  {renderYellowBlocks(stats.safe_manhours.last_month)}
                </div>
                <div className="flex flex-col items-center lg:items-stretch">
                  <span className="lg:hidden text-[7px] font-bold opacity-80 mb-1">BULAN INI</span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    {renderYellowBlocks(stats.safe_manhours.this_month)}
                    <div className="text-[8px] sm:text-xs font-bold uppercase leading-none shrink-0">
                      <p>JAM</p>
                      <p className="opacity-80">HOURS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM OF BLUE SECTION: LAST ACCIDENT, RECAP & DATE */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mt-3">
            
            {/* Left section: Last Accident & Recap */}
            <div className="flex flex-col gap-2.5 w-full md:w-auto">
              {/* Last Accident Row */}
              <div className="flex items-center justify-between gap-2 w-full md:w-auto">
                <div className="text-[9px] sm:text-xs font-bold uppercase leading-tight w-36 sm:w-52 md:w-56 shrink-0">
                  <p>KECELAKAAN TERAKHIR</p>
                  <p className="font-normal opacity-85 text-[7px] sm:text-[10px]">LAST ACCIDENT</p>
                </div>
                <div className="bg-white text-black font-bold text-xs sm:text-base md:text-lg px-2 sm:px-6 py-1 flex-1 md:w-64 text-center rounded-sm shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]">
                   {stats.last_accident !== '-' ? stats.last_accident : ''}
                </div>
              </div>

              {/* Recap Row */}
              <div className="flex items-center justify-between gap-2 w-full md:w-auto">
                <div className="text-[9px] sm:text-xs font-bold uppercase leading-tight w-36 sm:w-52 md:w-56 shrink-0">
                  <p>REKAPAN JAM KERJA SELAMAT (2018-2025)</p>
                  <p className="font-normal opacity-85 text-[7px] sm:text-[10px]">SAFE MANHOURS RECAP (2018-2025)</p>
                </div>
                <div className="bg-white text-black font-bold text-xs sm:text-base md:text-lg px-2 sm:px-6 py-1 flex-1 md:w-64 text-center rounded-sm shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]">
                   {stats.safe_manhours_recap || '0'}
                </div>
              </div>
            </div>

            {/* Date Section */}
            <div className="flex items-center justify-between w-full md:w-auto gap-2 md:self-end sm:ml-auto">
               <div className="text-left md:text-center text-[9px] sm:text-xs font-bold uppercase leading-tight w-16 sm:w-auto shrink-0">
                 <p>TANGGAL</p>
                 <p className="opacity-85 text-[7px] sm:text-[10px]">DATE</p>
               </div>
               <div className="bg-white text-black font-bold text-xs sm:text-base md:text-lg px-2 sm:px-6 py-1 w-28 sm:w-40 md:w-48 text-center rounded-sm shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]">
                  {stats.current_datetime.date}
               </div>
            </div>
          </div>
        </div>

        {/* BOTTOM LIGHT BLUE STRIPS */}
        <div className="bg-[#4FC3F7] border-t border-b border-white text-[#0D47A1] grid grid-cols-3 text-center py-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-widest">
           <div>INTEGRITY</div>
           <div>NOTHING IMPOSSIBLE</div>
           <div>LEADERSHIP</div>
        </div>

        {/* BOTTOM DARKER STRIP */}
        <div className="bg-[#29B6F6] text-white text-center py-2 flex flex-col items-center px-2">
           <p className="font-bold text-[9px] sm:text-sm uppercase tracking-widest text-center">KESELAMATAN ADALAH TANGGUNG JAWAB SEMUA ORANG</p>
           <p className="font-semibold text-[7px] sm:text-xs uppercase tracking-widest opacity-90 text-center mt-0.5">SAFETY IS EVERYONE&apos;S RESPONSIBILITY</p>
        </div>

      </div>
    </div>
  );
}
