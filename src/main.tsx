import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes } from "react-router";
import ScrollTop from "./components/ScrollTop.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { Toaster } from "./components/ui/sonner.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <ScrollTop />
        <Provider store={store}>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
          <Toaster />
        </Provider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
