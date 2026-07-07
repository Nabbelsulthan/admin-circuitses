import "./CustomerDetails.css";
import { API_URL } from "../config";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SkeletonLoader from "../components/SkeletonLoader";


export default function CustomerDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [customer, setCustomer] =
    useState(null);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [savingCustomer, setSavingCustomer] =
    useState(false);

  const [resettingPassword, setResettingPassword] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [editCustomer, setEditCustomer] =
    useState({
      company_name: "",
      contact_person: "",
      email: "",
      phone: "",
      username: "",
    });

  const [showPasswordModal,
    setShowPasswordModal] =
    useState(false);

  const [newPassword,
    setNewPassword] =
    useState("");

  const [projects, setProjects] =
    useState([]);

  const [documentCount,
    setDocumentCount] =
    useState(0);

  const [updateCount,
    setUpdateCount] =
    useState(0);

  useEffect(() => {

    fetch(
      `${API_URL}/api/customers/${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCustomer(data);
      });

    fetch(
      `${API_URL}/api/customers/${id}/projects`
    )
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      });

    fetch(
      `${API_URL}/api/customers/${id}/stats`
    )
      .then((res) => res.json())
      .then((data) => {

        setDocumentCount(
          data.documents
        );

        setUpdateCount(
          data.updates
        );

      });

  }, [id]);

  if (!customer) {
    return <SkeletonLoader />;
  }


  const handleUpdateCustomer =
    async () => {

      const {
        company_name,
        contact_person,
        email,
        phone,
        username,
      } = editCustomer;

      if (
        !company_name.trim() ||
        !contact_person.trim() ||
        !email.trim() ||
        !phone.trim() ||
        !username.trim()
      ) {

        toast.warning("Please fill all fields.");

        return;

      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {

        toast.warning("Please enter a valid email.");

        return;

      }

      const phoneRegex =
        /^[0-9]{10}$/;

      if (!phoneRegex.test(phone)) {

        toast.warning(
          "Phone number must contain exactly 10 digits."
        );

        return;

      }

      setSavingCustomer(true);

      try {

        const response =
          await fetch(
            `${API_URL}/api/customers/${id}`,
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
        toast.success("Customer updated successfully");

        // alert(
        //   "Customer Updated"
        // );

      } catch (error) {

        console.error(error);

      } finally {

        setSavingCustomer(false);

      }
    };


  const handleResetPassword =
    async () => {

      if (!newPassword.trim()) {

        toast.warning(
          "Please enter a password"
        );

        return;

      }

      if (newPassword.length < 6) {

        toast.warning(
          "Password must be at least 6 characters."
        );

        return;

      }

      setResettingPassword(true);

      try {

        await fetch(
          `${API_URL}/api/customers/${id}/reset-password`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              password:
                newPassword,
            }),
          }
        );

        toast.success(
          "Password reset successfully"
        );

        setShowPasswordModal(
          false
        );

        setNewPassword("");

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to reset password"
        );

      } finally {

        setResettingPassword(false);

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
          <span>{documentCount}</span>
        </div>

        <div className="summary-card">
          <h4>Updates</h4>
          <span>{updateCount}</span>
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

          <button
            className="action-btn"
            onClick={() =>
              setShowPasswordModal(
                true
              )
            }
          >
            Reset Password
          </button>

        </div>

      </div>

      <div className="detail-card">

        <div className="card-header">
          <h3>Assigned Projects</h3>
        </div>

        {projects.length === 0 ? (

          <p
            style={{
              textAlign: "center",
              color: "#888",
              padding: "25px",
            }}
          >
            No projects assigned yet.
          </p>

        ) : (

          projects.map((project) => (



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

          ))

        )}

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
                onClick={handleUpdateCustomer}
                disabled={savingCustomer}
              >
                {savingCustomer ? (
                  <>
                    <span className="button-spinner"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>

            </div>

          </div>

        </div>

      )}


      {showPasswordModal && (

        <div className="modal-overlay">

          <div className="project-modal">

            <h2>
              Reset Password
            </h2>
            {/* 
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
            /> */}

            <div className="password-input-container">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
              />

              <button
                type="button"
                className="toggle-password-btn"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>

            </div>

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowPasswordModal(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={handleResetPassword}
                disabled={resettingPassword}
              >
                {resettingPassword ? (
                  <>
                    <span className="button-spinner"></span>
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>

            </div>

          </div>

        </div>

      )}


    </div>
  );
}