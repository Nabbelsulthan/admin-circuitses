import { useEffect, useState } from "react";
import "./Departments.css";
import { getDepartments } from "../../services/departmentService";

export default function Departments() {

    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [newDepartment, setNewDepartment] = useState({
        name: "",
        description: ""
    });

    const addDepartment = () => {

        if (!newDepartment.name.trim()) return;

        const department = {
            id: Date.now(),
            name: newDepartment.name,
            description: newDepartment.description,
            employees: 0,
            status: "Active"
        };

        setDepartments([...departments, department]);

        setNewDepartment({
            name: "",
            description: ""
        });

    };

    const fetchDepartments = async () => {

        try {

            const data =
                await getDepartments();

            setDepartments(data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchDepartments();

    }, []);

    return (

        <div className="department-page">

            <div className="page-header">

                <div>

                    <h1>Departments</h1>

                    <p>Manage company departments</p>

                </div>

            </div>

            <div className="department-form">

                <input
                    placeholder="Department Name"
                    value={newDepartment.name}
                    onChange={(e) =>
                        setNewDepartment({
                            ...newDepartment,
                            name: e.target.value
                        })
                    }
                />

                <input
                    placeholder="Description"
                    value={newDepartment.description}
                    onChange={(e) =>
                        setNewDepartment({
                            ...newDepartment,
                            description: e.target.value
                        })
                    }
                />

                <button onClick={addDepartment}>
                    Add Department
                </button>

            </div>

            <table className="department-table">

                <thead>

                    <tr>

                        <th>Name</th>

                        <th>Description</th>

                        <th>Employees</th>

                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    {
                        loading ?

                            <tr>

                                <td colSpan="5">

                                    Loading...

                                </td>

                            </tr>

                            :

                            departments.map((department) => (

                                <tr key={department.id}>

                                    <td>

                                        {department.department_name}

                                    </td>

                                    <td>

                                        {department.department_code}

                                    </td>

                                    <td>

                                        {department.description}

                                    </td>

                                    <td>

                                        {

                                            department.status ?

                                                "Active"

                                                :

                                                "Inactive"

                                        }

                                    </td>

                                </tr>

                            ))

                    }

                </tbody>

            </table>

        </div>

    );

}