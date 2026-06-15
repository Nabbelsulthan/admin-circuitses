
import { useState } from "react";
import "./Projects.css";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([
    {
      id: 1,
      projectName: "MCC Panel",
      customer: "ABC Industries",
      status: "Wiring",
      dispatch: "Pending",
    },
    {
      id: 2,
      projectName: "PCC Panel",
      customer: "XYZ Pvt Ltd",
      status: "Testing",
      dispatch: "Packing Completed",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [newProject, setNewProject] = useState({
    projectName: "",
    customer: "",
    status: "",
    dispatch: "",
  });

  const handleAddProject = () => {
    if (
      !newProject.projectName ||
      !newProject.customer
    ) {
      alert("Please fill all required fields");
      return;
    }

    setProjects([
      ...projects,
      {
        id: Date.now(),
        ...newProject,
      },
    ]);

    setNewProject({
      projectName: "",
      customer: "",
      status: "",
      dispatch: "",
    });

    setShowModal(false);
  };

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div>
          <h1>Projects</h1>
          <p>Manage all customer projects</p>
        </div>

        <button
          className="add-project-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Project
        </button>
      </div>

      <div className="projects-table-card">
        <table className="projects-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Dispatch</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.projectName}</td>
                <td>{project.customer}</td>
                <td>{project.status}</td>
                <td>{project.dispatch}</td>

                <td>

                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate(`/projects/${project.id}`)
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
          <div className="project-modal">
            <h2>Add Project</h2>

            <input
              type="text"
              placeholder="Project Name"
              value={newProject.projectName}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  projectName: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Customer Name"
              value={newProject.customer}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  customer: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Current Status"
              value={newProject.status}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  status: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Dispatch Status"
              value={newProject.dispatch}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  dispatch: e.target.value,
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
                onClick={handleAddProject}
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}