// import React, { useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import {Chart as ChartJS , BarElement , CategoryScale,LinearScale,Tooltip,Legend} from 'chart.js'
// ChartJS.register(
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend
// )

// const Dashboard = () => {
//   const [totalUsers,setTotalUsers] = useState(0);
//   const [totalStations,setTotalStations] = useState(0);
//   const [totalBooking , setTotalBooking] = useState(0);
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [totalFeedback , setTotalFeedback] = useState(0);
//   const [loading,setLoading] = useState(true);
//   const FetchUser = async() =>{
//     const  res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/user/total")
//     const data = await res.json()
//     console.log(data)
//     setTotalUsers(data.totalUsers || 0)
//     setLoading(false);
//   }
//   const FetchStations = async() =>{
//     const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/admin/station/total");
//     const data = await res.json();
//     console.log(data)
//     setTotalStations(data.totalStations || 0);
//     setLoading(false);
//   };
//   const FetchBookings =async()=>{
//     const res =  await fetch(import.meta.env.VITE_API_BASE_URL + "/api/bookings/bookingall/total")
//     const data = await res.json();
//     console.log(data);
//     setTotalBooking(data.totalBookings || 0);
//     setLoading(false);
//   }
    
//   const FetchRevenue = async () => {
//     const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/bookings/revenue/total");
//     const data = await res.json();
//     console.log(data);
//     setTotalRevenue(data.totalRevenue || 0);
//     setLoading(false);
//   };
//   const FetchFeedback = async() =>{
//     const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/feedback/total")
//     const data = await res.json();
//     setTotalFeedback(data.totalFeedback || 0);
//     setLoading(false);
//   }
//   useEffect(() => {
//     FetchUser();
//     FetchStations();
//     FetchBookings();
//     FetchRevenue();
//     FetchFeedback();
//     const interval = setInterval(()=>{
//       FetchRevenue();
//       FetchStations();
//       FetchBookings();
//       FetchUser();
//       FetchFeedback();
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);
//   if (loading) return <h2 style={{ textAlign: "center" }}>Loading dashboard...</h2>;
//    const chartData = {
//     labels: ["Users", "Stations", "Bookings","Feedback"],
//     datasets: [
//       {
//         label: "Counts",
//         data: [totalUsers,totalStations,totalBooking,totalFeedback],
//         // backgroundColor: ["skyblue", "pink", "lightgreen", "orange"],
//         backgroundColor: ["#1E90FF", "#FF69B4", "#32CD32", "#FFA500"],
//         borderRadius: 6,
//       },
//     ],
//   };
//   return (
//     <div className="container-fluid">
//       <div className="row g-3">
//         {/* Total Users */}
//         <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
//           <div className="card shadow-sm">
//             <div className="card-body text-center">
//               <h6 className="text-muted">Total Users</h6>
//               <h3 className="fw-bold">{totalUsers}</h3>
//             </div>
//           </div>
//         </div>

//         {/* Total Stations */}
//         <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
//           <div className="card shadow-sm">
//             <div className="card-body text-center">
//               <h6 className="text-muted">Total Stations</h6>
//               <h3 className="fw-bold">{totalStations}</h3>
//             </div>
//           </div>
//         </div>

//         {/* Total Bookings */}
//         <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
//           <div className="card shadow-sm">
//             <div className="card-body text-center">
//               <h6 className="text-muted">Total Bookings</h6>
//               <h3 className="fw-bold">{totalBooking}</h3>
//             </div>
//           </div>
//         </div>

//         {/* Total Revenue */}
//         <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
//         <div className="card shadow-sm">
//           <div className="card-body text-center">
//             <h6 className="text-muted">Total Revenue</h6>
//             <h3 className="fw-bold text-success">₹{totalRevenue}</h3>
//           </div>
//           </div>
//         </div>
//       <Bar data={chartData}/>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStations, setTotalStations] = useState(0);
  const [totalBooking, setTotalBooking] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [usersRes, stationsRes, bookingsRes, revenueRes, feedbackRes] =
        await Promise.all([
          fetch(import.meta.env.VITE_API_BASE_URL + "/api/user/total"),
          fetch(import.meta.env.VITE_API_BASE_URL + "/api/admin/station/total"),
          fetch(import.meta.env.VITE_API_BASE_URL + "/api/bookings/bookingall/total"),
          fetch(import.meta.env.VITE_API_BASE_URL + "/api/bookings/revenue/total"),
          fetch(import.meta.env.VITE_API_BASE_URL + "/api/feedback/total"),
        ]);

      const usersData = await usersRes.json();
      const stationsData = await stationsRes.json();
      const bookingsData = await bookingsRes.json();
      const revenueData = await revenueRes.json();
      const feedbackData = await feedbackRes.json();

      setTotalUsers(usersData.totalUsers || 0);
      setTotalStations(stationsData.totalStations || 0);
      setTotalBooking(bookingsData.totalBookings || 0);
      setTotalRevenue(revenueData.totalRevenue || 0);
      setTotalFeedback(feedbackData.totalFeedback || 0);

      setLoading(false);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return <h2 className="text-center mt-5">Loading dashboard...</h2>;

  const chartData = {
    labels: ["Users", "Stations", "Bookings", "Feedback"],
    datasets: [
      {
        label: "Counts",
        data: [totalUsers, totalStations, totalBooking, totalFeedback],
        backgroundColor: ["#1E90FF", "#FF69B4", "#32CD32", "#FFA500"],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: "#eee" } },
      x: { grid: { color: "#fff" } },
    },
  };

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        {/* Card Component */}
        {[
          {
            title: "Total Users",
            value: totalUsers,
            icon: <i className="bi bi-person"></i>,
            bg: "bg-primary",
          },
          {
            title: "Total Stations",
            value: totalStations,
            icon: <i className=" bi-check-circle-fill"></i>,
            bg: "bg-danger",
          },
          {
            title: "Total Bookings",
            value: totalBooking,
            icon: "📅",
            bg: "bg-success",
          },
          {
            title: "Total Revenue",
            value: `₹${totalRevenue}`,
            icon:"💰",
            bg: "bg-warning",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="col-xl-3 col-lg-4 col-md-6 col-sm-12"
          >
            <div
              className={`card shadow-sm text-white ${card.bg} border-0`}
            >
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-title">{card.title}</h6>
                  <h3 className="fw-bold">{card.value}</h3>
                </div>
                <div style={{ fontSize: "2.5rem" }}>{card.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <div className="card shadow-sm p-4">
            <h5 className="mb-4">Dashboard Overview</h5>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
