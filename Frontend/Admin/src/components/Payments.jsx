import React, { useEffect, useState } from "react";

const Payments = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assuming user is logged in and stored in localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/bills/allbills");
        const data = await res.json();
        console.log("Fetching from data: ", data);
        if (data.success) {
          setBills(data.data);
        }
      } catch (err) {
        console.error("Error fetching bills:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBills();
  }, [user]);

  if (loading) return <h3 className="text-center mt-4">Loading bills...</h3>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">💰 Your Bills</h2>

      {bills.length === 0 ? (
        <p className="text-center">No bills available yet.</p>
      ) : (
        <div className="row">
          {bills.map((bill) => (
            <div key={bill._id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card p-3 shadow-sm h-100">
                <p>
                  <strong>User:</strong> {bill.userId?.name}
                </p>
                <p>
                  <strong>Booking ID:</strong> {bill.bookingId}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{bill.amount}
                </p>
                <p>
                  <strong>Status:</strong> {bill.status}
                </p>
                <button
                  className="btn btn-primary w-100"
                  onClick={() =>
                    window.open(
                      `${import.meta.env.VITE_API_BASE_URL}/api/bills/pdf/${bill._id}`,
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
