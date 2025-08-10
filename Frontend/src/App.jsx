import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./components/Home";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import Layout from "./components/Layout";
import { FaSpinner } from "react-icons/fa";
import { lazy, Suspense } from "react";
const SavedCodes = lazy(() => import("./components/SavedCodes"));
const NavbarComponent = lazy(() => import("./components/Component_designs/NavbarComponent"));
const ButtonComponent = lazy(() => import("./components/Component_designs/ButtonComponent"));
const FormComponent = lazy(() => import("./components/Component_designs/FormComponent"));
const CardComponent = lazy(() => import("./components/Component_designs/CardComponent"));
const ModalComponent = lazy(() => import("./components/Component_designs/ModalComponent"));
const FlipComponent = lazy(() => import("./components/Animation_Designs/FlipComponent"));
const Books = lazy(() => import("./components/Animation_Designs/Books"));
const Feature = lazy(() => import("./components/Feature"));
import { ToastProvider } from "./components/ToastProvider";

function App() {
  return (
    <ToastProvider>
      <Router>
        <Suspense fallback={
          <div className="flex justify-center items-center h-screen text-rose-600 text-2xl animate-spin">
            <FaSpinner />
          </div>
        }>
          <Routes>
            {/* Routes WITHOUT layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Routes WITH layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/saved-codes" element={<SavedCodes />} />
              <Route path="/navbar-codes" element={<NavbarComponent />} />
              <Route path="/button-codes" element={<ButtonComponent />} />
              <Route path="/form-codes" element={<FormComponent />} />
              <Route path="/card-codes" element={<CardComponent />} />
              <Route path="/modal-codes" element={<ModalComponent />} />
              <Route path="/flip-codes" element={<FlipComponent />} />
              <Route path="/book-codes" element={<Books />} />
              <Route path="/features" element={<Feature />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ToastProvider>
  );
}

export default App;
