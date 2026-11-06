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

const Reports = () => {
  const [stations, setStations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [stationsRes, bookingsRes, usersRes, feedbackRes] = await Promise.all([
          fetch(import.meta.env.VITE_API_BASE_URL + "/api/admin/stationinfo", { headers: { Authorization: `Bearer ${token}` } }),
          fetch(import.meta.env.VITE_API_BASE_URL + "/api/bookings/all", { headers: { Authorization: `Bearer ${token}` } }),
          fetch(import.meta.env.VITE_API_BASE_URL + "/api/allusers", { headers: { Authorization: `Bearer ${token}` } }),
          fetch(import.meta.env.VITE_API_BASE_URL + "/api/feedback/adminfeedback", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const stationsData = await stationsRes.json();
        const bookingsData = await bookingsRes.json();
        const usersData = await usersRes.json();
        const feedbackData = await feedbackRes.json();

        setStations(stationsData.data || []);
        setBookings(bookingsData.data || []);
        setUsers(usersData.data || []);
        setFeedbacks(feedbackData.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadPDF = () => {
    // Open backend PDF endpoint in new tab
    window.open(import.meta.env.VITE_API_BASE_URL + "/api/admin/reportpdf", "_blank");
  };

  if (loading) return <h2 className="text-center">Loading Report...</h2>;

  const chartData = {
    labels: ["Stations", "Bookings", "Users", "Feedbacks"],
    datasets: [
      {
        label: "Counts",
        data: [stations.length, bookings.length, users.length, feedbacks.length],
        backgroundColor: ["#4dc9f6", "#f67019", "#f53794", "#537bc4"],
      },
    ],
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Admin Report</h2>

      <div className="d-flex justify-content-center gap-3 mb-3">
        <button className="btn btn-danger" onClick={handleDownloadPDF}>
          ⬇️ Download PDF
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow p-3">
            <div className="d-flex justify-content-around mb-3">
              <div>Stations: <b>{stations.length}</b></div>
              <div>Bookings: <b>{bookings.length}</b></div>
              <div>Users: <b>{users.length}</b></div>
              <div>Feedbacks: <b>{feedbacks.length}</b></div>
            </div>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
