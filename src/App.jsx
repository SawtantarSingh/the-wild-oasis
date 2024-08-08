import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // react-query

import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // react-query-devtools

import Toaster from "react-hot-toast";

import AppLayout from "./ui/AppLayout";
import GlobalStyles from "./styles/GlobalStyles";

import Dashboard from "./pages/Dashboard"; // Import Dashboard Pages
import Cabins from "./pages/Cabins"; // Import Cabins Pages
import Users from "./pages/Users"; // Import Users Pages
import Settings from "./pages/Settings"; // Import Settings Pages
import Login from "./pages/Login"; // Import Login Pages
import Bookings from "./pages/Bookings"; // Import Bookings PAges
import PageNotFound from "./pages/PageNotFound"; // Import PageNotFound
import Account from "./pages/Account"; // Import PageNotFound
import Booking from "./pages/Booking";
import Checkin from "./pages/Checkin";
import ProtectedRoute from "./ui/ProtectedRoute";
import { DarkModeProvider } from "./context/DarkModeContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />

              <Route path="account" element={<Account />} />

              <Route path="cabins" element={<Cabins />} />

              <Route path="users" element={<Users />} />

              <Route path="bookings" element={<Bookings />} />
              <Route path="bookings/:bookingId" element={<Booking />} />

              <Route path="checkin/:bookingId" element={<Checkin />} />

              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ marging: "8px" }}
          toastOption={{
            success: { duration: 3000 },
            error: { duration: 5000 },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backGroundColor: "var(--color-grey-0)",
              color: "var(--color-grey-700)",
            },
          }}
        />
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
