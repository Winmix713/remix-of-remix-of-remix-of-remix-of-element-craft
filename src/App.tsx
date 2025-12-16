import { memo, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

// ==================== CONFIGURATION ====================
const QUERY_CLIENT_CONFIG = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
} as const;

const TOOLTIP_CONFIG = {
  delayDuration: 300,
  skipDelayDuration: 0,
} as const;

// ==================== QUERY CLIENT ====================
const queryClient = new QueryClient(QUERY_CLIENT_CONFIG);

// ==================== ROUTE CONFIGURATION ====================
interface RouteConfig {
  path: string;
  element: JSX.Element;
  protected?: boolean;
}

const routes: RouteConfig[] = [
  {
    path: "/",
    element: <Index />,
  },
  // ADD MORE ROUTES HERE
  // {
  //   path: "/about",
  //   element: <About />,
  // },
  // {
  //   path: "/dashboard",
  //   element: <Dashboard />,
  //   protected: true,
  // },
];

// ==================== ROUTE LOADING FALLBACK ====================
const RouteLoadingFallback = memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
));

RouteLoadingFallback.displayName = "RouteLoadingFallback";

// ==================== PROTECTED ROUTE WRAPPER ====================
interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = memo<ProtectedRouteProps>(({ children }) => {
  // TODO: Implement authentication check
  const isAuthenticated = true; // Replace with actual auth check

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
});

ProtectedRoute.displayName = "ProtectedRoute";

// ==================== APP PROVIDERS ====================
interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders = memo<AppProvidersProps>(({ children }) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider {...TOOLTIP_CONFIG}>
      {children}
      <Toaster />
      <Sonner />
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </TooltipProvider>
  </QueryClientProvider>
));

AppProviders.displayName = "AppProviders";

// ==================== APP ROUTES ====================
const AppRoutes = memo(() => (
  <Routes>
    {routes.map(({ path, element, protected: isProtected }) => (
      <Route
        key={path}
        path={path}
        element={
          <Suspense fallback={<RouteLoadingFallback />}>
            {isProtected ? <ProtectedRoute>{element}</ProtectedRoute> : element}
          </Suspense>
        }
      />
    ))}

    {/* 404 - Must be last */}
    <Route
      path="*"
      element={
        <Suspense fallback={<RouteLoadingFallback />}>
          <NotFound />
        </Suspense>
      }
    />
  </Routes>
));

AppRoutes.displayName = "AppRoutes";

// ==================== MAIN APP COMPONENT ====================
const App = memo(() => (
  <AppProviders>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AppProviders>
));

App.displayName = "App";

export default App;

// ==================== PERFORMANCE MONITORING (OPTIONAL) ====================
if (process.env.NODE_ENV === "development") {
  // Web Vitals monitoring
  import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}
