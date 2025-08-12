import React, { useState, useEffect } from 'react';
import './registrationPage.css';

// Extracted form schema based on actual Udyam portal
const FORM_SCHEMA = {
  step1: {
    title: "Aadhaa Verification With OTP",
    subtitle: "UDYAM REGISTRATION FORM - For New Enterprise who are not Registered yet as MSME",
    fields: [
      {
        id: "aadhaar",
        name: "aadhaar",
        label: "1. Aadhaar Number / आधार संख्या",
        type: "text",
        placeholder: "Your Aadhaar No",
        validation: {
          pattern: "^[0-9]{12}$",
          required: true,
          message: "Aadhaar number shall be required for Udyam Registration."
        },
        helpText: [
          "Aadhaar number shall be required for Udyam Registration.",
          "The Aadhaar number shall be of the proprietor in the case of a proprietorship firm, of the managing partner in the case of a partnership firm and of a karta in the case of a Hindu Undivided Family (HUF).",
          "In case of a Company or a Limited Liability Partnership or a Cooperative Society or a Society or a Trust, the organisation or its authorised signatory shall provide its GST/PAN as per applicability of CGST Act 2017 and as notified by the ministry of MSME vide S.O. 1055(E) dated 05th March 2021 and PAN along with its Aadhaar number."
        ]
      },
      {
        id: "entrepreneurName",
        name: "entrepreneurName",
        label: "2. Name of Entrepreneur / उद्यमी का नाम",
        type: "text",
        placeholder: "Name as per Aadhaar",
        validation: {
          required: true,
          message: "Please enter name as per Aadhaar"
        }
      },
      {
        id: "consent",
        name: "consent",
        label: "I, the holder of the above Aadhaar, hereby give my consent to Ministry of MSME, Government of India, for using my Aadhaar number as allotted by UIDAI for Udyam Registration. NIC / Ministry of MSME, Government of India, have informed me that my aadhaar data will not be stored/shared. / मैं, उपरोक्त आधार धारक, इतद्वारा उद्यम पंजीकरण के लिए यूआईडीएआई द्वारा आवंटित मेरे आधार संख्या का उपयोग करने के लिए सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय, भारत सरकार को अपनी सहमति देता हूं। एनआईसी / सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय, भारत सरकार ने मुझे सूचित किया है कि मेरा आधार डेटा संग्रहीत / साझा नहीं किया जाएगा।",
        type: "checkbox",
        validation: {
          required: true,
          message: "You must give consent to proceed with Udyam Registration"
        }
      },
      {
        id: "otp",
        name: "otp",
        label: "Enter OTP",
        type: "text",
        placeholder: "Enter 6-digit OTP",
        validation: {
          pattern: "^[0-9]{6}$",
          required: true,
          message: "Please enter a valid 6-digit OTP"
        },
        conditional: true
      }
    ]
  },
  step2: {
    title: "Enterprise Details",
    fields: [
      {
        id: "pan",
        name: "pan",
        label: "PAN Number",
        type: "text",
        placeholder: "Enter PAN number (e.g., ABCDE1234F)",
        validation: {
          pattern: "^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$",
          required: true,
          message: "Please enter a valid PAN number"
        }
      },
      {
        id: "panName",
        name: "panName",
        label: "Name as per PAN",
        type: "text",
        placeholder: "Enter name as per PAN card",
        validation: {
          required: true,
          message: "Please enter name as per PAN card"
        }
      }
    ]
  }
};

const RegistrationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const validateField = (field, value) => {
    const { validation, type } = field;
    
    if (validation.required) {
      if (type === 'checkbox' && !value) {
        return validation.message || "This field is required";
      }
      if (type !== 'checkbox' && !value) {
        return validation.message || "This field is required";
      }
    }
    
    if (validation.pattern && value && type !== 'checkbox') {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(value)) {
        return validation.message || "Invalid format";
      }
    }
    
    return null;
  };

  const handleInputChange = (fieldName, value, type = 'text') => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: type === 'checkbox' ? value : value
    }));
    
    // Real-time validation
    const currentStepSchema = FORM_SCHEMA[`step${currentStep}`];
    const field = currentStepSchema.fields.find(f => f.name === fieldName);
    
    if (field) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  };

  const handleSendOTP = async () => {
    // Validate required fields before sending OTP
    const requiredFields = ['aadhaar', 'entrepreneurName', 'consent'];
    const stepErrors = {};
    
    requiredFields.forEach(fieldName => {
      const field = FORM_SCHEMA.step1.fields.find(f => f.name === fieldName);
      const error = validateField(field, formData[fieldName]);
      if (error) {
        stepErrors[fieldName] = error;
      }
    });
    
    setErrors(stepErrors);
    
    if (Object.keys(stepErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      setOtpSent(true);
      alert("OTP sent successfully to your registered mobile number");
    } catch (error) {
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStepSubmit = async () => {
    const currentStepSchema = FORM_SCHEMA[`step${currentStep}`];
    const stepErrors = {};
    
    // Validate all fields in current step
    currentStepSchema.fields.forEach(field => {
      if (field.conditional && !otpSent && field.name === 'otp') return;
      
      const error = validateField(field, formData[field.name]);
      if (error) {
        stepErrors[field.name] = error;
      }
    });
    
    setErrors(stepErrors);
    
    if (Object.keys(stepErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (currentStep === 1) {
        setCurrentStep(2);
        setOtpSent(false);
      } else {
        alert("Registration completed successfully!");
        // Redirect or handle completion
      }
    } catch (error) {
      alert("Validation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    const { id, name, label, type, placeholder, conditional, helpText } = field;
    const value = formData[name] || '';
    const error = errors[name];
    
    if (conditional && name === 'otp' && !otpSent) {
      return null;
    }

    if (type === 'checkbox') {
      return (
        <div key={id} className="form-field checkbox-field">
          <div className="checkbox-container">
            <div className="custom-checkbox">
              <input
                id={id}
                name={name}
                type="checkbox"
                checked={value || false}
                onChange={(e) => handleInputChange(name, e.target.checked, 'checkbox')}
                className={`checkbox-input ${error ? 'error' : ''}`}
                disabled={loading}
              />
              <span className="checkmark">✓</span>
            </div>
            <label htmlFor={id} className="checkbox-label">
              {label}
            </label>
          </div>
          {error && <span className="error-message">{error}</span>}
        </div>
      );
    }

    return (
      <div key={id} className="form-field">
        <label htmlFor={id} className="field-label">
          {label} <span className="required">*</span>
        </label>
        <div className="input-container">
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => handleInputChange(name, e.target.value)}
            className={`field-input ${error ? 'error' : ''} ${value ? 'filled' : ''}`}
            disabled={loading}
          />
          <div className="input-border"></div>
        </div>
        {helpText && (
          <div className="help-text">
            <div className="help-icon">💡</div>
            <div className="help-content">
              {helpText.map((text, index) => (
                <p key={index} className="help-item">• {text}</p>
              ))}
            </div>
          </div>
        )}
        {error && (
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{error}</span>
          </div>
        )}
      </div>
    );
  };

  const currentStepSchema = FORM_SCHEMA[`step${currentStep}`];

  return (
    <div className="registration-container">
      {/* Enhanced Government Header */}
      <div className="gov-header">
        <div className="header-gradient"></div>
        <div className="header-content">
          <div className="emblem">
            <div className="emblem-container">
              <div className="ashoka-stambh">
                <div className="lions">🏛️</div>
              </div>
              {/* <div className="emblem-glow"></div> */}
            </div>
            <div className="ministry-info">
              <div className="ministry-hindi">सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय</div>
              <div className="ministry-english">Ministry of Micro, Small & Medium Enterprises</div>
              <div className="ministry-tagline">Empowering MSMEs for Atmanirbhar Bharat</div>
            </div>
          </div>
          <div className="nav-links">
            <a href="#" className="nav-link"> Home</a>
            <a href="#" className="nav-link"> NIC Code</a>
            <a href="#" className="nav-link"> Documents ▼</a>
            <a href="#" className="nav-link"> Print/Verify ▼</a>
            <a href="#" className="nav-link"> Update ▼</a>
            <a href="#" className="nav-link"> Login ▼</a>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Enhanced Progress Indicator */}
        <div className="progress-section">
          <div className="progress-bar">
            <div className="progress-step completed">
              <div className="step-circle">1</div>
              <div className="step-label">Aadhaar</div>
            </div>
            <div className={`progress-line ${currentStep >= 2 ? 'completed' : ''}`}></div>
            <div className={`progress-step ${currentStep >= 2 ? 'completed' : ''}`}>
              <div className="step-circle">2</div>
              <div className="step-label">PAN Details</div>
            </div>
          </div>
        </div>

        <h1 className="page-title">
          {/* <span className="title-icon">🚀</span> */}
          {currentStepSchema.subtitle || "UDYAM REGISTRATION FORM"}
          <div className="title-underline"></div>
        </h1>
        
        <div className="registration-card">
          <div className="step-header">
            <div className="header-icon">
              {currentStep === 1 ? '🔐' : '🏢'}
            </div>
            <h2 className="step-title">{currentStepSchema.title}</h2>
            <div className="step-badge">Step {currentStep} of 2</div>
          </div>

          <div className="form-container">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="fields-container">
                {currentStepSchema.fields.map(renderField)}
              </div>
              
              <div className="button-container">
                {currentStep === 1 && !otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading || !formData.aadhaar || !formData.entrepreneurName || !formData.consent}
                    className="btn btn-primary"
                  >
                    {/* <span className="btn-icon">📱</span> */}
                    <span className="btn-text">
                      {loading ? 'Validating...' : 'Validate & Generate OTP'}
                    </span>
                    {loading && <div className="btn-spinner"></div>}
                  </button>
                )}
                
                {otpSent && currentStep === 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={loading || !formData.otp}
                    className="btn btn-primary"
                  >
                    <span className="btn-icon">✅</span>
                    <span className="btn-text">
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </span>
                    {loading && <div className="btn-spinner"></div>}
                  </button>
                )}
                
                {currentStep === 2 && (
                  <button
                    type="button"
                    onClick={() => alert("Registration completed successfully!")}
                    disabled={loading}
                    className="btn btn-primary btn-success"
                  >
                    <span className="btn-icon">🎉</span>
                    <span className="btn-text">
                      {loading ? 'Submitting...' : 'Complete Registration'}
                    </span>
                    {loading && <div className="btn-spinner"></div>}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Enhanced Activities Notice */}
        <div className="activities-notice">
          {/* <div className="notice-icon">ℹ️</div> */}
          <a href="#" className="notice-link">
            ℹ️ Activities (NIC codes) not covered under MSME Act, 2006 for Udyam Registration
          </a>
        </div>

        {/* Success Animation (hidden by default) */}
        <div className="success-animation" style={{display: 'none'}}>
          <div className="success-checkmark">✓</div>
          <div className="success-text">Registration Successful!</div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="gov-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>🌐 Quick Links</h4>
            <ul>
              <li><a href="#">Portal Guide</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>📞 Contact Us</h4>
            <p>Helpdesk: 1800-180-6763</p>
            <p>Email: support@udyamregistration.gov.in</p>
          </div>
          <div className="footer-section">
            <h4>🏛️ Government of India</h4>
            <p>Ministry of MSME</p>
            <p>Digital India Initiative</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
