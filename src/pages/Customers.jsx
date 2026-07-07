


import { useState, useEffect } from "react";
import "./Customers.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../config";
import SkeletonLoader from "../components/SkeletonLoader";

export default function Customers() {

  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [savingCustomer, setSavingCustomer] =
    useState(false);

  const [showDeleteCustomerModal, setShowDeleteCustomerModal] =
    useState(false);

  const [customerToDelete, setCustomerToDelete] =
    useState(null);

  const [deletingCustomer, setDeletingCustomer] =
    useState(false);
  const [newCustomer, setNewCustomer] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  const handleAddCustomer = async () => {

    const {
      company_name,
      contact_person,
      email,
      phone,
      username,
      password,
    } = newCustomer;

    if (
      !company_name.trim() ||
      !contact_person.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !username.trim() ||
      !password.trim()
    ) {
      toast.warning("Please fill in all fields.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.warning("Please enter a valid email address.");
      return;
    }

    const phoneRegex =
      /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      toast.warning("Phone number must contain exactly 10 digits.");
      return;
    }

    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters.");
      return;
    }

    setSavingCustomer(true);

    try {

      const checkResponse =
        await fetch(
          `${API_URL}/api/customers/check-username/${newCustomer.username}`
        );

      const checkData =
        await checkResponse.json();

      if (checkData.exists) {

        toast.error(
          "Username already exists"
        );

        return;
      }

      const response =
        await fetch(
          `${API_URL}/api/customers`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              newCustomer
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        toast.error(
          data.message ||
          "Failed to add customer"
        );

        return;
      }

      setCustomers([
        ...customers,
        data,
      ]);

      setNewCustomer({
        company_name: "",
        contact_person: "",
        email: "",
        phone: "",
        username: "",
        password: "",
      });

      setShowModal(false);

      toast.success(
        "Customer added successfully"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to add customer"
      );

    } finally {

      setSavingCustomer(false);

    }

  };

  const handleDeleteCustomer =
    async (id) => {

      setDeletingCustomer(true);

      try {

        const response =
          await fetch(
            `${API_URL}/api/customers/${id}`,
            {
              method: "DELETE",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          toast.error(
            data.message ||
            "Failed to delete customer"
          );

          return;

        }

        setCustomers(
          customers.filter(
            (customer) =>
              customer.id !== id
          )
        );

        setShowDeleteCustomerModal(false);

        setCustomerToDelete(null);

        toast.success(
          "Customer deleted successfully"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to delete customer"
        );

      } finally {

        setDeletingCustomer(false);

      }

    };




  useEffect(() => {
    setLoading(true);
    fetch(
      `${API_URL}/api/customers`
    )
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, []);


  if (loading) {
    return <SkeletonLoader />;
}

  return (
    <div className="customers-page">
      <div className="customers-header">
        <div>
          <h1>Customers</h1>
          <p>Manage customer accounts</p>
        </div>

        <button
          className="add-customer-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Customer
        </button>
      </div>

      <div className="customers-table-card">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Portal Username</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>


        
            {  customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.company_name}</td>
                  <td>{customer.contact_person}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.username}</td>

                  <td>

                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(`/customers/${customer.id}`)
                      }
                    >
                      View
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => {

                        setCustomerToDelete(customer.id);

                        setShowDeleteCustomerModal(true);

                      }}
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>


      {showDeleteCustomerModal && (

        <div className="modal-overlay">

          <div className="project-modal">

            <h2>Delete Customer</h2>

            <p className="delete-message">
              Are you sure you want to delete this customer?
              <br />
              <span>This action cannot be undone.</span>
            </p>

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowDeleteCustomerModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="delete-btn"
                disabled={deletingCustomer}
                onClick={() =>
                  handleDeleteCustomer(
                    customerToDelete
                  )
                }
              >
                {deletingCustomer ? (
                  <>
                    <span className="button-spinner"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>

            </div>

          </div>

        </div>

      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="customer-modal">
            <h2>Add Customer</h2>

            <input
              type="text"
              placeholder="Company Name"
              value={newCustomer.company_name}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  company_name: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Contact Person"
              value={newCustomer.contact_person}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  contact_person: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Email Address"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  email: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={newCustomer.phone}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  phone: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Portal Username"
              value={newCustomer.username}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  username: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Portal Password"
              value={newCustomer.password}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  password: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={handleAddCustomer}
                disabled={savingCustomer}
              >
                {savingCustomer ? (
                  <>
                    <span className="button-spinner"></span>
                    Saving...
                  </>
                ) : (
                  "Save Customer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}




    </div>
  );
}
