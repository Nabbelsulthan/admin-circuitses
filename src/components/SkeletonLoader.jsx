


import "./SkeletonLoader.css";

// const loadingMessages = [
//     "Preparing your dashboard...",
//     "Talking to the server ☕",
//     "Counting projects...",
//     "Checking the latest updates...",
//     "Organizing electrical panels ⚡",
//     "Almost there...",
//     "Making everything beautiful ✨",
//     "Charging the control panels 🔋",
//     "Summoning the data..."
// ];


// const loadingMessages = [
//     "⚡ Powering up CES Connect...",
//     "🔌 Energizing your dashboard...",
//     "📊 Gathering project insights...",
//     "🏗️ Building your workspace...",
//     "📂 Organizing your projects...",
//     "👷 Calling the engineers...",
//     "🚚 Tracking dispatch updates...",
//     "📄 Loading your documents...",
//     "☕ One sip of coffee and we're ready...",
//     "✨ Almost there..."
// ];

const loadingMessages = [
    "⚡ Powering up CES Connect",
    "📊 Preparing your dashboard",
    "🏗️ Organizing your projects",
    "👥 Gathering customer information",
    "🚚 Checking dispatch status",
    "📄 Loading project documents",
    "⚙️ Synchronizing project data",
    "🔌 Connecting to the server",
    "☕ Brewing fresh data",
    "🚀 Almost ready",
    "💡 Turning ideas into panels",
    "🔍 Looking for your latest updates",
    "🛠️ Calibrating the control panels",
    "📦 Unpacking your workspace",
    "🎯 Just a moment"
];

export default function SkeletonLoader({
    type = "dashboard",
    rows = 6,
    columns = 5,
    cards = 6,
    activities = 3,
}) {

    const message =
        loadingMessages[
        Math.floor(
            Math.random() *
            loadingMessages.length
        )
        ];

    if (type === "table") {

        const widths = [
            "180px",
            "150px",
            "220px",
            "130px",
            "150px",
            "100px",
        ];

        return (
            <>
                <tr>
                    <td
                        colSpan={columns}
                        className="loading-message-row"
                    >
                        {message}
                    </td>
                </tr>

                {Array.from({ length: rows }).map((_, row) => (

                    <tr key={row}>

                        {Array.from({ length: columns }).map((_, col) => (

                            <td key={col}>

                                <div
                                    className="table-skeleton"
                                    style={{
                                        width:
                                            widths[col] || "120px",
                                        height:
                                            col === columns - 1
                                                ? "34px"
                                                : "16px",
                                    }}
                                />

                            </td>

                        ))}

                    </tr>

                ))}
            </>
        );

    }

    return (

        <div className="dashboard loading-dashboard">

            <div className="loading-message">
                {message}
            </div>

            <div className="dashboard-header">

                <div>

                    <div className="skeleton title"></div>

                    <div className="skeleton subtitle"></div>

                </div>

            </div>

            <div className="stats-grid">

                {Array.from({
                    length: cards,
                }).map((_, index) => (

                    <div
                        className="stat-card"
                        key={index}
                    >

                        <div className="skeleton card-title"></div>

                        <div className="skeleton card-number"></div>

                    </div>

                ))}

            </div>

            <div className="recent-section">

                <div className="skeleton section-title"></div>

                {Array.from({
                    length: activities,
                }).map((_, index) => (

                    <div
                        className="activity-card"
                        key={index}
                    >

                        <div className="skeleton activity-line"></div>

                    </div>

                ))}

            </div>

        </div>

    );

}