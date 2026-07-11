# AiraSpark

AiraSpark is a Vite + React + TypeScript website for AiraSpark Technologies. It presents the company brand, services, leadership team, technology focus, future vision, and contact flow in a responsive single-page experience.

## Tech Stack

- React 19
- TypeScript
- Vite
- Express
- Tailwind CSS v4
- Motion
- Lenis
- Lucide React

## Features

- Modern single-page marketing site with anchored sections
- Responsive layout tuned for desktop and mobile browsers
- Smooth scrolling with fixed-header offset handling
- Leadership, solutions, technology showcase, and future vision sections
- Contact form wired to the Node/Express backend
- Shared theme and glass-style UI treatments

## Getting Started

Install dependencies:

```bash
npm install
```

Run the frontend and backend together:

```bash
npm run dev
```

The app runs with the frontend on port 3000 and the backend on port 5001.

## Scripts

- `npm run dev` - Start frontend and backend together
- `npm run dev:frontend` - Start the Vite frontend only
- `npm run dev:backend` - Start the Express backend only
- `npm run build` - Build the production bundle
- `npm run preview` - Preview the production build locally
- `npm run lint` - Type-check the project
- `npm run clean` - Remove build output

## Environment

Create a `.env` file with the backend port if needed:

```bash
PORT=5001
```

## Project Structure

```text
server/
	index.js
src/
	App.tsx
	index.css
	main.tsx
	types.ts
	components/
		About.tsx
		Contact.tsx
		Footer.tsx
		FutureVision.tsx
		Hero.tsx
		Leadership.tsx
		Navbar.tsx
		Solutions.tsx
		TechShowcase.tsx
```

## Notes

- The React entry point is `src/main.tsx`.
- The Vite proxy targets the backend port defined in `.env`.
- The site is configured for AiraSpark branding and content.