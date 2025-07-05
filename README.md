# LaunchGen Demo

A Next.js demo showcasing an AI-powered landing page generator in real-time.

## Features

- Real-time demo of AI-powered landing page generation
- Animated progress indicators
- Interactive preview of generated landing pages
- Lead collection simulation
- Analytics dashboard preview

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles with Tailwind
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Main page component
├── product-demo.tsx     # Main demo component
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── next.config.js       # Next.js configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint 