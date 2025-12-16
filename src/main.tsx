// ==================== main.tsx ====================
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Error boundary for production
import { ErrorBoundary } from "react-error-boundary";

// Lazy load App for code splitting
const App = lazy(() => import("./App"));

// ==================== ERROR FALLBACK ====================
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <div className="max-w-md w-full space-y-4 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred while loading the application.
        </p>
      </div>
      
      {process.env.NODE_ENV === "development" && (
        <pre className="text-left bg-secondary p-4 rounded-lg text-xs overflow-auto">
          {error.message}
        </pre>
      )}
      
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
);

// ==================== LOADING FALLBACK ====================
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="space-y-4 text-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-sm text-muted-foreground">Loading application...</p>
    </div>
  </div>
);

// ==================== ERROR HANDLER ====================
const handleError = (error: Error, errorInfo: { componentStack: string }) => {
  // Log to error reporting service in production
  if (process.env.NODE_ENV === "production") {
    console.error("Application Error:", error, errorInfo);
    // TODO: Send to error tracking service (e.g., Sentry)
  } else {
    console.error("Application Error:", error);
    console.error("Component Stack:", errorInfo.componentStack);
  }
};

// ==================== ROOT RENDERING ====================
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Please ensure index.html contains a div with id='root'");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);
