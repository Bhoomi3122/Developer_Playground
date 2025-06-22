import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import Layout from "./components/Layout";
import SavedCodes from "./components/SavedCodes";
import NavbarComponent from "./components/Component_designs/NavbarComponent";
import ButtonComponent from "./components/Component_designs/ButtonComponent";
import FormComponent from "./components/Component_designs/FormComponent";
import CardComponent from "./components/Component_designs/CardComponent";
import ModalComponent from "./components/Component_designs/ModalComponent";
import FlipComponent from "./components/Animation_Designs/FlipComponent";
import Books from "./components/Animation_Designs/Books"
import { ToastProvider } from "./components/ToastProvider";

function App() {
  return (
    <ToastProvider>
    <Router>
      <Routes>
        {/* Routes WITHOUT layout (no navbar etc) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Routes WITH layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/saved-codes" element={<SavedCodes/>}/>
          <Route path="/navbar-codes" element={<NavbarComponent/>}/>
          <Route path="/button-codes" element={<ButtonComponent/>}/>
          <Route path="/form-codes" element={<FormComponent/>}/>
          <Route path="/card-codes" element={<CardComponent/>}/>
          <Route path="/modal-codes" element={<ModalComponent/>}/>
          <Route path="/flip-codes" element={<FlipComponent/>}/>
          <Route path="/book-codes" element={<Books/>}/>
        </Route>
      </Routes>
    </Router>
    </ToastProvider>
  );
}

export default App;
