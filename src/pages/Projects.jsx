
import { useState, useEffect } from "react";
import "./Projects.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import SkeletonLoader from "../components/SkeletonLoader";
import { toast } from "react-toastify";

import VisibilityOutlinedIcon
  from "@mui/icons-material/VisibilityOutlined";

import EditOutlinedIcon
  from "@mui/icons-material/EditOutlined";

import DeleteOutlineOutlinedIcon
  from "@mui/icons-material/DeleteOutlineOutlined";

export default function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
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

  const [savingProject, setSavingProject] =
    useState(false);

  const [showDeleteProjectModal, setShowDeleteProjectModal] =
    useState(false);

  const [projectToDelete, setProjectToDelete] =
    useState(null);

  const [deletingProject, setDeletingProject] =
    useState(false);



  // nabbel edit
  const [editingProject, setEditingProject] =
    useState(null);

  const [updatingProject, setUpdatingProject] =
    useState(false);


  const loadProjects = () => {

    setLoading(true);
    fetch(
      `${API_URL}/api/projects`
    )
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
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
  // nabbel edit
  const handleEditProject = (project) => {

    setEditingProject(project);

    setNewProject({

      projectName: project.project_name,

      customer_id: project.customer_id,

      status: project.status,

      dispatch: project.dispatch_status,

      panel_type: project.panel_type,

      project_engineer: project.project_engineer,

      completion_percentage:
        project.completion_percentage,

    });

    setShowModal(true);

  };

  const handleAddProject = async () => {

    setSavingProject(true);

    try {

      const response = await fetch(
        `${API_URL}/api/projects`,
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
        throw new Error(
          "Failed to save project"
        );
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

      toast.success(
        "Project created successfully"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to create project"
      );

    } finally {

      setSavingProject(false);
      setEditingProject(null);

    }

  };


  const handleUpdateProject = async () => {

    setUpdatingProject(true);

    try {

      const response =
        await fetch(

          `${API_URL}/api/projects/${editingProject.id}`,

          {

            method: "PUT",

            headers: {

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify({

              project_name:
                newProject.projectName,

              po_number:
                editingProject.po_number,

              project_value:
                editingProject.project_value,

              start_date:
                editingProject.start_date,

              expected_delivery:
                editingProject.expected_delivery,

              status:
                newProject.status,

              dispatch_status:
                newProject.dispatch,

              transporter:
                editingProject.transporter,

              lr_number:
                editingProject.lr_number,

              vehicle_number:
                editingProject.vehicle_number,

              dispatch_date:
                editingProject.dispatch_date,

              delivery_date:
                editingProject.delivery_date,

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

        throw new Error();

      }

      loadProjects();

      setShowModal(false);

      setEditingProject(null);

      toast.success(
        "Project Updated Successfully"
      );

    }

    catch (error) {

      console.error(error);

      toast.error(
        "Failed to update project"
      );

    }

    finally {

      setUpdatingProject(false);

    }

  };


  useEffect(() => {

    fetch(
      `${API_URL}/api/customers`
    )
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
      });

  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }



  const handleDeleteProject =
    async (id) => {

      setDeletingProject(true);

      try {

        await fetch(
          `${API_URL}/api/projects/${id}`,
          {
            method: "DELETE",
          }
        );

        loadProjects();

        setShowDeleteProjectModal(false);

        setProjectToDelete(null);

        toast.success(
          "Project deleted successfully"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to delete project"
        );

      } finally {

        setDeletingProject(false);

      }

    };

  return (
    <div className="projects-page">

      <div className="projects-header">
        <div className="projects-header-content">

          <h1>Projects</h1>

          <p>
            Manage all customer projects
          </p>

        </div>

        {/* <button
          className="add-project-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Project
        </button> */}


        <button
          className="add-project-btn"
          onClick={() => {

            setEditingProject(null);

            setNewProject({
              projectName: "",
              customer_id: "",
              status: "",
              dispatch: "",
              panel_type: "",
              project_engineer: "",
              completion_percentage: 0,
            });

            setShowModal(true);

          }}
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

                <td>{project.company_name}</td>
                {/* nabbel */}
                {/* <td>{project.status}</td> */}

                <td>

                  <span
                    className={`status-badge ${project.status === "Delivered"
                      ? "status-delivered"
                      : project.status === "Assembly"
                        ? "status-assembly"
                        : project.status === "Testing"
                          ? "status-testing"
                          : project.status === "Design"
                            ? "status-design"
                            : "status-discussion"
                      }`}
                  >

                    {project.status}

                  </span>

                </td>
                {/* nabbel */}
                {/* <td>{project.dispatch_status}</td> */}
                <td>

                  <span
                    className={`dispatch-badge ${project.dispatch_status === "Delivered"
                      ? "dispatch-delivered"
                      : project.dispatch_status === "Ready"
                        ? "dispatch-ready"
                        : project.dispatch_status === "Pending"
                          ? "dispatch-pending"
                          : "dispatch-na"
                      }`}
                  >

                    {project.dispatch_status}

                  </span>

                </td>

                <td>{project.panel_type}</td>

                <td>{project.project_engineer}</td>
                {/* nabbel edit  */}
                {/* <button
                    className="view-btn"
                    onClick={() =>
                      navigate(
                        `/projects/${project.id}`
                      )
                    }
                  >
                    View
                  </button> */}
                {/* <button
                    className="delete-btn"
                    onClick={() => {

                      setProjectToDelete(project.id);

                      setShowDeleteProjectModal(true);

                    }}
                  >
                    Delete
                  </button> */}

                {/* nabbel */}
                {/* <td>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      handleEditProject(project)
                    }
                  >
                    Edit
                  </button>

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
                    onClick={() => {

                      setProjectToDelete(project.id);

                      setShowDeleteProjectModal(true);

                    }}
                  >
                    Delete
                  </button>


                </td> */}

                <td>

                  <div className="action-buttons">

                    <button
                      className="action-btn edit-btn"
                      onClick={() =>
                        handleEditProject(project)
                      }
                    >
                      <EditOutlinedIcon />
                    </button>

                    <button
                      className="action-btn view-btn"
                      onClick={() =>
                        navigate(`/projects/${project.id}`)
                      }
                    >
                      <VisibilityOutlinedIcon />
                    </button>

                    <button
                      className="action-btn delete-btn"
                      onClick={() => {

                        setProjectToDelete(project.id);

                        setShowDeleteProjectModal(true);

                      }}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>


        </table>
      </div>


      {
        showDeleteProjectModal && (

          <div className="modal-overlay">

            <div className="project-modal">



              <div className="delete-icon">
                🗑️
              </div>

              <h2>
                Delete Project
              </h2>


              <p>
                Are you sure you want to permanently
                delete this project?
              </p>

              <div className="modal-actions">

                <button
                  className="cancel-btn"
                  onClick={() =>
                    setShowDeleteProjectModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="delete-btn"
                  disabled={deletingProject}
                  onClick={() =>
                    handleDeleteProject(
                      projectToDelete
                    )
                  }
                >
                  {deletingProject ? (
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

        )
      }


      {showModal && (
        <div className="modal-overlay">
          <div className="project-modal">

            {/* nabbel edit */}
            {/* <h2>Add Project</h2> */}

            <h2>

              {editingProject
                ? "Edit Project"
                : "Add Project"}

            </h2>
            <div className="form-grid">

              <div className="form-group">
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

              </div>

              <div className="form-group">
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

              </div>

              <div className="form-group">
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

                  <option value="PLC Control Panel">
                    PLC Control Panel
                  </option>

                  <option value="Automation Panel">
                    Automation Panel
                  </option>

                  <option value="Metering Panel">
                    Metering Panel
                  </option>

                  <option value="LT Panel">
                    LT Panel
                  </option>

                  <option value="Enclosures">
                    Enclosures
                  </option>
                </select>
              </div>


              <div className="form-group">
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
              </div>


              <div className="form-group">

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

              </div>



              <div className="form-group">
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
              </div>


            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {

                  setShowModal(false);

                  setEditingProject(null);

                  setNewProject({
                    projectName: "",
                    customer_id: "",
                    status: "",
                    dispatch: "",
                    panel_type: "",
                    project_engineer: "",
                    completion_percentage: 0,
                  });

                }}
              >
                Cancel
              </button>
              {/* nabbel edit  */}
              {/* <button
                className="save-btn"

                // nabbel edit 
                // onClick={handleAddProject}

                onClick={
                  editingProject
                    ? handleUpdateProject
                    : handleAddProject
                }
                disabled={savingProject}
              >
                {savingProject ? (
                  <>
                    <span className="button-spinner"></span>
                    Saving...
                  </>
                ) : (

                  // nabbel edit 

                  editingProject
                    ? "Update Project"
                    : "Save Project"
                  // "Save Project"
                )}
              </button> */}

              <button
                className="save-btn"
                onClick={
                  editingProject
                    ? handleUpdateProject
                    : handleAddProject
                }
                disabled={
                  savingProject || updatingProject
                }
              >

                {savingProject || updatingProject ? (

                  <>
                    <span className="button-spinner"></span>

                    {editingProject
                      ? "Updating..."
                      : "Saving..."}

                  </>

                ) : (

                  editingProject
                    ? "Update Project"
                    : "Save Project"

                )}

              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );


}