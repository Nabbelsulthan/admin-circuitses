import "./CustomerDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function CustomerDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [customer, setCustomer] =
    useState(null);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editCustomer, setEditCustomer] =
    useState({
      company_name: "",
      contact_person: "",
      email: "",
      phone: "",
      username: "",
    });

  const [projects, setProjects] =
    useState([]);

  useEffect(() => {

    fetch(
      `http://localhost:5001/api/customers/${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCustomer(data);
      });

    fetch(
      `http://localhost:5001/api/customers/${id}/projects`
    )
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      });

  }, [id]);

  if (!customer) {
    return <h2>Loading...</h2>;
  }


  const handleUpdateCustomer =
    async () => {

      try {

        const response =
          await fetch(
            `http://localhost:5001/api/customers/${id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify(
                editCustomer
              ),
            }
          );

        const updatedCustomer =
          await response.json();

        setCustomer(
          updatedCustomer
        );

        setShowEditModal(false);

        alert(
          "Customer Updated"
        );

      } catch (error) {

        console.error(error);

      }
    };

  return (
    <div className="customer-details">

      <div className="customer-header">

        <div>
          <h1>{customer.company_name}</h1>
          <p>Customer Profile</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {

            setEditCustomer({
              company_name:
                customer.company_name,

              contact_person:
                customer.contact_person,

              email:
                customer.email,

              phone:
                customer.phone,

              username:
                customer.username,
            });

            setShowEditModal(true);

          }}
        >
          Edit Customer
        </button>

      </div>

      <div className="customer-summary">

        <div className="summary-card">
          <h4>Total Projects</h4>
          <span>{projects.length}</span>
        </div>

        <div className="summary-card">
          <h4>Portal Status</h4>
          <span>Active</span>
        </div>

        <div className="summary-card">
          <h4>Documents</h4>
          <span>0</span>
        </div>

        <div className="summary-card">
          <h4>Updates</h4>
          <span>0</span>
        </div>

      </div>

      <div className="details-grid">

        <div className="detail-card">

          <div className="card-header">
            <h3>Contact Information</h3>
          </div>

          <div className="info-row">
            <label>Contact Person</label>
            <p>{customer.contact_person}</p>
          </div>

          <div className="info-row">
            <label>Email</label>
            <p>{customer.email}</p>
          </div>

          <div className="info-row">
            <label>Phone</label>
            <p>{customer.phone}</p>
          </div>

        </div>

        <div className="detail-card">

          <div className="card-header">
            <h3>Portal Access</h3>
          </div>

          <div className="info-row">
            <label>Username</label>
            <p>{customer.username}</p>
          </div>

          <button className="action-btn">
            Reset Password
          </button>

        </div>

      </div>

      <div className="detail-card">

        <div className="card-header">
          <h3>Assigned Projects</h3>
        </div>

        {projects.map((project) => (



          <div
            key={project.id}
            className="project-item"
          >
            <div>
              <strong>
                {project.project_name}
              </strong>

              <p>
                {project.status}
              </p>
            </div>

            <button
              className="view-btn"
              onClick={() =>
                navigate(
                  `/projects/${project.id}`
                )
              }
            >
              View
            </button>
          </div>

        ))}

      </div>



      {showEditModal && (

        <div className="modal-overlay">

          <div className="project-modal">

            <h2>Edit Customer</h2>

            <input
              type="text"
              value={
                editCustomer.company_name
              }
              onChange={(e) =>
                setEditCustomer({
                  ...editCustomer,
                  company_name:
                    e.target.value,
                })
              }
              placeholder="Company Name"
            />

            <input
              type="text"
              value={
                editCustomer.contact_person
              }
              onChange={(e) =>
                setEditCustomer({
                  ...editCustomer,
                  contact_person:
                    e.target.value,
                })
              }
              placeholder="Contact Person"
            />

            <input
              type="email"
              value={
                editCustomer.email
              }
              onChange={(e) =>
                setEditCustomer({
                  ...editCustomer,
                  email:
                    e.target.value,
                })
              }
              placeholder="Email"
            />

            <input
              type="text"
              value={
                editCustomer.phone
              }
              onChange={(e) =>
                setEditCustomer({
                  ...editCustomer,
                  phone:
                    e.target.value,
                })
              }
              placeholder="Phone"
            />

            <input
              type="text"
              value={
                editCustomer.username
              }
              onChange={(e) =>
                setEditCustomer({
                  ...editCustomer,
                  username:
                    e.target.value,
                })
              }
              placeholder="Username"
            />

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowEditModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={
                  handleUpdateCustomer
                }
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}