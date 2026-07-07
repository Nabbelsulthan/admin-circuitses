
import "./Dashboard.css";
import { useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from "../config";
import SkeletonLoader from "../components/SkeletonLoader";

export default function Dashboard() {
  const navigate = useNavigate();
  const isLoggedIn =
    localStorage.getItem("isLoggedIn");

  const [stats, setStats] =
    useState(null);


  useEffect(() => {

    fetch(
      `${API_URL}/api/dashboard/stats`
    )
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
      });

  }, []);


  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");

    navigate("/", {
      replace: true,
    });
  };

  if (!stats) {
    return <SkeletonLoader type="dashboard" />
  }




  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to CES Admin Portal</p>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </div>

      <div className="stats-grid">

        <div
          className="stat-card clickable"
          onClick={() =>
            navigate("/customers")
          }
        >
          <h3>Customers</h3>
          <h2>{stats.customers}</h2>
        </div>

        <div
          className="stat-card clickable"
          onClick={() =>
            navigate("/projects")
          }
        >
          <h3>Projects</h3>
          <h2>{stats.projects}</h2>
        </div>

        <div className="stat-card">
          <h3>In Progress</h3>
          <h2>{stats.inProgress}</h2>
        </div>

        <div className="stat-card">
          <h3>Delivered</h3>
          <h2>{stats.delivered}</h2>
        </div>

        <div className="stat-card">
          <h3>Dispatch Pending</h3>
          <h2>{stats.dispatchPending}</h2>
        </div>

        <div className="stat-card">
          <h3>Updates</h3>
          <h2>0</h2>
        </div>

      </div>


      <div className="recent-section">

        <h2>Business Overview</h2>
        <div className="activity-card">
          🏭 {stats.projects} projects currently tracked through CES Connect.
        </div>

        <div className="activity-card">
          🤝 {stats.customers} customer accounts are active in the portal.
        </div>

        <div className="activity-card">
          🚚 {stats.dispatchPending} projects are awaiting dispatch.
        </div>




      </div>





    </div>
  );
}



