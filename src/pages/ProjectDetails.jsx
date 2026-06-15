
import "./ProjectDetails.css";
import { useParams } from "react-router-dom";

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

    const currentStage = 3;

    return (
        <div className="project-details">

            <div className="project-top">
                <h1>{project.name}</h1>
                <p>{project.customer}</p>
            </div>

            <div className="details-grid">

                <div className="detail-card">
                    <h3>Current Status</h3>

                    <select className="status-select"
                      defaultValue={project.status}>
                        <option>Design</option>
                        <option>Fabrication</option>
                        <option>Assembly</option>
                        <option>Wiring</option>
                        <option>Testing</option>
                        <option>Dispatch</option>
                        <option>Delivered</option>
                    </select>

                    <button className="action-btn">
                        Update Stage
                    </button>
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

        </div>
    );
}