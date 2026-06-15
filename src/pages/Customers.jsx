


import { useState } from "react";
import "./Customers.css";
import { useNavigate } from "react-router-dom";

export default function Customers() {

  const navigate = useNavigate();
  const [customers, setCustomers] = useState([
    {
      id: 1,
      company: "ABC Industries",
      contact: "Arun Kumar",
      email: "abc@gmail.com",
      phone: "9876543210",
      username: "abcindustries",
    },
    {
      id: 2,
      company: "XYZ Pvt Ltd",
      contact: "Rahul",
      email: "xyz@gmail.com",
      phone: "9876543211",
      username: "xyzadmin",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  const handleAddCustomer = () => {
    if (
      !newCustomer.company ||
      !newCustomer.contact ||
      !newCustomer.username ||
      !newCustomer.password
    ) {
      alert("Please fill all required fields");
      return;
    }

    setCustomers([
      ...customers,
      {
        id: Date.now(),
        company: newCustomer.company,
        contact: newCustomer.contact,
        email: newCustomer.email,
        phone: newCustomer.phone,
        username: newCustomer.username,
      },
    ]);

    setNewCustomer({
      company: "",
      contact: "",
      email: "",
      phone: "",
      username: "",
      password: "",
    });

    setShowModal(false);
  };

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
                <td>{customer.company}</td>
                <td>{customer.contact}</td>
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
              value={newCustomer.company}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  company: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Contact Person"
              value={newCustomer.contact}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  contact: e.target.value,
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












// import { useState } from "react";
// import "./Customers.css";

// export default function Customers() {
//   const [customers, setCustomers] = useState([
//     {
//       id: 1,
//       company: "ABC Industries",
//       contact: "Arun Kumar",
//       email: "abc@gmail.com",
//       phone: "9876543210",
//     },
//     {
//       id: 2,
//       company: "XYZ Pvt Ltd",
//       contact: "Rahul",
//       email: "xyz@gmail.com",
//       phone: "9876543211",
//     },
//   ]);

//   const [showModal, setShowModal] = useState(false);

//   const [newCustomer, setNewCustomer] = useState({
//     company: "",
//     contact: "",
//     email: "",
//     phone: "",
//   });

//   const handleAddCustomer = () => {
//     if (
//       !newCustomer.company ||
//       !newCustomer.contact
//     ) {
//       alert("Please fill required fields");
//       return;
//     }

//     setCustomers([
//       ...customers,
//       {
//         id: Date.now(),
//         ...newCustomer,
//       },
//     ]);

//     setNewCustomer({
//       company: "",
//       contact: "",
//       email: "",
//       phone: "",
//     });

//     setShowModal(false);
//   };

//   return (
//     <div className="customers-page">
//       <div className="customers-header">
//         <div>
//           <h1>Customers</h1>
//           <p>Manage customer accounts</p>
//         </div>

//         <button
//           className="add-customer-btn"
//           onClick={() => setShowModal(true)}
//         >
//           + Add Customer
//         </button>
//       </div>

//       <div className="customers-table-card">
//         <table className="customers-table">
//           <thead>
//             <tr>
//               <th>Company</th>
//               <th>Contact Person</th>
//               <th>Email</th>
//               <th>Phone</th>
//             </tr>
//           </thead>

//           <tbody>
//             {customers.map((customer) => (
//               <tr key={customer.id}>
//                 <td>{customer.company}</td>
//                 <td>{customer.contact}</td>
//                 <td>{customer.email}</td>
//                 <td>{customer.phone}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {showModal && (
//         <div className="modal-overlay">
//           <div className="customer-modal">
//             <h2>Add Customer</h2>

//             <input
//               type="text"
//               placeholder="Company Name"
//               value={newCustomer.company}
//               onChange={(e) =>
//                 setNewCustomer({
//                   ...newCustomer,
//                   company: e.target.value,
//                 })
//               }
//             />

//             <input
//               type="text"
//               placeholder="Contact Person"
//               value={newCustomer.contact}
//               onChange={(e) =>
//                 setNewCustomer({
//                   ...newCustomer,
//                   contact: e.target.value,
//                 })
//               }
//             />

//             <input
//               type="email"
//               placeholder="Email"
//               value={newCustomer.email}
//               onChange={(e) =>
//                 setNewCustomer({
//                   ...newCustomer,
//                   email: e.target.value,
//                 })
//               }
//             />

//             <input
//               type="text"
//               placeholder="Phone Number"
//               value={newCustomer.phone}
//               onChange={(e) =>
//                 setNewCustomer({
//                   ...newCustomer,
//                   phone: e.target.value,
//                 })
//               }
//             />

//             <div className="modal-actions">
//               <button
//                 className="cancel-btn"
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>

//               <button
//                 className="save-btn"
//                 onClick={handleAddCustomer}
//               >
//                 Save Customer
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
