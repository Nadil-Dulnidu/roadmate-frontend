import { Navigate, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/home/HomePage";
import VehicleProfilePage from "./features/vehicle/pages/VehicleProfilePage";
import VehicleListPage from "./features/vehicle/pages/VehicleListPage";
import CheckoutPage from "./features/payment/pages/CheckoutPage";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import NotFoundPage from "./pages/NotFoundPage";
import RenterDashboard from "./pages/RenterDashboard";
import { ViewAllBookings } from "./features/booking/pages/ViewAllBookings";
import HostDashboard from "./pages/host-dashboard/HostDashboard";
import MyVehiclesPage from "./pages/host-dashboard/MyVehiclesPage";
import BookingPage from "./pages/host-dashboard/BookingPage";
import StaffDashboard from "./pages/staff-dashboard/StaffDashboard";
import AllVehiclesPage from "./pages/staff-dashboard/AllVehiclesPage";
import AllBookingsPage from "./pages/staff-dashboard/AllBookingsPage";
import CustomerPage from "./pages/staff-dashboard/CustomerPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="vehicle">
          <Route path="listing" element={<VehicleListPage />} />
          <Route path=":vehicleId" element={<VehicleProfilePage />} />
        </Route>
        <Route
          path="checkout/:checkoutId"
          element={
            <>
              <SignedIn>
                <CheckoutPage />
              </SignedIn>
              <SignedOut>
                <Navigate to="/auth/signup" replace />
              </SignedOut>
            </>
          }
        />
        <Route path="renter-dashboard">
          <Route
            index
            element={
              <>
                <SignedIn>
                  <RenterDashboard />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/auth/signup" replace />
                </SignedOut>
              </>
            }
          />
          <Route
            path="all-bookings"
            element={
              <>
                <SignedIn>
                  <ViewAllBookings />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/auth/signup" replace />
                </SignedOut>
              </>
            }
          />
        </Route>
        <Route path="/*" element={<NotFoundPage />} />
      </Route>
      <Route path="auth">
        <Route path="signup" element={<LoginPage />} />
      </Route>
      <Route path="host-dashboard">
        <Route
          index
          element={
            <>
              <SignedIn>
                <HostDashboard />
              </SignedIn>
              <SignedOut>
                <Navigate to="/auth/signup" replace />
              </SignedOut>
            </>
          }
        />
        <Route
          path="my-vehicles"
          element={
            <>
              <SignedIn>
                <MyVehiclesPage />
              </SignedIn>
              <SignedOut>
                <Navigate to="/auth/signup" replace />
              </SignedOut>
            </>
          }
        />
        <Route
          path="all-bookings"
          element={
            <>
              <SignedIn>
                <BookingPage />
              </SignedIn>
              <SignedOut>
                <Navigate to="/auth/signup" replace />
              </SignedOut>
            </>
          }
        />
      </Route>
      <Route path="staff-dashboard">
        <Route
          index
          element={
            <>
              <SignedIn>
                <StaffDashboard />
              </SignedIn>
              <SignedOut>
                <Navigate to="/auth/signup" replace />
              </SignedOut>
            </>
          }
        />
        <Route
          path="vehicles"
          element={
            <>
              <SignedIn>
                <AllVehiclesPage />
              </SignedIn>
              <SignedOut>
                <Navigate to="/auth/signup" replace />
              </SignedOut>
            </>
          }
        />
        <Route
          path="bookings"
          element={
            <>
              <SignedIn>
                <AllBookingsPage />
              </SignedIn>
              <SignedOut>
                <Navigate to="/auth/signup" replace />
              </SignedOut>
            </>
          }
        />
        <Route
          path="customers"
          element={
            <>
              <SignedIn>
                <CustomerPage/>
              </SignedIn>
              <SignedOut>
                <Navigate to="/auth/signup" replace />
              </SignedOut>
            </>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;