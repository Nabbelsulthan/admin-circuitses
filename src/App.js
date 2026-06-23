


import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import AdminLayout from "./layouts/AdminLayout";
import ProjectDetails from "./pages/ProjectDetails";
import Customers from "./pages/Customers";
import Documents from "./pages/Documents";
import Dispatch from "./pages/Dispatch";
import Updates from "./pages/Updates";
import CustomerDetails from "./pages/CustomerDetails";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route element={<AdminLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/projects/:id"
            element={<ProjectDetails />}
          />
          <Route
            path="/customers"
            element={<Customers />}
          />
          <Route
            path="/documents"
            element={<Documents />}
          />

          <Route
            path="/dispatch"
            element={<Dispatch />}
          />
          <Route
            path="/updates"
            element={<Updates />}
          />

          <Route
            path="/customers/:id"
            element={<CustomerDetails />}
          />

        </Route>

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </BrowserRouter>


  );
}

export default App;