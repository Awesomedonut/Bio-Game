import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onClose: () => void;
}


const LoginModal: React.FC<Props> = ({ onClose }) => {

  const navigate = useNavigate();
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onClose();

    navigate('/home'); 
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit">Login</button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default LoginModal;
