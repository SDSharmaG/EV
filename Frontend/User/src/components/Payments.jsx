import React, { useEffect, useState } from "react";

const Payments = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?._id) return;

    const fetchBills = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/bills/user/${user._id}`
        );
        const data = await res.json();

        console.log("Bills API response:", data);

        if (data.success) {
          setBills(data.data);
        }
      } catch (err) {
        console.error("Error fetching bills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  if (loading) {
    return <h3 className="text-center mt-4">Loading bills...</h3>;
  }
  const formatDateTime = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};


  return (
    <div className="container mt-4">
  <h2 className="mb-4">💰 Your Bills</h2>

  {bills.length === 0 ? (
    <p>No bills available yet.</p>
  ) : (
    <div className="row g-3">
      {bills.map((bill) => (
        <div key={bill._id} className="col-12 col-md-4">
          <div className="card p-3 shadow-sm h-100">

            <p>
              <b>Booking ID:</b> {bill.bookingId}
            </p>

            <p>
              <b>Bill Date:</b> {formatDateTime(bill.createdAt)}
            </p>

            <p>
              <b>Amount:</b> ₹{bill.amount}
            </p>

            <p>
              <b>Status:</b>{" "}
              <span
                className={`badge ${
                  bill.status === "paid"
                    ? "bg-success"
                    : "bg-warning text-dark"
                }`}
              >
                {bill.status}
              </span>
            </p>

            <button
              className="btn btn-secondary mt-auto"
              onClick={() =>
                window.open(
                  `${import.meta.env.VITE_API_BASE_URL}/api/bookings/${bill._id}/pdf`,
                  "_blank"
                )
              }
            >
              Download PDF
            </button>

          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default Payments;
