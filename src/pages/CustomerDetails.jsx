import "./CustomerDetails.css";
import { useParams } from "react-router-dom";

export default function CustomerDetails() {
  const { id } = useParams();

  const customer = {
    id,
    company: "ABC Industries",
    contact: "Arun Kumar",
    email: "arun@abc.com",
    phone: "9876543210",
    username: "abcindustries",
  };

  const projects = [
    "MCC Panel",
    "PCC Panel",
  ];

  return (
    <div className="customer-details">

      <div className="customer-header">
        <h1>{customer.company}</h1>
        <p>Customer Profile</p>
      </div>

      <div className="details-grid">

        <div className="detail-card">
          <h3>Contact Information</h3>

          <p>
            <strong>Contact:</strong>{" "}
            {customer.contact}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {customer.email}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {customer.phone}
          </p>
        </div>

        <div className="detail-card">
          <h3>Portal Access</h3>

          <p>
            <strong>Username:</strong>{" "}
            {customer.username}
          </p>

          <button className="action-btn">
            Reset Password
          </button>
        </div>

      </div>

      <div className="detail-card">
        <div className="card-header">
          <h3>Assigned Projects</h3>

          <button className="mini-btn">
            + Assign Project
          </button>
        </div>

        {projects.map((project) => (
          <div
            key={project}
            className="list-item"
          >
            {project}
          </div>
        ))}
      </div>

    </div>
  );
}