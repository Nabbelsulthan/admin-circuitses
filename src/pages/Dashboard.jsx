
import "./Dashboard.css";
import { useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const isLoggedIn =
    localStorage.getItem("isLoggedIn");

  const [stats, setStats] =
    useState(null);


  useEffect(() => {

    fetch(
      "http://localhost:5001/api/dashboard/stats"
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
    return <h2>Loading...</h2>;
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

        <h2>Recent Activity</h2>

        <div className="activity-card">
          Customer management system connected to PostgreSQL.
        </div>

        <div className="activity-card">
          Project tracking module is active.
        </div>

        <div className="activity-card">
          Dashboard statistics are live from database.
        </div>

      </div>

    </div>
  );
}









// return (
//   <div className="dashboard">

//     <div className="dashboard-header">
//       <div>
//         <h1>Dashboard</h1>
//         <p>Welcome to CES Admin Portal</p>
//       </div>

//       <button
//         className="logout-btn"
//         onClick={handleLogout}
//       >
//         Sign Out
//       </button>
//     </div>

//     <div className="stats-grid">

//       <div className="stat-card">
//         <h3>Customers</h3>
//         <h2>{stats.customers}</h2>
//       </div>

//       <div
//         className="stat-card"
//         onClick={() => navigate("/projects")}
//       >
//         <h3>Projects</h3>
//         <h2>{stats.projects}</h2>
//       </div>

//       <div className="stat-card">
//         <h3>Dispatch Pending</h3>
//         <h2>{stats.dispatchPending}</h2>
//       </div>

//       <div className="stat-card">
//         <h3>Updates</h3>
//         <h2>15</h2>
//       </div>

//     </div>

//     <div className="recent-section">
//       <h2>Recent Activity</h2>

//       <div className="activity-card">
//         New customer registered.
//       </div>

//       <div className="activity-card">
//         Project FAT report uploaded.
//       </div>

//       <div className="activity-card">
//         Dispatch scheduled for tomorrow.
//       </div>
//     </div>

//   </div>
// );

