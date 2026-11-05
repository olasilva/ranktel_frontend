# Ranktel – Frontend (React + Vite + Tailwind + React Router)

    npm install
    npm run dev        # http://localhost:5173 (proxies /api to http://localhost:5000, start the backend too)
    npm run build      # outputs dist/

Pages: / (home), /clothing, /shoes, /bags, /accessories, /sale, /product/:slug.
When hosting dist/, rewrite all paths to index.html (single-page app fallback), e.g. Netlify `/* /index.html 200`, Vercel rewrites, or nginx `try_files $uri /index.html`.

Photos go in public/images (file names listed in the README.txt there). If the API is on another domain, set VITE_API_URL in .env.
Set VITE_INVENTORY_APP_URL to the Dranks inventory/staff frontend origin if it differs from https://dranks-frontend.vercel.app.
