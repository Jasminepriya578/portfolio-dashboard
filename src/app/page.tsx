"use client";
import React, { useState } from "react";
import PortfolioTable from "./PortfolioTable";
import SectorPieChart from "./components/SectorPieCharts";
import { Stock } from "./types"; 

const Page = () => {
  const [rows, setRows] = useState<Stock[]>([]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Portfolio Dashboard</h1>
      <PortfolioTable rows={rows} setRows={setRows} />
      <SectorPieChart rows={rows} />
    </main>
  );
};

export default Page;
