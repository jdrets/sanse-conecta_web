import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import MuiProvider from "./providers/MuiProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "./components";
import SplashScreen from "./components/SplashScreen";

const queryClient = new QueryClient();

createInertiaApp({
  title: title => `${title} - App Consultora Industrial`,
  resolve: name =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob("./Pages/**/*.tsx")
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(
      <MuiProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <App {...props} />
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  backgroundColor: "#181c24",
                  color: "#ffffff",
                  border: `1px solid #111827`,
                  padding: "16px",
                },
                error: {
                  style: {
                    backgroundColor: "#B71D18",
                    color: "#ffffff",
                  },
                },
                success: {
                  style: {
                    backgroundColor: "#36B37E",
                    color: "#ffffff",
                  },
                },
              }}
            />
            <SplashScreen />
          </QueryClientProvider>
        </ErrorBoundary>
      </MuiProvider>
    );
  },
});
