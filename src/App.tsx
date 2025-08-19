import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/home/HomePage";
import VehicleProfilePage from "./features/vehicle/pages/VehicleProfilePage";
import VehicleListPage from "./features/vehicle/pages/VehicleListPage";
import CheckoutPage from "./features/payment/pages/CheckoutPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="vehicle">
          <Route path="listing" element={<VehicleListPage />} />
          <Route path=":vehicleId" element={<VehicleProfilePage />} />
        </Route>
        <Route path="checkout/:checkoutId" element={<CheckoutPage />} />
      </Route>
      <Route path="auth">
        <Route path="signup" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;
