
import "./HR.css";
import { useNavigate } from "react-router-dom";

import GroupsIcon from "@mui/icons-material/Groups";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import PaymentsIcon from "@mui/icons-material/Payments";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BadgeIcon from "@mui/icons-material/Badge";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function HR() {

    const navigate = useNavigate();

    const modules = [
        {
            title: "Employees",
            description: "Manage employee records, profiles and employment details.",
            icon: <GroupsIcon />,
            route: "/hr/employees"
        },
        {
            title: "Attendance",
            description: "Daily attendance, shifts and work hours.",
            icon: <FactCheckIcon />,
            route: "/hr/attendance"
        },
        {
            title: "Leave Management",
            description: "Approve leave requests and manage balances.",
            icon: <BeachAccessIcon />,
            route: "/hr/leave"
        },
        {
            title: "Payroll",
            description: "Salary processing, payslips and deductions.",
            icon: <PaymentsIcon />,
            route: "/hr/payroll"
        },
        {
            title: "Departments",
            description: "Manage company departments.",
            icon: <ApartmentIcon />,
            route: "/hr/departments"
        },
        {
            title: "Designations",
            description: "Manage employee roles and designations.",
            icon: <BadgeIcon />,
            route: "/hr/designations"
        }
    ];

    return (

        <div className="hr-page">

            <div className="page-header">

                <div>

                    <h1>Human Resources</h1>

                    <p>
                        Employee, Attendance, Leave & Payroll Management
                    </p>

                </div>

            </div>

            <div className="hr-grid">

                {modules.map((module, index) => (

                    <div
                        key={index}
                        className="hr-card"
                        onClick={() => navigate(module.route)}
                    >

                        <div className="card-top">

                            <div className="card-icon">

                                {module.icon}

                            </div>

                            <ChevronRightIcon className="arrow-icon" />

                        </div>

                        <h2>{module.title}</h2>

                        <p>{module.description}</p>

                    </div>

                ))}

            </div>

        </div>

    );

}