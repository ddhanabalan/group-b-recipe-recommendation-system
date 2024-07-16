import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Otp.css";

const Otp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", otp: "" });
  const [verificationError, setVerificationError] = useState("");

  useEffect(() => {
    const pathnameSegments = location.pathname.split("/");
    const emailSegmentIndex = pathnameSegments.indexOf("otp") + 1;
    if (emailSegmentIndex > 0 && emailSegmentIndex < pathnameSegments.length) {
      const email = pathnameSegments[emailSegmentIndex];
      setFormData((prevData) => ({ ...prevData, email }));
    }
  }, [location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = { username: formData.email, vericode: formData.otp };

      const response = await fetch(
        "http://localhost:8000/authentication/verify-email/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        toast.success("Email verified successfully.", {
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          closeButton: false,
          style: {
            height: "50px",
            border: "2px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
          },
        });
        navigate("/login"); // Redirect to login page
      } else {
        const data = await response.json();
        setVerificationError(data.error || "Failed to verify.");
      }
    } catch (error) {
      setVerificationError("Failed to verify.");
    }
  };

  return (
    <div className="otp-section">
      <div className="card-otp" style={{ height: 200 }}>
        <h1 className="otp-head" align="center">
          Enter OTP
        </h1>
        <form className="form1" onSubmit={handleOTPSubmit}>
          <table width="400" rules="none" cellPadding="10px">
            <tr>
              <td style={{ fontSize: 20, fontFamily: "Playfair Display" }}>
                <input
                  type="text"
                  name="otp"
                  className="txtotp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  style={{ fontSize: 18, fontFamily: "Playfair Display" }}
                />
              </td>
            </tr>
            {verificationError && (
              <tr>
                <td
                  colSpan="2"
                  align="center"
                  style={{ fontSize: 18, color: "red" }}
                >
                  {verificationError}
                </td>
              </tr>
            )}
            <tr>
              <td
                colSpan="2"
                align="center"
                style={{ fontSize: 22, fontFamily: "Poppins" }}
              >
                <input
                  type="submit"
                  className="btnsubmitotp"
                  id="btnsubmitotp"
                  value="Submit OTP"
                  style={{
                    background: "#e1792f",
                    color: "#fff",
                    cursor: "pointer",
                    padding: 10,
                    border: "none",
                    borderRadius: 5,
                    width: 150,
                  }}
                />
              </td>
            </tr>
          </table>
        </form>
      </div>
    </div>
  );
};

export default Otp;
