# Lifesevatra

> Modern healthcare management dashboard for hospitals

### This project is under active development

## Overview

Lifesevatra is a hospital management dashboard designed to streamline patient intake, manage bed availability in real-time, and coordinate staff across wards.

## Project Structure

```
lifesevatra/
└── Frontend/          # React + TypeScript + Tailwind CSS
```

## Getting Started

```bash
cd Frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to view the application.

## Features

- **Hospital Registration** — Onboard hospitals with bed capacity management
- **Staff Management** — Add, edit, and track doctors and nurses
- **Patient Admissions** — Record vitals, auto-assign beds by severity
- **Bed Allocation** — Real-time ICU / HDU / General ward occupancy
- **Severity Scoring** — Automatic triage based on vital signs
- **Dark / Light Mode** — Theme toggle with persistent preference
- **Responsive Design** — Mobile-first, works on all screen sizes

## Tech Stack

- **React 19** + **TypeScript 5.9**
- **Tailwind CSS 4.1**
- **Vite 7.3**
- **React Router DOM**

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type-check |

## License

ISC

