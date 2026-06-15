import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div
        style={{
          marginLeft: "270px",
          width: "100%",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}