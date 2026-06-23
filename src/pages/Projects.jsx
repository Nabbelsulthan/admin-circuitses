
import { useState, useEffect } from "react";
import "./Projects.css";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [newProject, setNewProject] = useState({
    projectName: "",
    customer_id: "",
    status: "",
    dispatch: "",
    panel_type: "",
    project_engineer: "",
    completion_percentage: 0,
  });

  const [customers, setCustomers] =
    useState([]);

  const loadProjects = () => {
    fetch(
      "http://localhost:5001/api/projects"
    )
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };


  useEffect(() => {
    loadProjects();
  }, []);

  const completionMap = {
    "In Discussion": 5,
    "Design": 15,
    "Fabrication": 35,
    "Assembly": 55,
    "Wiring": 75,
    "Testing": 90,
    "Dispatch": 95,
    "Delivered": 100,
  };

  const handleAddProject = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/projects",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            project_name:
              newProject.projectName,

            customer_id: Number(
              newProject.customer_id
            ),
            status:
              newProject.status,

            dispatch_status:
              newProject.dispatch,

            po_number:
              "CES-2026-NEW",

            project_value: 0,

            panel_type:
              newProject.panel_type,

            project_engineer:
              newProject.project_engineer,

            completion_percentage:
              completionMap[
              newProject.status
              ] || 0,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save project");
      }

      await response.json();

      loadProjects();

      setNewProject({
        projectName: "",
        customer_id: "",
        status: "",
        dispatch: "",
        panel_type: "",
        project_engineer: "",
        completion_percentage: 0,
      });

      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {

    fetch(
      "http://localhost:5001/api/customers"
    )
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
      });

  }, []);



  const handleDeleteProject =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this project?"
        );

      if (!confirmDelete)
        return;

      try {

        await fetch(
          `http://localhost:5001/api/projects/${id}`,
          {
            method: "DELETE",
          }
        );

        loadProjects();

      } catch (error) {

        console.error(error);

      }
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
              <th>Panel Type</th>
              <th>Engineer</th>
              <th>Action</th>


            </tr>
          </thead>


          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.project_name}</td>

                {/* <td>{project.customer_id}</td> */}

                <td>{project.company_name}</td>

                <td>{project.status}</td>

                <td>{project.dispatch_status}</td>

                <td>{project.panel_type}</td>

                <td>
                  {project.project_engineer}
                </td>
                {/* <td>
                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate(`/projects/${project.id}`)
                    }
                  >
                    View
                  </button>
                </td> */}


                <td>

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

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDeleteProject(
                        project.id
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

            <select className="customer-select"
              value={
                newProject.customer_id
              }
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  customer_id:
                    e.target.value,
                })
              }
            >
              <option value="">
                Select Customer
              </option>

              {customers.map(
                (customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.company_name}
                  </option>
                )
              )}
            </select>

            <select
              value={newProject.panel_type}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  panel_type:
                    e.target.value,
                })
              }
            >
              <option value="">
                Select Panel Type
              </option>

              <option value="MCC Panel">
                MCC Panel
              </option>

              <option value="PCC Panel">
                PCC Panel
              </option>

              <option value="APFC Panel">
                APFC Panel
              </option>

              <option value="Control Panel">
                Control Panel
              </option>

              <option value="PLC Panel">
                PLC Panel
              </option>

              <option value="Metering Panel">
                Metering Panel
              </option>
            </select>


            <input
              type="text"
              placeholder="Project Engineer"
              value={
                newProject.project_engineer
              }
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  project_engineer:
                    e.target.value,
                })
              }
            />


            <select
              value={newProject.status}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  status: e.target.value,
                })
              }
            >

              <option value="">
                Select Status
              </option>

              <option value="In Discussion">
                In Discussion
              </option>

              <option value="Design">
                Design
              </option>

              <option value="Fabrication">
                Fabrication
              </option>

              <option value="Assembly">
                Assembly
              </option>

              <option value="Wiring">
                Wiring
              </option>

              <option value="Testing">
                Testing
              </option>

              <option value="Dispatch">
                Dispatch
              </option>

              <option value="Delivered">
                Delivered
              </option>

            </select>



            <select
              value={newProject.dispatch}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  dispatch: e.target.value,
                })
              }
            >

              <option value="">
                Select Dispatch Status
              </option>

              <option value="Not Applicable">
                Not Applicable
              </option>

              <option value="Packing Completed">
                Packing Completed
              </option>

              <option value="Ready For Dispatch">
                Ready For Dispatch
              </option>

              <option value="Dispatched">
                Dispatched
              </option>

              <option value="In Transit">
                In Transit
              </option>

              <option value="Delivered">
                Delivered
              </option>

            </select>

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