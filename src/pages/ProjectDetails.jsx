
import "./ProjectDetails.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";


const stages = [
    "Design",
    "Fabrication",
    "Assembly",
    "Wiring",
    "Testing",
    "Dispatch",
    "Delivered",
];

export default function ProjectDetails() {
    const { id } = useParams();

    const [project, setProject] =
        useState(null);

    const [customer, setCustomer] =
        useState(null);
    const [currentStage, setCurrentStage] =
        useState(3);

    const [selectedStage, setSelectedStage] =
        useState(3);

    const [showProjectModal, setShowProjectModal] =
        useState(false);


    const [documents, setDocuments] =
        useState([]);

    const [selectedFile, setSelectedFile] =
        useState(null);


    const [updates, setUpdates] =
        useState([]);

    const [newUpdate, setNewUpdate] =
        useState("");

    const [showDispatchModal, setShowDispatchModal] =
        useState(false);

    const [dispatchData, setDispatchData] =
        useState({
            dispatch_status: "",
            transporter: "",
            lr_number: "",
            vehicle_number: "",
            dispatch_date: "",
            delivery_date: "",
        });




    const [editProject, setEditProject] =
        useState({
            project_name: "",
            po_number: "",
            project_value: "",
            start_date: "",
            expected_delivery: "",
        });


    const [fatReports, setFatReports] =
        useState([]);

    const [showFatModal,
        setShowFatModal] =
        useState(false);

    const [fatFile,
        setFatFile] =
        useState(null);

    const handleUpdateStage = async () => {
        try {
            await fetch(
                `http://localhost:5001/api/projects/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        status:
                            stages[selectedStage],
                        dispatch_status:
                            project.dispatch_status,
                    }),
                }
            );

            setCurrentStage(selectedStage);

            alert("Stage Updated");

        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {

        fetch(
            `http://localhost:5001/api/projects/${id}`
        )
            .then((res) => res.json())
            .then((data) => {
                setProject(data);

                setDispatchData({
                    dispatch_status:
                        data.dispatch_status || "",

                    transporter:
                        data.transporter || "",

                    lr_number:
                        data.lr_number || "",

                    vehicle_number:
                        data.vehicle_number || "",

                    dispatch_date:
                        data.dispatch_date || "",

                    delivery_date:
                        data.delivery_date || "",
                });
            })
            .catch((err) => {
                console.error(err);
            });

        fetch(
            `http://localhost:5001/api/documents/${id}`
        )
            .then((res) => res.json())
            .then((data) => {
                setDocuments(data);
            });


        fetch(
            `http://localhost:5001/api/updates/${id}`
        )
            .then((res) => res.json())
            .then((data) => {
                setUpdates(data);
            });


        fetch(
            `http://localhost:5001/api/fat-reports/${id}`
        )
            .then((res) => res.json())
            .then((data) => {

                console.log(
                    "FAT Reports:",
                    data
                );

                setFatReports(data);

            });

    }, [id]);

    useEffect(() => {
        if (project) {
            const stageIndex =
                stages.indexOf(project.status);

            if (stageIndex !== -1) {
                setCurrentStage(stageIndex);
                setSelectedStage(stageIndex);
            }
        }
    }, [project
    ]);

    useEffect(() => {

        if (!project) return;

        fetch(
            `http://localhost:5001/api/customers/${project.customer_id}`
        )
            .then((res) => res.json())
            .then((data) => {
                setCustomer(data);
            })
            .catch((err) => {
                console.error(err);
            });

    }, [project]);

    if (!project || !customer) {
        return <h2>Loading...</h2>;
    }


    const handleUploadDocument =
        async () => {

            if (!selectedFile) {
                alert(
                    "Please select a file"
                );
                return;
            }

            const formData =
                new FormData();

            formData.append(
                "project_id",
                id
            );

            formData.append(
                "document",
                selectedFile
            );

            try {

                await fetch(
                    "http://localhost:5001/api/documents",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                const response =
                    await fetch(
                        `http://localhost:5001/api/documents/${id}`
                    );

                const docs =
                    await response.json();

                setDocuments(docs);

                setSelectedFile(null);

                alert(
                    "Document Uploaded"
                );

            } catch (error) {

                console.error(error);

            }

        };

    const handleDeleteDocument =
        async (documentId) => {

            const confirmDelete =
                window.confirm(
                    "Delete this document?"
                );

            if (!confirmDelete)
                return;

            try {

                await fetch(
                    `http://localhost:5001/api/documents/${documentId}`,
                    {
                        method: "DELETE",
                    }
                );

                const response =
                    await fetch(
                        `http://localhost:5001/api/documents/${id}`
                    );

                const docs =
                    await response.json();

                setDocuments(docs);

            } catch (error) {

                console.error(error);

            }

        };



    const handleAddUpdate =
        async () => {

            if (!newUpdate.trim())
                return;

            try {

                await fetch(
                    "http://localhost:5001/api/updates",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            project_id: id,
                            update_text: newUpdate,
                        }),
                    }
                );

                const response =
                    await fetch(
                        `http://localhost:5001/api/updates/${id}`
                    );

                const data =
                    await response.json();

                setUpdates(data);

                setNewUpdate("");

            } catch (error) {

                console.error(error);

            }

        };


    const handleDeleteUpdate =
        async (updateId) => {

            try {

                await fetch(
                    `http://localhost:5001/api/updates/${updateId}`,
                    {
                        method: "DELETE",
                    }
                );

                const response =
                    await fetch(
                        `http://localhost:5001/api/updates/${id}`
                    );

                const data =
                    await response.json();

                setUpdates(data);

            } catch (error) {

                console.error(error);

            }

        };

    const handleSaveDispatch =
        async () => {

            try {

                await fetch(
                    `http://localhost:5001/api/projects/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },


                        body: JSON.stringify({

                            project_name:
                                project.project_name,

                            po_number:
                                project.po_number,

                            project_value:
                                project.project_value,




                            start_date:
                                project.start_date
                                    ?.split("T")[0],

                            expected_delivery:
                                project.expected_delivery
                                    ?.split("T")[0],

                            status:
                                project.status,

                            ...dispatchData,

                        }),
                    }
                );

                const response =
                    await fetch(
                        `http://localhost:5001/api/projects/${id}`
                    );

                const updatedProject =
                    await response.json();

                console.log(updatedProject);

                setProject(
                    updatedProject
                );

                setShowDispatchModal(
                    false
                );

                alert(
                    "Dispatch Updated"
                );

            } catch (error) {

                console.error(error);

            }

        };



    const handleSaveProject =
        async () => {

            try {

                const response =
                    await fetch(
                        `http://localhost:5001/api/projects/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body: JSON.stringify({
                                ...project,
                                ...editProject,
                            }),
                        }
                    );
                await response.json();

                const refreshedResponse =
                    await fetch(
                        `http://localhost:5001/api/projects/${id}`
                    );

                const refreshedProject =
                    await refreshedResponse.json();

                setProject(refreshedProject);

                setShowProjectModal(false);

                alert(
                    "Project Updated"
                );

            } catch (error) {

                console.error(error);

            }

        };



    const handleFatUpload =
        async () => {

            if (!fatFile) return;

            const formData =
                new FormData();

            formData.append(
                "project_id",
                id
            );

            formData.append(
                "report",
                fatFile
            );

            try {

                await fetch(
                    "http://localhost:5001/api/fat-reports",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                const response =
                    await fetch(
                        `http://localhost:5001/api/fat-reports/${id}`
                    );

                const data =
                    await response.json();


                console.log(
                    "FAT Reports:",
                    data
                );

                setFatReports(data);

                setShowFatModal(
                    false
                );

                setFatFile(null);

            } catch (error) {

                console.error(error);

            }

        };

    const deleteFatReport =
        async (reportId) => {

            await fetch(
                `http://localhost:5001/api/fat-reports/${reportId}`,
                {
                    method: "DELETE",
                }
            );

            setFatReports(
                fatReports.filter(
                    (report) =>
                        report.id !== reportId
                )
            );

        };

    return (
        <div className="project-details">

            <div className="project-top">
                <h1>{project.project_name}</h1>
                <p>{project.company_name}</p>
            </div>

            {/* details of projects  */}


            <div className="project-info-card">

                <div className="card-header">
                    <h2>Project Information</h2>
                    <button
                        className="mini-btn"
                        onClick={() => {

                            setEditProject({
                                project_name:
                                    project.project_name || "",

                                po_number:
                                    project.po_number || "",

                                project_value:
                                    project.project_value || "",

                                start_date:
                                    project.start_date
                                        ? project.start_date
                                            .split("T")[0]
                                        : "",

                                expected_delivery:
                                    project.expected_delivery
                                        ? project.expected_delivery
                                            .split("T")[0]
                                        : "",
                            });

                            setShowProjectModal(true);

                        }}
                    >
                        Edit Project
                    </button>
                </div>

                <div className="project-info-grid">

                    <div>
                        <label>Project Name</label>
                        <p>{project.project_name}</p>
                    </div>

                    <div>
                        <label>Customer</label>
                        <p>{project.company_name}</p>
                    </div>

                    <div>
                        <label>PO Number</label>
                        <p>{project.po_number}</p>
                    </div>

                    <div>
                        <label>Project Value</label>
                        <p>₹ {project.project_value}</p>
                    </div>

                    <div>
                        <label>Start Date</label>




                        <p>
                            {project.start_date
                                ? new Date(
                                    project.start_date
                                ).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )
                                : "-"}
                        </p>

                    </div>

                    <div>
                        <label>Expected Delivery</label>
                        <p>
                            {project.expected_delivery
                                ? new Date(
                                    project.expected_delivery
                                ).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )
                                : "-"}
                        </p>
                    </div>

                </div>

            </div>
            <div className="details-grid">

                <div className="detail-card">
                    <h3>Current Status</h3>



                    <select
                        className="status-select"
                        value={selectedStage}
                        onChange={(e) =>
                            setSelectedStage(
                                Number(e.target.value)
                            )
                        }
                    >
                        {stages.map((stage, index) => (
                            <option
                                key={stage}
                                value={index}
                            >
                                {stage}
                            </option>
                        ))}
                    </select>


                    <button
                        className="action-btn"
                        onClick={handleUpdateStage}
                    >
                        Update Stage
                    </button>


                </div>


            </div>

            {/*  cus*/}


            <div className="customer-card">
                <h2>Customer Information</h2>

                <div className="customer-grid">

                    <div>
                        <label>Company</label>
                        <p>{customer.company_name}</p>
                    </div>

                    <div>
                        <label>Contact Person</label>
                        <p>{customer.contact_person}</p>
                    </div>

                    <div>
                        <label>Email</label>
                        <p>{customer.email}</p>
                    </div>

                    <div>
                        <label>Phone</label>
                        <p>{customer.phone}</p>
                    </div>

                </div>
            </div>

            <div className="timeline-card">
                <h2>Project Progress</h2>

                <div className="timeline">
                    {stages.map((stage, index) => (
                        <div
                            key={stage}
                            className="timeline-item"
                        >
                            <div
                                className={
                                    index <= currentStage
                                        ? "circle active"
                                        : "circle"
                                }
                            >
                                {index + 1}
                            </div>

                            <span>{stage}</span>
                        </div>
                    ))}
                </div>
            </div>


            <div className="dispatch-info-card">

                <div className="card-header">
                    <h2>Dispatch Information</h2>

                    <button
                        className="mini-btn"
                        onClick={() =>
                            setShowDispatchModal(true)
                        }
                    >
                        Edit Dispatch
                    </button>
                </div>

                <div className="dispatch-grid">

                    <div>
                        <label>Status</label>
                        <p>
                            {project.dispatch_status || "-"}
                        </p>
                    </div>

                    <div>
                        <label>Transporter</label>
                        <p>
                            {project.transporter || "-"}
                        </p>
                    </div>

                    <div>
                        <label>LR Number</label>
                        <p>
                            {project.lr_number || "-"}
                        </p>
                    </div>

                    <div>
                        <label>Vehicle Number</label>
                        <p>
                            {project.vehicle_number || "-"}
                        </p>
                    </div>

                    <div>
                        <label>Dispatch Date</label>
                        <p>
                            {project.dispatch_date
                                ? new Date(
                                    project.dispatch_date
                                ).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )
                                : "-"}
                        </p>
                    </div>

                    <div>
                        <label>Expected Delivery</label>
                        <p>
                            {project.delivery_date
                                ? new Date(
                                    project.delivery_date
                                ).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )
                                : "-"}
                        </p>
                    </div>

                </div>

            </div>

            <div className="details-grid">

                <div className="detail-card">

                    <div className="card-header">

                        <h3>Documents</h3>

                    </div>

                    <input
                        type="file"
                        onChange={(e) =>
                            setSelectedFile(
                                e.target.files[0]
                            )
                        }
                    />

                    <button
                        className="mini-btn"
                        onClick={
                            handleUploadDocument
                        }
                    >
                        Upload
                    </button>

                    {documents.map((doc) => (

                        <div
                            key={doc.id}
                            className="document-item"
                        >

                            <span>
                                📄 {doc.file_name}
                            </span>

                            <div className="document-actions">

                                <a
                                    href={`http://localhost:5001/${doc.file_path}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="download-btn"
                                >
                                    Download
                                </a>

                                <button
                                    className="delete-doc-btn"
                                    onClick={() =>
                                        handleDeleteDocument(
                                            doc.id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

                <div className="detail-card">

                    <div className="card-header">
                        <h3>Recent Updates</h3>
                    </div>

                    <div className="update-input">

                        <input
                            type="text"
                            placeholder="Add Update..."
                            value={newUpdate}
                            onChange={(e) =>
                                setNewUpdate(
                                    e.target.value
                                )
                            }
                        />

                        <button
                            className="mini-btn"
                            onClick={
                                handleAddUpdate
                            }
                        >
                            Add
                        </button>

                    </div>

                    {updates.map((update) => (

                        <div
                            key={update.id}
                            className="update-item"
                        >

                            <div>

                                <p>
                                    {update.update_text}
                                </p>

                                <small>
                                    {new Date(
                                        update.created_at
                                    ).toLocaleDateString()}
                                </small>

                            </div>

                            <button
                                className="delete-doc-btn"
                                onClick={() =>
                                    handleDeleteUpdate(
                                        update.id
                                    )
                                }
                            >
                                Delete
                            </button>

                        </div>

                    ))}

                </div>

            </div>

            <div className="details-grid">

                <div className="detail-card">

                    <div className="card-header">
                        <h3>FAT Reports</h3>

                        <button
                            className="mini-btn"
                            onClick={() =>
                                setShowFatModal(true)
                            }
                        >
                            + Upload FAT
                        </button>
                    </div>

                    {/* <p>
                        FAT Count:
                        {fatReports.length}
                    </p> */}
                    {fatReports.map((report) => (

                        <div
                            key={report.id}
                            className="list-item"
                        >

                            <span>
                                {report.report_name}
                            </span>

                            <div>

                                <a
                                    href={`http://localhost:5001/${report.file_path}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mini-btn"
                                >
                                    View
                                </a>

                                <button
                                    className="delete-btn"
                                    onClick={() =>
                                        deleteFatReport(
                                            report.id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

                <div className="detail-card">

                    <div className="card-header">
                        <h3>Project Notes</h3>

                        <button className="mini-btn">
                            + Add Note
                        </button>
                    </div>

                    <div className="list-item">
                        Customer approved GA drawing.
                    </div>

                    <div className="list-item">
                        FAT planned for next week.
                    </div>

                </div>

            </div>


            {showProjectModal && (
                <div className="modal-overlay">
                    <div className="project-modal">

                        <h2>Edit Project</h2>

                        <input
                            type="text"
                            value={
                                editProject.project_name
                            }
                            onChange={(e) =>
                                setEditProject({
                                    ...editProject,
                                    project_name:
                                        e.target.value,
                                })
                            }
                        />



                        <input
                            type="text"
                            value={
                                editProject.po_number
                            }
                            onChange={(e) =>
                                setEditProject({
                                    ...editProject,
                                    po_number:
                                        e.target.value,
                                })
                            }
                        />
                        <input
                            type="text"
                            value={
                                editProject.project_value
                            }
                            onChange={(e) =>
                                setEditProject({
                                    ...editProject,
                                    project_value:
                                        e.target.value,
                                })
                            }
                        />
                        <input
                            type="date"
                            value={
                                editProject.start_date
                            }
                            onChange={(e) =>
                                setEditProject({
                                    ...editProject,
                                    start_date:
                                        e.target.value,
                                })
                            }
                        />

                        <input
                            type="date"
                            value={
                                editProject.expected_delivery
                            }
                            onChange={(e) =>
                                setEditProject({
                                    ...editProject,
                                    expected_delivery:
                                        e.target.value,
                                })
                            }
                        />

                        <div className="modal-actions">

                            <button
                                className="cancel-btn"
                                onClick={() =>
                                    setShowProjectModal(false)
                                }
                            >
                                Cancel
                            </button>
                            <button
                                className="save-btn"
                                onClick={
                                    handleSaveProject
                                }
                            >
                                Save Project
                            </button>

                        </div>

                    </div>
                </div>
            )}



            {showDispatchModal && (

                <div className="modal-overlay">

                    <div className="project-modal">

                        <h2>
                            Edit Dispatch
                        </h2>

                        <select
                            value={
                                dispatchData.dispatch_status
                            }
                            onChange={(e) =>
                                setDispatchData({
                                    ...dispatchData,
                                    dispatch_status:
                                        e.target.value,
                                })
                            }
                        >
                            <option>
                                Pending
                            </option>

                            <option>
                                Packing Started
                            </option>

                            <option>
                                Packing Completed
                            </option>

                            <option>
                                Ready For Dispatch
                            </option>

                            <option>
                                Dispatched
                            </option>

                            <option>
                                Delivered
                            </option>

                        </select>

                        <input
                            type="text"
                            placeholder="Transporter"
                            value={
                                dispatchData.transporter
                            }
                            onChange={(e) =>
                                setDispatchData({
                                    ...dispatchData,
                                    transporter:
                                        e.target.value,
                                })
                            }
                        />

                        <input
                            type="text"
                            placeholder="LR Number"
                            value={
                                dispatchData.lr_number
                            }
                            onChange={(e) =>
                                setDispatchData({
                                    ...dispatchData,
                                    lr_number:
                                        e.target.value,
                                })
                            }
                        />

                        <input
                            type="text"
                            placeholder="Vehicle Number"
                            value={
                                dispatchData.vehicle_number
                            }
                            onChange={(e) =>
                                setDispatchData({
                                    ...dispatchData,
                                    vehicle_number:
                                        e.target.value,
                                })
                            }
                        />

                        <input
                            type="date"
                            value={
                                dispatchData.dispatch_date
                            }
                            onChange={(e) =>
                                setDispatchData({
                                    ...dispatchData,
                                    dispatch_date:
                                        e.target.value,
                                })
                            }
                        />

                        <input
                            type="date"
                            value={
                                dispatchData.delivery_date
                            }
                            onChange={(e) =>
                                setDispatchData({
                                    ...dispatchData,
                                    delivery_date:
                                        e.target.value,
                                })
                            }
                        />

                        <div className="modal-actions">

                            <button
                                className="cancel-btn"
                                onClick={() =>
                                    setShowDispatchModal(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="save-btn"
                                onClick={
                                    handleSaveDispatch
                                }
                            >
                                Save
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {showFatModal && (

                <div className="modal-overlay">

                    <div className="project-modal">

                        <h2>
                            Upload FAT Report
                        </h2>

                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) =>
                                setFatFile(
                                    e.target.files[0]
                                )
                            }
                        />

                        <div className="modal-actions">

                            <button
                                className="cancel-btn"
                                onClick={() =>
                                    setShowFatModal(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="save-btn"
                                onClick={
                                    handleFatUpload
                                }
                            >
                                Upload
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}