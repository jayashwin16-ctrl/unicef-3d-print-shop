import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { SitePreferencesProvider } from "./context/SitePreferencesContext";
import SiteShell from "./components/advanced/SiteShell";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SitePreferencesProvider>
        <CartProvider>
          <SiteShell>
            <App />
          </SiteShell>
        </CartProvider>
      </SitePreferencesProvider>
    </BrowserRouter>
  </StrictMode>
);
