import { useEffect, useState } from "react";

import "./Attendance.css";

import AttendanceModal from "./AttendanceModal";

import {

    getAttendance

} from "../../services/attendanceService";

export default function Attendance() {

    const [attendance, setAttendance] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const loadAttendance = async () => {

        try {

            const data = await getAttendance();

            setAttendance(data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadAttendance();

    }, []);

    return (

        <div className="attendance-page">

            <div className="attendance-header">

                <div>

                    <h1>Attendance</h1>

                    <p>

                        Track employee attendance

                    </p>

                </div>

                <button
                    className="mark-btn"
                    onClick={() => setShowModal(true)}
                >

                    + Mark Attendance

                </button>

            </div>

            <div className="attendance-summary">

                <div className="summary-card blue">

                    <h2>

                        {attendance.length}

                    </h2>

                    <span>Total Records</span>

                </div>

                <div className="summary-card green">

                    <h2>

                        {

                            attendance.filter(

                                a => a.status === "Present"

                            ).length

                        }

                    </h2>

                    <span>Present</span>

                </div>

                <div className="summary-card orange">

                    <h2>

                        {

                            attendance.filter(

                                a => a.status === "Late"

                            ).length

                        }

                    </h2>

                    <span>Late</span>

                </div>

                <div className="summary-card red">

                    <h2>

                        {

                            attendance.filter(

                                a => a.status === "Absent"

                            ).length

                        }

                    </h2>

                    <span>Absent</span>

                </div>

            </div>

            <div className="attendance-table-card">

                <table className="attendance-table">

                    <thead>

                        <tr>

                            <th>Employee</th>

                            <th>Department</th>

                            <th>Date</th>

                            <th>Check In</th>

                            <th>Check Out</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ?

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="empty-row"
                                    >

                                        Loading...

                                    </td>

                                </tr>

                                :

                                attendance.length === 0 ?

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="empty-row"
                                        >

                                            No Attendance Found

                                        </td>

                                    </tr>

                                    :

                                    attendance.map((row) => (

                                        <tr key={row.id}>

                                            <td>

                                                {

                                                    row.employees

                                                        ?.employee_code

                                                }

                                                <br />

                                                <strong>

                                                    {

                                                        row.employees

                                                            ?.first_name

                                                    }{" "}

                                                    {

                                                        row.employees

                                                            ?.last_name

                                                    }

                                                </strong>

                                            </td>

                                            <td>

                                                {

                                                    row.employees

                                                        ?.departments

                                                        ?.department_name

                                                }

                                            </td>

                                            <td>

                                                {

                                                    row.attendance_date

                                                }

                                            </td>

                                            <td>

                                                {

                                                    row.check_in || "-"

                                                }

                                            </td>

                                            <td>

                                                {

                                                    row.check_out || "-"

                                                }

                                            </td>

                                            <td>

                                                <span

                                                    className={`status ${row.status.toLowerCase()}`}

                                                >

                                                    {

                                                        row.status

                                                    }

                                                </span>

                                            </td>

                                        </tr>

                                    ))

                        }

                    </tbody>

                </table>

            </div>


            {
                showModal && (

                    <AttendanceModal

                        onClose={() =>

                            setShowModal(false)

                        }

                        onSuccess={() => {

                            loadAttendance();

                            setShowModal(false);

                        }}

                    />

                )
            }

        </div>

    );

}