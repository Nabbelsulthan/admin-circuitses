import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import PeopleIcon from "@mui/icons-material/People";
// import DescriptionIcon from "@mui/icons-material/Description";
// import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// import NotificationsIcon from "@mui/icons-material/Notifications";


export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>CES</h2>
        <span>Admin Portal</span>
      </div>

      <div className="sidebar-menu">

        <div
          className="menu-item"
          onClick={() => navigate("/dashboard")}
        >
          <DashboardIcon />
          <span>Dashboard</span>
        </div>

        <div
          className="menu-item"
          onClick={() => navigate("/projects")}
        >
          <FolderIcon />
          <span>Projects</span>
        </div>

        <div
          className="menu-item"
          onClick={() => navigate("/customers")}
        >
          <PeopleIcon />
          <span>Customers</span>
        </div>

        {/* <div
          className="menu-item"
          onClick={() => navigate("/documents")}
        >
          <DescriptionIcon />
          <span>Documents</span>
        </div> */}

        {/* <div
          className="menu-item"
          onClick={() => navigate("/dispatch")}
        >
          <LocalShippingIcon />
          <span>Dispatch</span>
        </div> */}

        {/* <div
          className="menu-item"
          onClick={() => navigate("/updates")}
        >
          <NotificationsIcon />
          <span>Updates</span>
        </div> */}

      </div>
    </div>
  );
}