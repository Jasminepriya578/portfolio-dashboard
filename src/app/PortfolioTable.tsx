"use client";

import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { fetchStockData } from "../services/getStockData";
import { Stock } from "./types"; 
import toast from "react-hot-toast";

interface Props {
  rows: Stock[];
  setRows: React.Dispatch<React.SetStateAction<Stock[]>>;
}

const initialStocks = [
  { stock: "HDFCBANK.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "BAJFINANCE.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "ICICIBANK.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "BAJAJHLDNG.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "AFFLE.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "LTIM.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "KPITTECH.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "TATATECH.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "BLS.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "TANLA.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "DMART.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "TATACONSUM.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "PIDILITIND.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "TATAPOWER.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "KPIGREEN.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "SUZLON.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "GENSOL.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "HARIOMPIPE.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "ASTRAL.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "POLYCAB.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "CLEAN.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "DEEPAKNTR.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "FINEORG.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "GRAVITA.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "SBILIFE.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "INFY.NS", purchasePrice: 1000, quantity: 10 },
  { stock: "EASEMYTRIP.NS", purchasePrice: 1000, quantity: 10 },
];

const getSectorForStock = (stock: string): string | null => {
  const sectorMap: Record<string, string> = {
    "BAJFINANCE.NS": "Financial",
    "ICICIBANK.NS": "Financial",
    "BAJAJHLDNG.NS": "Financial",
    "AFFLE.NS": "Tech",
    "LTIM.NS": "Tech",
    "KPITTECH.NS": "Tech",
    "TATATECH.NS": "Tech",
    "BLS.NS": "Tech",
    "DMART.NS": "Consumer",
    "TATACONSUM.NS": "Consumer",
    "PIDILITIND.NS": "Consumer",
    "TATAPOWER.NS": "Power",
    "KPIGREEN.NS": "Power",
    "SUZLON.NS": "Power",
    "GENSOL.NS": "Power",
    "HARIOMPIPE.NS": "Infrastructure",
    "ASTRAL.NS": "Infrastructure",
    "POLYCAB.NS": "Infrastructure",
    "CLEAN.NS": "Others",
    "DEEPAKNTR.NS": "Others",
    "FINEORG.NS": "Others",
    "GRAVITA.NS": "Others",
    "SBILIFE.NS": "Others",
    "INFY.NS": "Tech",
    "EASEMYTRIP.NS": "Tech",
  };


  return sectorMap[stock] || "Unknown";
};

const getSectorIcon = (sector: string): string => {
  const iconMap: Record<string, string> = {
    "Financial": "🏦",
    "Tech": "💻",
    "Consumer": "🛒",
    "Power": "⚡",
    "Infrastructure": "🏗️",
    "Others": "📊",
  };
  return iconMap[sector] || "📈";
};

const getSectorColor = (sector: string): string => {
  const colorMap: Record<string, string> = {
    "Financial": "bg-blue-50 border-blue-200",
    "Tech": "bg-purple-50 border-purple-200",
    "Consumer": "bg-green-50 border-green-200",
    "Power": "bg-yellow-50 border-yellow-200",
    "Infrastructure": "bg-orange-50 border-orange-200",
    "Others": "bg-gray-50 border-gray-200",
  };
  return colorMap[sector] || "bg-gray-50 border-gray-200";
};

const PortfolioTable: React.FC<Props> = ({ rows, setRows }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(15);

  useEffect(() => {
    const fetchData = async (isInitialLoad = false) => {
      try {
        setError(null);
        if (isInitialLoad) {
          setLoading(true);
        } else {
          setIsRefreshing(true);
        }

        const fetchedData = await Promise.all(
          initialStocks.map(async (stock, index) => {
            const sector = getSectorForStock(stock.stock);
            const { cmp, peRatio, latestEarnings } = await fetchStockData(stock.stock);
            const investment = stock.purchasePrice * stock.quantity;
            const presentValue = cmp * stock.quantity;
            const gainLoss = presentValue - investment;

            return {
              id: index + 1,
              stock: stock.stock,
              sector,
              purchasePrice: stock.purchasePrice,
              quantity: stock.quantity,
              cmp,
              investment,
              presentValue,
              gainLoss,
              PE: peRatio,
              latestEarnings,
              portfolioPercentage: "",
            };
          })
        );
        const totalPresentValue = fetchedData.reduce((sum, s) => sum + s.presentValue, 0);
        const stocksWithPercentage = fetchedData.map((s) => ({
          ...s,
          portfolioPercentage:
            totalPresentValue > 0
              ? ((s.presentValue / totalPresentValue) * 100).toFixed(2) + "%"
              : "0.00%",
        }));

        setRows(stocksWithPercentage);
        setLastUpdated(new Date());
        setCountdown(15); 
    
        if (!isInitialLoad && !error) {
          toast.success("Portfolio updated successfully!");
        }
      } catch (err) {
        const message = "Failed to load portfolio data. Please try again later.";
        setError(message);
        toast.error(message);
        console.error(err);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchData(true);
    const dataInterval = setInterval(() => fetchData(false), 15000);
const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return 15; 
        }
        return prev - 1;
      });
    }, 1000); 

    return () => {
      clearInterval(dataInterval);
      clearInterval(countdownInterval);
    };
  }, [setRows]);


  const grouped = rows.reduce((acc, row) => {
    const sector = row.sector || "Unknown";
    if (!acc[sector]) {
      acc[sector] = {
        sector,
        totalInvestment: 0,
        totalPresentValue: 0,
        totalGainLoss: 0,
        stocks: [],
      };
    }
    acc[sector].stocks.push(row);
    acc[sector].totalInvestment += row.investment;
    acc[sector].totalPresentValue += row.presentValue;
    acc[sector].totalGainLoss += row.gainLoss;
    return acc;
  }, {} as Record<
    string,
    {
      sector: string;
      totalInvestment: number;
      totalPresentValue: number;
      totalGainLoss: number;
      stocks: Stock[];
    }
  >);

  const overallStats = Object.values(grouped).reduce(
    (acc, group) => ({
      totalInvestment: acc.totalInvestment + group.totalInvestment,
      totalPresentValue: acc.totalPresentValue + group.totalPresentValue,
      totalGainLoss: acc.totalGainLoss + group.totalGainLoss,
    }),
    { totalInvestment: 0, totalPresentValue: 0, totalGainLoss: 0 }
  );

  const overallReturn = overallStats.totalInvestment > 0 
    ? ((overallStats.totalGainLoss / overallStats.totalInvestment) * 100).toFixed(2) 
    : "0.00";

  const columns: GridColDef[] = [
    { 
      field: "stock", 
      headerName: "Stock", 
      width: 150,
      renderCell: (params) => (
        <div className="font-semibold text-gray-800">
          {params.value.replace('.NS', '')}
        </div>
      )
    },
    { 
      field: "purchasePrice", 
      headerName: "Buy ₹", 
      width: 100,
      renderCell: (params) => (
        <span className="text-gray-600">₹{params.value}</span>
      )
    },
    { field: "quantity", headerName: "Qty", width: 70 },
    { 
      field: "cmp", 
      headerName: "CMP ₹", 
      width: 100,
      renderCell: (params) => (
        <span className={`font-medium transition-all duration-500 ${
          isRefreshing ? 'animate-pulse bg-yellow-100 px-2 py-1 rounded' : ''
        }`}>
          ₹{params.value?.toFixed(2) || 'N/A'}
        </span>
      )
    },
    { 
      field: "investment", 
      headerName: "Investment", 
      width: 130,
      renderCell: (params) => (
        <span className="text-blue-700 font-medium">₹{params.value.toLocaleString('en-IN')}</span>
      )
    },
    { 
      field: "presentValue", 
      headerName: "Present Value", 
      width: 140,
      renderCell: (params) => (
        <span className={`text-indigo-700 font-medium transition-all duration-500 ${
          isRefreshing ? 'animate-pulse bg-yellow-100 px-2 py-1 rounded' : ''
        }`}>
          ₹{params.value.toLocaleString('en-IN')}
        </span>
      )
    },
    {
      field: "gainLoss",
      headerName: "Gain/Loss",
      width: 120,
      renderCell: (params) => {
        const isProfit = params.value > 0;
        return (
          <div className={`flex items-center font-semibold ${
            isProfit ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="mr-1">{isProfit ? '↗️' : '↘️'}</span>
            ₹{Math.abs(params.value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        );
      },
    },
    { 
      field: "PE", 
      headerName: "P/E", 
      width: 80,
      renderCell: (params) => (
        <span className="text-gray-700">{params.value || 'N/A'}</span>
      )
    },
    { 
      field: "latestEarnings", 
      headerName: "Earnings", 
      width: 110,
      renderCell: (params) => (
        <span className="text-purple-700">₹{params.value || 'N/A'}</span>
      )
    },
    { 
      field: "portfolioPercentage", 
      headerName: "Portfolio %", 
      width: 120,
      renderCell: (params) => (
        <div className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
          {params.value}
        </div>
      )
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-blue-700 font-medium">Loading your portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8">
        <div className="text-red-600 text-4xl mb-4">⚠️</div>
        <h3 className="text-red-800 font-semibold text-lg mb-2">Something went wrong</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen p-6">
      {/* Header with overall stats */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            📊 Portfolio Dashboard
            {isRefreshing && (
              <div className="ml-3 flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm font-medium">Updating...</span>
              </div>
            )}
          </h1>
          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium">
                Next update in {countdown}s
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-md">
            <p className="text-blue-100 text-sm font-medium">Total Investment</p>
            <p className="text-2xl font-bold">₹{overallStats.totalInvestment.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-xl shadow-md">
            <p className="text-indigo-100 text-sm font-medium">Present Value</p>
            <p className="text-2xl font-bold">₹{overallStats.totalPresentValue.toLocaleString('en-IN')}</p>
          </div>
          <div className={`p-4 rounded-xl shadow-md text-white ${
            overallStats.totalGainLoss >= 0 
              ? 'bg-gradient-to-r from-green-500 to-green-600' 
              : 'bg-gradient-to-r from-red-500 to-red-600'
          }`}>
            <p className={`text-sm font-medium ${
              overallStats.totalGainLoss >= 0 ? 'text-green-100' : 'text-red-100'
            }`}>
              Total {overallStats.totalGainLoss >= 0 ? 'Gain' : 'Loss'}
            </p>
            <p className="text-2xl font-bold flex items-center">
              {overallStats.totalGainLoss >= 0 ? '↗️' : '↘️'}
              ₹{Math.abs(overallStats.totalGainLoss).toLocaleString('en-IN')}
            </p>
          </div>
          <div className={`p-4 rounded-xl shadow-md text-white ${
            parseFloat(overallReturn) >= 0 
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
              : 'bg-gradient-to-r from-orange-500 to-orange-600'
          }`}>
            <p className={`text-sm font-medium ${
              parseFloat(overallReturn) >= 0 ? 'text-emerald-100' : 'text-orange-100'
            }`}>
              Overall Return
            </p>
            <p className="text-2xl font-bold">{overallReturn}%</p>
          </div>
        </div>
      </div>

    
      {Object.values(grouped).map((group) => (
        <div key={group.sector} className={`rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${getSectorColor(group.sector)}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="text-3xl mr-3">{getSectorIcon(group.sector)}</span>
                {group.sector} Sector
                <span className="ml-3 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-600">
                  {group.stocks.length} stocks
                </span>
              </h2>
            </div>

            <div style={{ height: 500, width: "100%" }} className="mb-6 bg-white rounded-xl overflow-hidden shadow-sm">
              <DataGrid 
                rows={group.stocks} 
                columns={columns}
                sx={{
                  '& .MuiDataGrid-root': {
                    border: 'none',
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f3f4f6',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f8fafc',
                    color: '#374151',
                    fontWeight: '600',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#f9fafb',
                  },
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-xl p-4 shadow-sm">
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Sector Investment</p>
                <p className="text-xl font-bold text-blue-600">₹{group.totalInvestment.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Current Value</p>
                <p className="text-xl font-bold text-indigo-600">₹{group.totalPresentValue.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Sector {group.totalGainLoss >= 0 ? 'Gain' : 'Loss'}</p>
                <p className={`text-xl font-bold flex items-center justify-center ${
                  group.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className="mr-1">{group.totalGainLoss >= 0 ? '↗️' : '↘️'}</span>
                  ₹{Math.abs(group.totalGainLoss).toLocaleString('en-IN')}
                  <span className="ml-2 text-sm">
                    ({group.totalInvestment > 0 ? 
                      ((group.totalGainLoss / group.totalInvestment) * 100).toFixed(2) : '0.00'}%)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioTable;