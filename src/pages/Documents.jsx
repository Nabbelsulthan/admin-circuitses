import { useState } from "react";
import "./Documents.css";

export default function Documents() {
  const [documents] = useState([
    {
      id: 1,
      name: "GA Drawing.pdf",
      project: "MCC Panel",
      type: "Drawing",
    },
    {
      id: 2,
      name: "FAT Report.pdf",
      project: "MCC Panel",
      type: "FAT Report",
    },
  ]);

  return (
    <div className="documents-page">
      <div className="documents-header">
        <div>
          <h1>Documents</h1>
          <p>Manage project documents</p>
        </div>

        <button className="upload-btn">
          Upload Document
        </button>
      </div>

      <div className="documents-table-card">
        <table className="documents-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Project</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>{doc.project}</td>
                <td>{doc.type}</td>

                <td>
                  <button className="download-btn">
                    Download
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