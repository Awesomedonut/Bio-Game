import { useNavigate } from 'react-router-dom';
import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  onClose: () => void;
}

const backendUri = "https://backend-dot-group-project372.uw.r.appspot.com"

const Login: React.FC<Props> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newUser = {
      username: username,
      password: password
    };

    try {
      const response = await fetch(backendUri + '/login', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
      } else {
        setUsername('');
        setPassword('');
        setError('');
        navigate('/home');  // Redirect on successful login
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className='flexbox'>
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Welcome Back!
            <span className="material-symbols-outlined" onClick={onClose}>
              close
            </span>
          </h1>
          <div className="input-box">
            <input
                type="text"
                placeholder='Username'
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
          </div>
          <div className="input-box">
          <input
              type="password"
              placeholder='Password'
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className='error'>{ error }</p>}
          <p className='register-link'>Don't have an account? <Link to="/signup">Register</Link></p>
          <button type='submit' className='btn'>Log In</button>
        </form>

      </div>
    </div>
  );
};

export default Login;
