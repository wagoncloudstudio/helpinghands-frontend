import { useState } from "react";
import axios from "axios";
import "./DonationForm.css";

export default function DonationForm() {
  const API = import.meta.env.VITE_API_URL;
  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startPayment = async () => {
    if (!form.name || !form.email || !form.phone || !form.location) {
      return showToast("Please fill all the details");
    }
    if (!form.amount || form.amount <= 0) {
      return showToast("Please enter a valid amount");
    }

    setLoading(true);

    let order;
    try {
      const orderRes = await axios.post(`${API}/api/donation/create-order`, {
        amount: form.amount,
      });
      order = orderRes.data.order;
    } catch (err) {
      console.error(err);
      setLoading(false);
      return showToast("Error creating order. Try again.");
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: order.amount,
      currency: "INR",
      name: "Hope Foundation",
      description: "Donation Payment",
      order_id: order.id,

      handler: function (response) {
        showToast("Payment Successful 🎉");

        axios
          .post(`${API}/api/donation/save-donation`, {
            ...form,
            paymentId: response.razorpay_payment_id,
          })
          .catch((err) => console.log("Save donation failed:", err));

        setTimeout(() => {
          window.location.href = "/success";
        }, 800);
      },

      modal: {
        ondismiss: () => {
          setLoading(false);
          showToast("Payment Cancelled");
        },
      },

      theme: { color: "#ff7a00" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    setLoading(false);
  };

  return (
    <div className="donation-page">

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}

      <section className="hero-section">
        <div className="hero-overlay">
          <h1>Feed a Child, Change a Future</h1>
          <p>
            Your kindness today gives a child hope for tomorrow.
            Every donation provides warm meals and essential care to children in need.
          </p>

          <button
            className="hero-donate-btn"
            onClick={() => {
              const formSection = document.getElementById("donation-form");
              formSection.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Donate Now
          </button>
        </div>
      </section>

      <section className="mission-section">
        <div className="mission-content">
          <h2>What Your Donation Does</h2>
          <p>Your contribution helps us provide:</p>

          <div className="info-cards">
            <div className="info-card"> Nutritious Meals</div>
            <div className="info-card"> Medical Support</div>
            <div className="info-card"> School Supplies</div>
            <div className="info-card"> Emotional Care</div>
          </div>
        </div>
      </section>

      <section className="donation-form-wrapper" id="donation-form">
        <div className="donation-form-card">
          <h3>Make a Donation</h3>

          <div className="form-grid">
            <input name="name" placeholder="Full Name" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="phone" placeholder="Phone Number" onChange={handleChange} />
            <input name="location" placeholder="Your City" onChange={handleChange} />
            <input name="amount" placeholder="Donation Amount (₹)" onChange={handleChange} />
          </div>

          <button className="donate-btn" onClick={startPayment} disabled={loading}>
            {loading ? "Processing..." : "Donate Now"}
          </button>
        </div>
      </section>

    </div>
  );
}
