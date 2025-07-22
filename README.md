check everything correct # Stock Portfolio Tracker

A modern stock portfolio dashboard built with **Next.js**, featuring dynamic stock data visualization, sector-wise pie chart, and real-time metrics like CMP, P/E Ratio, and Latest Earnings. Stock data is fetched using Yahoo Finance scraping via yahooFinanceScraper.js.

---

## Features

- Real-time Stock Data (via Yahoo Finance)
-  P/E Ratio and Latest Earnings displayed
-  Sector-wise Pie Chart using Recharts
- Auto-refresh CMP using setInterval
-  Error handling with fallback messages
- Fast and responsive UI with Tailwind CSS

---

## Tech Stack

| Tech             | Usage                        |
|------------------|------------------------------|
| Next.js          | Frontend framework           |
| TypeScript       | Static typing                |
| Tailwind CSS     | UI styling                   |
| Yahoo Finance API| Stock data scraping          |
| Node.js + Express| Backend API (scraper)        |
| Recharts         | Pie chart visualizations     |

---

## Folder Structure
portfolio-dashboard/
├── yahooFinanceScraper.js # Scraper using Yahoo Finance
├── index.js # Express server entry
├── frontend/
│ └── src/app/
│ ├── page.tsx # Main page
│ ├── PortfolioTable.tsx # Table component
│ ├── ChartView.tsx # Pie chart view
│ ├── services/
│ │ └── getStockData.ts # API call logic
│ ├── types.ts # TypeScript types
│ └── components/ # UI components
└── README.md # Project documentation

 # Start the Development Servers
From the root directory
cd backened
node index.js
Eg  C:\Users\jasmi\portfolio-dashboard\backend> 

# Start Frontend (Next.js app)
Open a new terminal and run:

cd portfolio-dashboard
npm run dev
