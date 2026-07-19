
import { useEffect, useState } from "react";
import {
    getEmployees,
    deleteEmployee
} from "../../services/employeeService";

import EmployeeModal from "./EmployeeModal";
import { toast } from "react-toastify";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import "./Employee.css";

export default function Employees() {

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [deletingId, setDeletingId] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const loadEmployees = async () => {

        try {

            const data = await getEmployees();

            setEmployees(data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadEmployees();

    }, []);

    const handleEdit = (employee) => {

        setSelectedEmployee(employee);

        setShowModal(true);

    };

    const handleDelete = (employee) => {

        setEmployeeToDelete(employee);

        setShowDeleteModal(true);

    };

    const confirmDelete = async () => {

        try {

            setDeletingId(employeeToDelete.id);

            await deleteEmployee(employeeToDelete.id);

            toast.success("Employee deleted successfully");

            loadEmployees();

        } catch (err) {

            console.error(err);

            toast.error("Failed to delete employee.");

        } finally {

            setDeletingId(null);

            setShowDeleteModal(false);

            setEmployeeToDelete(null);

        }

    };

    const activeEmployees =
        employees.filter(emp => emp.status).length;

    const inactiveEmployees =
        employees.length - activeEmployees;

    return (

        <div className="employee-page">

            {/* Header */}

            <div className="employee-header">

                <div>

                    <h1>Employees</h1>

                    <p>
                        Manage employee records and information
                    </p>

                </div>

                <button
                    className="add-btn"
                    onClick={() => setShowModal(true)}
                >

                    <AddIcon />

                    Add Employee

                </button>

            </div>

            {/* Summary Cards */}

            <div className="summary-grid">

                <div className="summary-card">

                    <div className="summary-icon blue">

                        <GroupsIcon />

                    </div>

                    <div>

                        <h2>{employees.length}</h2>

                        <p>Total Employees</p>

                    </div>

                </div>

                <div className="summary-card">

                    <div className="summary-icon green">

                        <CheckCircleIcon />

                    </div>

                    <div>

                        <h2>{activeEmployees}</h2>

                        <p>Active</p>

                    </div>

                </div>

                <div className="summary-card">

                    <div className="summary-icon red">

                        <CancelIcon />

                    </div>

                    <div>

                        <h2>{inactiveEmployees}</h2>

                        <p>Inactive</p>

                    </div>

                </div>

            </div>

            {/* Search */}

            <div className="toolbar">

                <div className="search-box">

                    <SearchIcon />

                    <input
                        type="text"
                        placeholder="Search employees..."
                    />

                </div>

            </div>

            {/* Table */}

            <div className="table-card">

                <table className="employee-table">

                    <thead>

                        <tr>

                            <th>Code</th>

                            <th>Employee</th>

                            <th>Department</th>

                            <th>Designation</th>

                            <th>Status</th>

                            <th width="170">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ?

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="loading"
                                    >

                                        Loading Employees...

                                    </td>

                                </tr>

                                :

                                employees.length === 0 ?

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="loading"
                                        >

                                            No Employees Found

                                        </td>

                                    </tr>

                                    :

                                    employees.map(emp => (

                                        <tr key={emp.id}>

                                            <td>

                                                <strong>

                                                    {emp.employee_code}

                                                </strong>

                                            </td>

                                            <td>

                                                <div className="employee-info">

                                                    <div className="avatar">

                                                        {

                                                            emp.first_name
                                                                ?.charAt(0)
                                                                .toUpperCase()

                                                        }

                                                    </div>

                                                    <div>

                                                        <h4>

                                                            {emp.first_name}{" "}

                                                            {emp.last_name}

                                                        </h4>

                                                        <span>

                                                            {emp.email}

                                                        </span>

                                                    </div>

                                                </div>

                                            </td>

                                            <td>

                                                {

                                                    emp.departments
                                                        ?.department_name || "-"

                                                }

                                            </td>

                                            <td>

                                                {

                                                    emp.designations
                                                        ?.designation_name || "-"

                                                }

                                            </td>

                                            <td>

                                                {

                                                    emp.status ?

                                                        <span className="status-badge active">

                                                            Active

                                                        </span>

                                                        :

                                                        <span className="status-badge inactive">

                                                            Inactive

                                                        </span>

                                                }

                                            </td>

                                            <td>

                                                <button

                                                    className="icon-btn edit"

                                                    onClick={() => handleEdit(emp)}

                                                >

                                                    <EditIcon />

                                                </button>

                                                <button

                                                    className="icon-btn delete"

                                                    onClick={() => handleDelete(emp)}

                                                    disabled={deletingId === emp.id}

                                                >

                                                    {

                                                        deletingId === emp.id ?

                                                            "..."

                                                            :

                                                            <DeleteIcon />

                                                    }

                                                </button>

                                            </td>

                                        </tr>

                                    ))

                        }

                    </tbody>

                </table>

            </div>

            {

                showModal && (

                    <EmployeeModal

                        employee={selectedEmployee}

                        onClose={() => {

                            setShowModal(false);

                            setSelectedEmployee(null);

                        }}

                        onSuccess={() => {

                            loadEmployees();

                            setShowModal(false);

                            setSelectedEmployee(null);

                        }}

                    />

                )

            }


            {
                showDeleteModal && (

                    <div className="modal-overlay">

                        <div className="delete-modal">

                            <div className="delete-icon">

                                🗑️

                            </div>

                            <h2>

                                Delete Employee

                            </h2>

                            <p>

                                Are you sure you want to delete

                                <strong>

                                    {" "}
                                    {employeeToDelete?.first_name}{" "}
                                    {employeeToDelete?.last_name}

                                </strong>

                                ?

                            </p>

                            <span>

                                This action cannot be undone.

                            </span>

                            <div className="delete-footer">

                                <button

                                    className="cancel-btn"

                                    onClick={() => {

                                        setShowDeleteModal(false);

                                        setEmployeeToDelete(null);

                                    }}

                                >

                                    Cancel

                                </button>

                                <button

                                    className="delete-btn"

                                    onClick={confirmDelete}

                                    disabled={deletingId}

                                >

                                    {

                                        deletingId ?

                                            "Deleting..."

                                            :

                                            "Delete Employee"

                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>

    );

}