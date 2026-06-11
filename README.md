airaspark-core/
│
├── node_modules/              # All downloaded npm packages (ignored by Git)
│
├── server/                    # 🟢 NEW: Your Node.js Backend
│   └── index.js               # Main Express server file (Handles API & Forms)
│
├── src/                       # ⚛️ Your React Frontend
│   ├── assets/                # Static images and branding
│   │   ├── airaspark-logo.png 
│   │   ├── ceo.jpg
│   │   ├── cio.jpg
│   │   ├── cmo.jpg
│   │   ├── coo.jpg
│   │   └── cto.jpg
│   │
│   ├── components/            # UI Building Blocks
│   │   ├── About.tsx
│   │   ├── Contact.tsx        # Now connected to server/index.js
│   │   ├── Footer.tsx
│   │   ├── FutureVision.tsx
│   │   ├── Hero.tsx           # Contains the optimized Canvas animation
│   │   ├── Leadership.tsx
│   │   ├── Navbar.tsx
│   │   ├── Solutions.tsx
│   │   └── TechShowcase.tsx
│   │
│   ├── App.tsx                # Master Layout (Controls Smooth Scrolling)
│   ├── index.css              # Global styling, Enterprise Glassmorphism, Tailwind
│   ├── main.tsx               # The React app entry point
│   ├── types.ts               # TypeScript data structures
│   └── vite-env.d.ts          # Vite TypeScript definitions
│
├── .env                       # 🔒 NEW: Secret variables like PORT (ignored by Git)
├── .gitignore                 # 🔒 NEW: Tells Git which files to hide/ignore
├── index.html                 # The root HTML file that loads your React app
├── package-lock.json          # Locks exact versions of your npm packages
├── package.json               # ⚙️ Master config (Dependencies & "npm run dev" script)
├── tsconfig.json              # TypeScript compiler rules
└── vite.config.ts             # ⚙️ Vite config (Includes the Proxy to route to Node.js)