import React from 'react';
import { useNavigate } from 'react-router-dom'; 

const Header: React.FC = () => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/');
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

 

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    color: '#f44336',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <header style={headerStyle}>
      <h1 ></h1>
      <button style={buttonStyle} onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Header;
