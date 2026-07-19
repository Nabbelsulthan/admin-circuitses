import { useEffect, useState } from "react";

import {
    getEmployees
} from "../../services/employeeService";

import {
    createAttendance
} from "../../services/attendanceService";

import { toast } from "react-toastify";

import "./AttendanceModal.css";

export default function AttendanceModal({

    onClose,

    onSuccess

}) {

    const [employees, setEmployees] = useState([]);

    const [saving, setSaving] = useState(false);

    const [attendance, setAttendance] = useState({

        employee_id: "",

        attendance_date:
            new Date().toISOString().split("T")[0],

        department_name: "",

        check_in: "",

        check_out: "",

        status: "Present",

        remarks: ""

    });
    useEffect(() => {

        loadEmployees();

    }, []);

    const loadEmployees = async () => {

        try {

            const data = await getEmployees();

            setEmployees(data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name === "employee_id") {

            const emp = employees.find(

                employee => employee.id === Number(value)

            );

            setAttendance({

                ...attendance,

                employee_id: value,

                department_name:
                    emp?.departments?.department_name || ""

            });

            return;

        }

        setAttendance({

            ...attendance,

            [name]: value

        });

    };
    const saveAttendance = async () => {

        if (!attendance.employee_id) {

            toast.warning("Select Employee");

            return;

        }

        try {

            setSaving(true);

            const payload = {

                employee_id: Number(attendance.employee_id),

                attendance_date: attendance.attendance_date,

                check_in: attendance.check_in,

                check_out: attendance.check_out,

                status: attendance.status,

                remarks: attendance.remarks

            };

            await createAttendance(payload);

            toast.success(
                "Attendance Saved"
            );

            onSuccess();

            onClose();

        }

        catch (err) {

            console.log(err);

            toast.error(
                "Failed to Save Attendance"
            );

        }

        finally {

            setSaving(false);

        }

    };

    return (

        <div className="modal-overlay">

            <div className="attendance-modal">

                <div className="modal-header">

                    <div>

                        <h2>

                            Mark Attendance

                        </h2>

                        <p>

                            Create today's attendance

                        </p>

                    </div>

                    <button

                        className="close-btn"

                        onClick={onClose}

                    >

                        ✕

                    </button>

                </div>

                <div className="form-grid">

                    <div className="form-group">

                        <label>

                            Employee

                        </label>

                        <select

                            name="employee_id"

                            value={attendance.employee_id}

                            onChange={handleChange}

                        >

                            <option value="">

                                Select Employee

                            </option>

                            {

                                employees.map(emp => (

                                    <option

                                        key={emp.id}

                                        value={emp.id}

                                    >

                                        {emp.employee_code}

                                        {" - "}

                                        {emp.first_name}

                                        {" "}

                                        {emp.last_name}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                    <div className="form-group">

                        <label>

                            Department

                        </label>

                        <input

                            value={attendance.department_name}

                            readOnly

                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Date

                        </label>

                        <input

                            type="date"

                            name="attendance_date"

                            value={attendance.attendance_date}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Check In

                        </label>

                        <input

                            type="time"

                            name="check_in"

                            value={attendance.check_in}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Check Out

                        </label>

                        <input

                            type="time"

                            name="check_out"

                            value={attendance.check_out}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Status

                        </label>

                        <select

                            name="status"

                            value={attendance.status}

                            onChange={handleChange}

                        >

                            <option>

                                Present

                            </option>

                            <option>

                                Late

                            </option>

                            <option>

                                Absent

                            </option>

                            <option>

                                Half Day

                            </option>

                            <option>

                                On Leave

                            </option>

                        </select>

                    </div>

                    <div className="form-group full-width">

                        <label>

                            Remarks

                        </label>

                        <textarea

                            name="remarks"

                            rows="3"

                            value={attendance.remarks}

                            onChange={handleChange}

                        />

                    </div>

                </div>

                <div className="modal-footer">

                    <button

                        className="cancel-btn"

                        onClick={onClose}

                    >

                        Cancel

                    </button>

                    <button

                        className="save-btn"

                        onClick={saveAttendance}

                        disabled={saving}

                    >

                        {

                            saving ?

                                "Saving..."

                                :

                                "Save Attendance"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}