


import { useState, useEffect } from "react";
import "./Customers.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Customers() {

  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  const handleAddCustomer = async () => {

    try {

      const checkResponse =
        await fetch(
          `http://localhost:5001/api/customers/check-username/${newCustomer.username}`
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
          "http://localhost:5001/api/customers",
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

    }

  };

  const handleDeleteCustomer =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "This action cannot be undone. Delete this customer?"
        );

      if (!confirmDelete)
        return;

      try {

        const response =
          await fetch(
            `http://localhost:5001/api/customers/${id}`,
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

        toast.success(
          "Customer deleted successfully"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to delete customer"
        );

      }

    };

  useEffect(() => {
    fetch(
      "http://localhost:5001/api/customers"
    )
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
      })
      .catch(console.error);
  }, []);

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
            {customers.map((customer) => (
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
                    onClick={() =>
                      handleDeleteCustomer(
                        customer.id
                      )
                    }
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              >
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}




    </div>
  );
}
