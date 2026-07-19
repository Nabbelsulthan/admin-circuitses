// import "./HRDashboard.css";

// const stats = [
//     {
//         title: "Employees",
//         value: 0,
//         icon: "👥"
//     },
//     {
//         title: "Present Today",
//         value: 0,
//         icon: "✅"
//     },
//     {
//         title: "On Leave",
//         value: 0,
//         icon: "🌴"
//     },
//     {
//         title: "Departments",
//         value: 0,
//         icon: "🏢"
//     },
//     {
//         title: "Payroll Due",
//         value: "₹0",
//         icon: "💰"
//     },
//     {
//         title: "Pending Requests",
//         value: 0,
//         icon: "📄"
//     }
// ];

// function HRDashboard() {
//     return (
//         <div className="hr-dashboard">

//             <div className="page-header">
//                 <div>
//                     <h1>HR Dashboard</h1>
//                     <p>Employee Management System</p>
//                 </div>
//             </div>

//             <div className="stats-grid">

//                 {stats.map((item, index) => (

//                     <div className="stat-card" key={index}>

//                         <div className="stat-icon">
//                             {item.icon}
//                         </div>

//                         <div>

//                             <h2>{item.value}</h2>

//                             <span>{item.title}</span>

//                         </div>

//                     </div>

//                 ))}

//             </div>

//         </div>
//     );
// }

// export default HRDashboard;




import "./HRDashboard.css";

import GroupsIcon from "@mui/icons-material/Groups";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import PaymentsIcon from "@mui/icons-material/Payments";
import AssignmentIcon from "@mui/icons-material/Assignment";

const stats = [
    {
        title: "Employees",
        value: 0,
        icon: <GroupsIcon />
    },
    {
        title: "Present Today",
        value: 0,
        icon: <FactCheckIcon />
    },
    {
        title: "Absent",
        value: 0,
        icon: <EventBusyIcon />
    },
    {
        title: "On Leave",
        value: 0,
        icon: <BeachAccessIcon />
    },
    {
        title: "Payroll Due",
        value: "₹0",
        icon: <PaymentsIcon />
    },
    {
        title: "Pending Requests",
        value: 0,
        icon: <AssignmentIcon />
    }
];

export default function HRDashboard() {

    return (

        <div className="hr-dashboard">

            <div className="dashboard-header">

                <div>

                    <h1>HR Dashboard</h1>

                    <p>
                        Welcome to CES Employee Management
                    </p>

                </div>

            </div>

            <div className="stats-grid">

                {

                    stats.map((card, index) => (

                        <div
                            key={index}
                            className="stat-card"
                        >

                            <div className="stat-icon">

                                {card.icon}

                            </div>

                            <div>

                                <h2>{card.value}</h2>

                                <p>{card.title}</p>

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}