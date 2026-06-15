import { useState } from "react";
import "./Dispatch.css";

export default function Dispatch() {
  const [dispatches] = useState([
    {
      id: 1,
      project: "MCC Panel",
      status: "Packing Completed",
      transporter: "ABC Logistics",
      lrNumber: "LR123456",
    },
    {
      id: 2,
      project: "PCC Panel",
      status: "Dispatched",
      transporter: "XYZ Transport",
      lrNumber: "LR987654",
    },
  ]);

  return (
    <div className="dispatch-page">
      <div className="dispatch-header">
        <div>
          <h1>Dispatch Management</h1>
          <p>Track project dispatch status</p>
        </div>

        <button className="add-dispatch-btn">
          Update Dispatch
        </button>
      </div>

      <div className="dispatch-table-card">
        <table className="dispatch-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Status</th>
              <th>Transporter</th>
              <th>LR Number</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {dispatches.map((item) => (
              <tr key={item.id}>
                <td>{item.project}</td>
                <td>{item.status}</td>
                <td>{item.transporter}</td>
                <td>{item.lrNumber}</td>

                <td>
                  <button className="edit-btn">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}