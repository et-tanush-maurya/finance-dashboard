# Finance Dashboard

A comprehensive finance dashboard for tracking revenue, clients, and generating automated reports.

## Features

- **Dashboard**: Overview of revenue analytics with interactive charts
- **Client Management**: Manage clients with detailed profiles and transaction history
- **Sector Analytics**: Analyze performance across different business sectors
- **User Management**: Manage user access and permissions
- **Report Automation**: Schedule and generate automated reports
- **Report History**: View and audit historical reports
- **Split Ratio Configuration**: Configure revenue split ratios

## Tech Stack

- **React 18** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Router** - Navigation
- **Radix UI** - Component primitives
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Running the app

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for production

```bash
npm run build
```

The build output will be in the `dist` folder.

### Preview production build

```bash
npm run preview
```

## Deployment

This project is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy.

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
│   ├── charts/     # Chart components
│   ├── common/     # Common UI components
│   ├── data/       # Mock data
│   ├── ui/         # Shadcn UI components
│   └── utils/      # Utility functions
├── contexts/        # React contexts
├── pages/          # Page components
└── hooks/          # Custom hooks
```

## License

Private - All rights reserved
