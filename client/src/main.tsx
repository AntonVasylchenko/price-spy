import "../src/assets/fonts.css"
import "../src/assets/reset.css"
import { createRoot } from 'react-dom/client'
import './locales.ts';

import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";

createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)

