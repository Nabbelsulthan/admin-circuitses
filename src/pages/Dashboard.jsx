
import "./Dashboard.css";
import { useNavigate, Navigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const isLoggedIn =
    localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");

    navigate("/", {
      replace: true,
    });
  };

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

        <div className="stat-card">
          <h3>Customers</h3>
          <h2>12</h2>
        </div>

        {/* <div className="stat-card">
          <h3>Projects</h3>
          <h2>24</h2>
        </div> */}

        <div
          className="stat-card"
          onClick={() => navigate("/projects")}
        >
          <h3>Projects</h3>
          <h2>24</h2>
        </div>

        <div className="stat-card">
          <h3>Dispatch Pending</h3>
          <h2>3</h2>
        </div>

        <div className="stat-card">
          <h3>Updates</h3>
          <h2>15</h2>
        </div>

      </div>

      <div className="recent-section">
        <h2>Recent Activity</h2>

        <div className="activity-card">
          New customer registered.
        </div>

        <div className="activity-card">
          Project FAT report uploaded.
        </div>

        <div className="activity-card">
          Dispatch scheduled for tomorrow.
        </div>
      </div>

    </div>
  );
}