
import "./ProjectDetails.css";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function ProjectDetails() {
    const { id } = useParams();

    const project = {
        id,
        name: "MCC Panel",
        customer: "ABC Industries",
        status: "Wiring",
        dispatch: "Packing Completed",
    };

    const documents = [
        "GA Drawing.pdf",
        "FAT Report.pdf",
        "SLD.pdf",
    ];

    const updates = [
        "Wiring Completed",
        "FAT Scheduled",
    ];

    const stages = [
        "Design",
        "Fabrication",
        "Assembly",
        "Wiring",
        "Testing",
        "Dispatch",
        "Delivered",
    ];

    // const currentStage = 3;

    const [currentStage, setCurrentStage] =
        useState(3);

    const [selectedStage, setSelectedStage] =
        useState(3);

    const [showProjectModal, setShowProjectModal] =
        useState(false);

    return (
        <div className="project-details">

            <div className="project-top">
                <h1>{project.name}</h1>
                <p>{project.customer}</p>
            </div>

            {/* details of projects  */}


            <div className="project-info-card">

                <div className="card-header">
                    <h2>Project Information</h2>

                    <button
                        className="mini-btn"
                        onClick={() =>
                            setShowProjectModal(true)
                        }
                    >
                        Edit Project
                    </button>
                </div>

                <div className="project-info-grid">

                    <div>
                        <label>Project Name</label>
                        <p>MCC Panel</p>
                    </div>

                    <div>
                        <label>Customer</label>
                        <p>ABC Industries</p>
                    </div>

                    <div>
                        <label>PO Number</label>
                        <p>CES-2026-001</p>
                    </div>

                    <div>
                        <label>Project Value</label>
                        <p>₹ 8,50,000</p>
                    </div>

                    <div>
                        <label>Start Date</label>
                        <p>15 Jun 2026</p>
                    </div>

                    <div>
                        <label>Expected Delivery</label>
                        <p>30 Jul 2026</p>
                    </div>

                </div>

            </div>
            <div className="details-grid">

                <div className="detail-card">
                    <h3>Current Status</h3>

                    {/* <select className="status-select"
                        defaultValue={project.status}>



                        <option>Design</option>
                        <option>Fabrication</option>
                        <option>Assembly</option>
                        <option>Wiring</option>
                        <option>Testing</option>
                        <option>Dispatch</option>
                        <option>Delivered</option>
                    </select> */}

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
                        onClick={() =>
                            setCurrentStage(selectedStage)
                        }
                    >
                        Update Stage
                    </button>

                    {/* <button className="action-btn">
                        Update Stage
                    </button> */}
                    {/* <p>{project.status}</p> */}
                </div>

                <div className="detail-card">
                    <h3>Dispatch Status</h3>

                    <select className="status-select"
                        defaultValue={project.dispatch}>
                        <option>Pending</option>
                        <option>Packing Started</option>
                        <option>Packing Completed</option>
                        <option>Ready For Dispatch</option>
                        <option>Dispatched</option>
                        <option>Delivered</option>
                    </select>

                    <button className="action-btn">
                        Update Dispatch
                    </button>
                    {/* <p>{project.dispatch}</p> */}
                </div>

            </div>

            {/*  cus*/}


            <div className="customer-card">
                <h2>Customer Information</h2>

                <div className="customer-grid">

                    <div>
                        <label>Company</label>
                        <p>ABC Industries</p>
                    </div>

                    <div>
                        <label>Contact Person</label>
                        <p>Arun Kumar</p>
                    </div>

                    <div>
                        <label>Email</label>
                        <p>arun@abc.com</p>
                    </div>

                    <div>
                        <label>Phone</label>
                        <p>9876543210</p>
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

                    <button className="mini-btn">
                        Edit Dispatch
                    </button>
                </div>

                <div className="dispatch-grid">

                    <div>
                        <label>Status</label>
                        <p>Packing Completed</p>
                    </div>

                    <div>
                        <label>Transporter</label>
                        <p>ABC Logistics</p>
                    </div>

                    <div>
                        <label>LR Number</label>
                        <p>LR123456</p>
                    </div>

                    <div>
                        <label>Vehicle Number</label>
                        <p>TN 39 AB 1234</p>
                    </div>

                    <div>
                        <label>Dispatch Date</label>
                        <p>15 Jun 2026</p>
                    </div>

                    <div>
                        <label>Expected Delivery</label>
                        <p>18 Jun 2026</p>
                    </div>

                </div>

            </div>

            <div className="details-grid">

                <div className="detail-card">
                    <div className="card-header">
                        <h3>Documents</h3>

                        <button className="mini-btn">
                            + Upload
                        </button>
                    </div>

                    {documents.map((doc) => (
                        <div
                            key={doc}
                            className="list-item"
                        >
                            {doc}
                        </div>
                    ))}
                </div>

                <div className="detail-card">
                    <div className="card-header">
                        <h3>Recent Updates</h3>

                        <button className="mini-btn">
                            + Add Update
                        </button>
                    </div>

                    {updates.map((update) => (
                        <div
                            key={update}
                            className="list-item"
                        >
                            {update}
                        </div>
                    ))}
                </div>

            </div>

            <div className="details-grid">

                <div className="detail-card">

                    <div className="card-header">
                        <h3>FAT Reports</h3>

                        <button className="mini-btn">
                            + Upload FAT
                        </button>
                    </div>

                    <div className="list-item">
                        FAT Report Rev 01.pdf
                    </div>

                    <div className="list-item">
                        FAT Checklist.pdf
                    </div>

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
                            defaultValue="MCC Panel"
                            placeholder="Project Name"
                        />

                        <input
                            type="text"
                            defaultValue="ABC Industries"
                            placeholder="Customer"
                        />

                        <input
                            type="text"
                            defaultValue="CES-2026-001"
                            placeholder="PO Number"
                        />

                        <input
                            type="text"
                            defaultValue="₹ 8,50,000"
                            placeholder="Project Value"
                        />

                        <input
                            type="date"
                        />

                        <input
                            type="date"
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

                            <button className="save-btn">
                                Save Project
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}