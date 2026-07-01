
import "./ProjectDetails.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { API_URL } from "../config";


const stages = [
    "Design",
    "Fabrication",
    "Assembly",
    "Wiring",
    "Testing",
    "Dispatch",
    "Delivered",
];

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


    const [showGalleryModal,
        setShowGalleryModal] =
        useState(false);

    const [selectedImage,
        setSelectedImage] =
        useState(null);

    const [previewImage,
        setPreviewImage] =
        useState(null);

    const [caption,
        setCaption] =
        useState("");


    const [gallery, setGallery] =
        useState([]);



    const handleUpdateStage = async () => {

        try {

            await fetch(
                `${API_URL}/api/projects/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({

                        project_name: project.project_name,

                        po_number: project.po_number,

                        project_value: project.project_value,

                        start_date:
                            project.start_date?.split("T")[0],

                        expected_delivery:
                            project.expected_delivery?.split("T")[0],

                        status:
                            stages[selectedStage],

                        dispatch_status:
                            project.dispatch_status,

                        transporter:
                            project.transporter,

                        lr_number:
                            project.lr_number,

                        vehicle_number:
                            project.vehicle_number,

                        dispatch_date:
                            project.dispatch_date
                                ? project.dispatch_date.split("T")[0]
                                : null,

                        delivery_date:
                            project.delivery_date
                                ? project.delivery_date.split("T")[0]
                                : null,

                        panel_type:
                            project.panel_type,

                        project_engineer:
                            project.project_engineer,

                        completion_percentage:
                            completionMap[
                            stages[selectedStage]
                            ] || 0,

                    }),
                }
            );

            const response =
                await fetch(
                    `${API_URL}/api/projects/${id}`
                );

            const updatedProject =
                await response.json();

            setProject(updatedProject);

            // alert(
            //     "Stage Updated"
            // );

            toast.success(
                "Project stage updated successfully"
            );

        } catch (error) {

            console.error(error);

        }

    };


    useEffect(() => {

        fetch(
            `${API_URL}/api/projects/${id}`
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
            `${API_URL}/api/documents/${id}`
        )
            .then((res) => res.json())
            .then((data) => {
                setDocuments(data);
            });


        fetch(
            `${API_URL}/api/updates/${id}`
        )
            .then((res) => res.json())
            .then((data) => {
                setUpdates(data);
            });


        fetch(
            `${API_URL}/api/fat-reports/${id}`
        )
            .then((res) => res.json())
            .then((data) => {

                console.log(
                    "FAT Reports:",
                    data
                );

                setFatReports(data);

            });

        fetch(
            `${API_URL}/api/gallery/${id}`
        )
            .then((res) => res.json())
            .then((data) => {
                setGallery(data);
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
            `${API_URL}/api/customers/${project.customer_id}`
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

                toast.warning(
                    "Please select a file"
                );
                // alert(
                //     "Please select a file"
                // );
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
                    `${API_URL}/api/documents`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                const response =
                    await fetch(
                        `${API_URL}/api/documents/${id}`
                    );

                const docs =
                    await response.json();

                setDocuments(docs);

                setSelectedFile(null);

                toast.success(
                    "Document uploaded successfully"
                );

                // alert(
                //     "Document Uploaded"
                // );

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
                    `${API_URL}/api/documents/${documentId}`,
                    {
                        method: "DELETE",
                    }
                );

                const response =
                    await fetch(
                        `${API_URL}/api/documents/${id}`
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
                    `${API_URL}/api/updates`,
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
                        `${API_URL}/api/updates/${id}`
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
                    `${API_URL}/api/updates/${updateId}`,
                    {
                        method: "DELETE",
                    }
                );

                const response =
                    await fetch(
                        `${API_URL}/api/updates/${id}`
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
                    `${API_URL}/api/projects/${id}`,
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

                            panel_type:
                                project.panel_type,

                            project_engineer:
                                project.project_engineer,

                            completion_percentage:
                                project.completion_percentage,

                            ...dispatchData,

                        }),
                    }
                );

                const response =
                    await fetch(
                        `${API_URL}/api/projects/${id}`
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

                // alert(
                //     "Dispatch Updated"
                // );

                toast.success("Dispatch details updated successfully");

            } catch (error) {

                console.error(error);

            }

        };



    const handleSaveProject =
        async () => {

            try {

                const response =
                    await fetch(
                        `${API_URL}/api/projects/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body: JSON.stringify({
                                ...project,
                                ...editProject,

                                project_value:
                                    (
                                        editProject.project_value ??
                                        project.project_value
                                    )
                                        ?.toString()
                                        .replace(/,/g, ""),

                                start_date:
                                    editProject.start_date ||
                                    project.start_date ||
                                    null,

                                expected_delivery:
                                    editProject.expected_delivery ||
                                    project.expected_delivery ||
                                    null,
                            }),
                        }
                    );
                await response.json();

                const refreshedResponse =
                    await fetch(
                        `${API_URL}/api/projects/${id}`
                    );

                const refreshedProject =
                    await refreshedResponse.json();

                setProject(refreshedProject);

                setShowProjectModal(false);

                toast.success("Project updated successfully");

                // alert(
                //     "Project Updated"
                // );

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
                    `${API_URL}/api/fat-reports`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                const response =
                    await fetch(
                        `${API_URL}/api/fat-reports/${id}`
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
                `${API_URL}/api/fat-reports/${reportId}`,
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

    const handleUploadImage =
        async () => {

            try {

                if (!selectedImage) {

                    toast.warning(
                        "Please choose an image to upload"
                    );

                    // alert(
                    //     "Please select an image"
                    // );

                    return;

                }

                if (!caption) {

                    toast.warning("Please select a stage");

                    // alert(
                    //     "Please select a stage"
                    // );

                    return;

                }

                const formData =
                    new FormData();

                formData.append(
                    "project_id",
                    id
                );

                formData.append(
                    "caption",
                    caption
                );

                formData.append(
                    "image",
                    selectedImage
                );

                const response =
                    await fetch(
                        `${API_URL}/api/gallery`,
                        {
                            method: "POST",
                            body: formData,
                        }
                    );

                if (!response.ok) {

                    throw new Error(
                        "Upload Failed"
                    );

                }

                await response.json();

                toast.success("Image uploaded successfully");

                // alert(
                //     "Image Uploaded Successfully"
                // );

                setShowGalleryModal(
                    false
                );

                setSelectedImage(
                    null
                );

                setCaption("");

                loadGallery();

            } catch (error) {

                console.error(error);

                toast.error(
                    "Failed To Upload Image"
                )

                // alert(
                //     "Failed To Upload Image"
                // );

            }

        };

    const loadGallery =
        async () => {

            const response =
                await fetch(
                    `${API_URL}/api/gallery/${id}`
                );

            const data =
                await response.json();

            setGallery(data);

        };

    const handleDeleteImage =
        async (imageId) => {

            const confirmDelete =
                window.confirm(
                    "Delete this image?"
                );

            if (!confirmDelete)
                return;

            try {

                await fetch(
                    `${API_URL}/api/gallery/${imageId}`,
                    {
                        method: "DELETE",
                    }
                );

                loadGallery();

            } catch (error) {

                console.error(error);

            }

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
                                    href={`${API_URL}/${doc.file_path}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mini-btn"
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
                                    href={`${API_URL}/${report.file_path}`}
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

                <div className="detail-card">

                    <div className="card-header">

                        <h3>
                            Progress Gallery
                        </h3>

                        <button
                            className="mini-btn"
                            onClick={() =>
                                setShowGalleryModal(true)
                            }
                        >
                            + Upload Image
                        </button>

                    </div>

                    {gallery.length === 0 ? (

                        <p>
                            No Images Uploaded
                        </p>

                    ) : (

                        gallery.map((image) => (

                            <div
                                key={image.id}
                                className="gallery-item"
                            >

                                <img
                                    src={`${API_URL}/${image.image_path}`}
                                    alt={image.caption}
                                    className="gallery-preview"
                                    onClick={() =>
                                        setPreviewImage(`${API_URL}/${image.image_path}`)
                                    }
                                />ƒ

                                <p>
                                    {image.caption}
                                </p>

                                <button
                                    className="delete-image-btn"
                                    onClick={() =>
                                        handleDeleteImage(
                                            image.id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        ))

                    )}

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
                            type="number"
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

            {showGalleryModal && (

                <div className="modal-overlay">

                    <div className="project-modal">

                        <h2>
                            Upload Progress Image
                        </h2>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setSelectedImage(
                                    e.target.files[0]
                                )
                            }
                        />

                        <select
                            value={caption}
                            onChange={(e) =>
                                setCaption(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Select Stage
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

                        <div className="modal-actions">

                            <button
                                className="cancel-btn"
                                onClick={() =>
                                    setShowGalleryModal(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="save-btn"
                                onClick={
                                    handleUploadImage
                                }
                            >
                                Upload
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {previewImage && (

                <div
                    className="image-modal"
                    onClick={() =>
                        setPreviewImage(null)
                    }
                >

                    <img
                        src={previewImage}
                        alt="Preview"
                        className="image-preview"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    />

                </div>

            )}

        </div>
    );
}