# Lifesevatra Frontend

> Hospital management dashboard built with React, TypeScript, and Tailwind CSS

## Quick Start

```bash
npm install
npm run dev
```

## Tech Stack

- **React 19** with **TypeScript 5.9**
- **Tailwind CSS 4.1**
- **Vite 7.3**
- **React Router DOM**

## Project Structure

```
src/
├── components/
│   ├── assets/              # Static assets (images)
│   ├── dashboard/           # Dashboard UI components
│   │   ├── BedStatus.tsx
│   │   ├── PatientDetailModal.tsx
│   │   ├── PatientTable.tsx
│   │   └── StatsCards.tsx
│   └── layout/
│       └── DashboardLayout.tsx
├── data/
│   └── sampleData.ts        # Hospital, patient, staff, and bed data
├── pages/
│   ├── auth/                # Login & Register
│   └── dashboard/           # Overview, Admissions, Staff
├── services/                # Admission & Staff services
├── types/                   # TypeScript type definitions
└── utils/                   # Data transformers
```

## Features

- Patient admissions with automatic severity scoring
- Real-time bed occupancy across ICU / HDU / General wards
- Staff management with duty status tracking
- Dark / Light theme toggle
- Responsive, mobile-first design

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server at http://localhost:5173 |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type-check |

## License

ISC

