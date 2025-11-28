import { Link } from "react-router-dom";
import "./Success.css";

export default function Success() {
  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">🎉</div>

        <h1>Payment Successful</h1>
        <p className="success-text">
          Thank you for your generous donation. Your contribution will help
          support children who need food, care, and hope.
        </p>

        <div className="success-details">
          <h3>Your Donation Has Been Received</h3>
          <p>You will receive a confirmation email shortly.</p>
        </div>

        <div className="success-buttons">
          <Link to="/" className="success-btn home-btn">
            Go to Homepage
          </Link>

          <Link to="/" className="success-btn donate-btn">
            Donate Again
          </Link>
        </div>
      </div>
    </div>
  );
}
