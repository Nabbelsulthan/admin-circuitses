


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
import HRDashboard from "./pages/HR/Dashboard/HRDashboard";
import HR from "./pages/HR/HR";
import Departments from "./pages/HR/Departments";
import Employees from "./pages/HR/Employees";
import Attendance from "./pages/HR/Attendance";
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


          <Route
            path="/hr/dashboard"
            element={<HRDashboard />}
          />

          <Route
            path="/hr"
            element={<HR />}
          />

          <Route
            path="/hr/departments"
            element={<Departments />}
          />


          <Route
            path="/hr/employees"
            element={<Employees />}
          />

          <Route
            path="/hr/attendance"
            element={<Attendance />}
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