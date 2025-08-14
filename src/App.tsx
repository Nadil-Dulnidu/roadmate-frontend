import { Route, Routes } from "react-router"
import Layout from "./components/Layout"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"

function App() {
  return (
   <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="auth">
        <Route path="signup" element={<LoginPage />} />
      </Route>
    </Routes>
  )
}

export default App
