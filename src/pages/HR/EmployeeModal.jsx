import { useEffect, useState } from "react";

import { createEmployee, updateEmployee } from "../../services/employeeService";


import { getDepartments } from "../../services/departmentService";

import { getDesignations } from "../../services/designationService";
import { toast } from "react-toastify";


import "./EmployeeModal.css";

export default function EmployeeModal({

    employee: editEmployee,

    onClose,

    onSuccess

}) {

    const [departments, setDepartments] = useState([]);

    const [designations, setDesignations] = useState([]);

    const [saving, setSaving] = useState(false);

    useEffect(() => {

        loadData();

    }, []);




    const loadData = async () => {

        try {

            const dep = await getDepartments();

            const des = await getDesignations();

            setDepartments(dep);

            setDesignations(des);

        } catch (err) {

            console.error(err);

        }

    };



    const [employee, setEmployee] = useState(
        editEmployee || {
            employee_code: "",

            first_name: "",

            last_name: "",

            email: "",

            phone: "",

            department_id: "",

            designation_id: "",

            joining_date: "",

            salary: ""
        }
    );


    const handleChange = (e) => {

        const { name, value } = e.target;

        setEmployee({

            ...employee,

            [name]: value

        });

    };

    const saveEmployee = async () => {

        if (
            !employee.employee_code ||
            !employee.first_name ||
            !employee.department_id ||
            !employee.designation_id ||
            !employee.joining_date
        ) {

            toast.warning("Please fill all required fields.");

            return;
        }

        try {

            setSaving(true);

            if (editEmployee) {

                await updateEmployee(
                    editEmployee.id,
                    employee
                );

            } else {

                await createEmployee({

                    ...employee,

                    department_id: Number(employee.department_id),

                    designation_id: Number(employee.designation_id),

                    salary: Number(employee.salary)

                });
            }



            onSuccess();

            onClose();

            toast.success("Employee Created Successfully")

        } catch (err) {

            console.error(err);

            toast.warning("Failed to save employee.");

        } finally {

            setSaving(false);

        }

    };
    return (

        <div className="modal-overlay">

            <div className="employee-modal">

                <div className="modal-header">

                    <div>

                        <h2>
                            {editEmployee ? "Edit Employee" : "Add Employee"}
                        </h2>

                        <p>
                            {editEmployee
                                ? "Update employee information"
                                : "Create a new employee profile"}
                        </p>

                    </div>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                {/* <div className="form-grid">

                    <input
                        name="employee_code"
                        placeholder="Employee Code"
                        onChange={handleChange}
                    />



                    <input
                        name="first_name"
                        placeholder="First Name"
                        onChange={handleChange}
                    />
                    <input
                        name="last_name"
                        placeholder="Last Name"
                        onChange={handleChange}
                    />

                    <input
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                    />

                    <input
                        name="phone"
                        placeholder="Phone"
                        onChange={handleChange}
                    />

                    <input
                        type="date"
                        name="joining_date"
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="salary"
                        placeholder="Salary"
                        onChange={handleChange}
                    />

                    <select
                        name="department_id"
                        onChange={handleChange}
                    >

                        <option value="">
                            Select Department
                        </option>

                        {

                            departments.map(dep => (

                                <option

                                    key={dep.id}

                                    value={dep.id}

                                >

                                    {dep.department_name}

                                </option>

                            ))

                        }

                    </select>

                    <select
                        name="designation_id"
                        onChange={handleChange}
                    >

                        <option value="">
                            Select Designation
                        </option>

                        {

                            designations.map(des => (

                                <option

                                    key={des.id}

                                    value={des.id}

                                >

                                    {des.designation_name}

                                </option>

                            ))

                        }

                    </select>

                </div> */}


                <div className="form-grid">

                    <div className="form-group">

                        <label>
                            Employee Code <span>*</span>
                        </label>

                        <input
                            name="employee_code"
                            placeholder="Enter Employee Code"
                            value={employee.employee_code}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            First Name <span>*</span>
                        </label>

                        <input
                            name="first_name"
                            placeholder="Enter First Name"
                            value={employee.first_name}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Last Name
                        </label>

                        <input
                            name="last_name"
                            placeholder="Enter Last Name"
                            value={employee.last_name}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email Address"
                            value={employee.email}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Mobile Number
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter Mobile Number"
                            value={employee.phone}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Department <span>*</span>
                        </label>

                        <select
                            name="department_id"
                            value={employee.department_id}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select Department
                            </option>

                            {departments.map((dep) => (

                                <option
                                    key={dep.id}
                                    value={dep.id}
                                >
                                    {dep.department_name}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="form-group">

                        <label>
                            Designation <span>*</span>
                        </label>

                        <select
                            name="designation_id"
                            value={employee.designation_id}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select Designation
                            </option>

                            {designations.map((des) => (

                                <option
                                    key={des.id}
                                    value={des.id}
                                >
                                    {des.designation_name}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="form-group">

                        <label>
                            Joining Date <span>*</span>
                        </label>

                        <input
                            type="date"
                            name="joining_date"
                            value={employee.joining_date}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Monthly Salary (₹)
                        </label>

                        <input
                            type="number"
                            name="salary"
                            placeholder="Enter Monthly Salary"
                            value={employee.salary}
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
                            onClick={saveEmployee}
                            disabled={saving}
                            className={`save-btn ${saving ? "saving" : ""}`}
                        >
                            {saving ? (
                                <>
                                    <span className="spinner"></span>
                                    Saving...
                                </>
                            ) : (
                                "Save Employee"
                            )}
                        </button>

                </div>

            </div>

        </div>

    );

}