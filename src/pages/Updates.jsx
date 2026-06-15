import { useState } from "react";
import "./Updates.css";

export default function Updates() {
  const [updates, setUpdates] = useState([
    {
      id: 1,
      project: "MCC Panel",
      title: "Wiring Completed",
      date: "12 Jun 2026",
    },
    {
      id: 2,
      project: "PCC Panel",
      title: "FAT Scheduled",
      date: "15 Jun 2026",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [newUpdate, setNewUpdate] = useState({
    project: "",
    title: "",
    date: "",
  });

  const handleAddUpdate = () => {
    if (
      !newUpdate.project ||
      !newUpdate.title ||
      !newUpdate.date
    ) {
      alert("Please fill all fields");
      return;
    }

    setUpdates([
      ...updates,
      {
        id: Date.now(),
        ...newUpdate,
      },
    ]);

    setNewUpdate({
      project: "",
      title: "",
      date: "",
    });

    setShowModal(false);
  };

  return (
    <div className="updates-page">
      <div className="updates-header">
        <div>
          <h1>Updates</h1>
          <p>Manage customer project updates</p>
        </div>

        <button
          className="add-update-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Update
        </button>
      </div>

      <div className="updates-table-card">
        <table className="updates-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Update</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {updates.map((update) => (
              <tr key={update.id}>
                <td>{update.project}</td>
                <td>{update.title}</td>
                <td>{update.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="update-modal">
            <h2>Add Update</h2>

            <input
              type="text"
              placeholder="Project Name"
              value={newUpdate.project}
              onChange={(e) =>
                setNewUpdate({
                  ...newUpdate,
                  project: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Update Title"
              value={newUpdate.title}
              onChange={(e) =>
                setNewUpdate({
                  ...newUpdate,
                  title: e.target.value,
                })
              }
            />

            <input
              type="date"
              value={newUpdate.date}
              onChange={(e) =>
                setNewUpdate({
                  ...newUpdate,
                  date: e.target.value,
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
                onClick={handleAddUpdate}
              >
                Save Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}