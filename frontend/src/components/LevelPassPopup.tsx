import React from 'react';

interface LevelPassPopupProps {
  onClose: () => void; // Function to call when the 'Continue' button is clicked
}

const LevelPassPopup: React.FC<LevelPassPopupProps> = ({ onClose }) => {
  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <h2>Level Complete!</h2>
        <p>Bacteria can enter the human body through various pathways. Common entry points include the respiratory tract, via inhalation of airborne particles, the digestive tract, through consumption of contaminated food or water, and breaks in the skin, due to cuts or abrasions. Once inside, they can multiply and spread, potentially leading to infections if not promptly addressed by the body's immune system. Our bodies can trap and destroy bacteria using mucous.</p>
        <button onClick={onClose} style={buttonStyle}>Continue</button>
      </div>
    </div>
  );
};

// Styles
const overlayStyle = {
  position: 'fixed' as 'fixed', // Type assertion for 'fixed' positioning
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const popupStyle = {
  padding: '20px',
  backgroundColor: '#fff', // White background
  borderRadius: '5px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
  textAlign: 'center' as 'center',
  maxWidth: '90%',
};

const buttonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#007bff', // Bootstrap primary blue
  color: '#ffffff', // White text
  border: 'none',
  borderRadius: '5px',
  outline: 'none',
};

export default LevelPassPopup;
