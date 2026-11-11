# Ranktel – Frontend (React + Vite + Tailwind + React Router)

    npm install
    npm run dev        # http://localhost:5173 (proxies /api to http://localhost:5000, start the backend too)
    npm run build      # outputs dist/

Pages: / (home), /clothing, /shoes, /bags, /accessories, /sale, /product/:slug.
Vercel routes `/api/*` to the backend using `vercel.json` and serves all other paths from `index.html` for client-side routing. For other hosts, proxy `/api` to the backend and rewrite all app paths to `index.html` (e.g. Netlify `/* /index.html 200` or nginx `try_files $uri /index.html`).

Photos go in public/images (file names listed in the README.txt there). `VITE_API_URL` in `.env` sets the Vite development proxy target; production API requests use the same-origin `/api` route.
Set VITE_INVENTORY_APP_URL to the Dranks inventory/staff frontend origin if it differs from https://dranks-frontend.vercel.app.
