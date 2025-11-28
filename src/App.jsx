import { Routes, Route } from "react-router-dom";
import DonationForm from "./DonationForm";
import Success from "./Success";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DonationForm />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
}
