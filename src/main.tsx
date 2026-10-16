import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { removeStaticHead } from "./lib/seo";
import "./index.css";

// El <head> estático de index.html queda para rastreadores sin JS; en el navegador
// cada ruta pasa a tener una sola fuente de metadatos (Helmet).
removeStaticHead(document);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
