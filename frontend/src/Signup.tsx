import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from 'react-router-dom';
import { backendUri } from './Constants';
 //const backendUri = "https://backend-dot-group-project372.uw.r.appspot.com";
// const backendUri ="http://localhost:4000";

const Signup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
        } else {
            const newUser = {
                username: username,
                email: email,
                password: password
            }
    
            const response = await fetch(backendUri + '/register', {
               method: 'POST',
               body: JSON.stringify(newUser),
               headers: {
                    'Content-Type': 'application/json'
               } 
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                setError('Error During Registration');
            }
    
            if (response.ok) {
                setUsername('');
                setEmail('');
                setPassword('');
                window.location.href = '/home'; // Redirect on successful register
            }
        }
    }


    return (
        <div className="flexbox">
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>Register Now</h1>
                    <div className="input-box">
                        <input 
                            type="text" 
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="input-box">
                        <input 
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="input-box">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="input-box">
                        <input 
                            type="password" 
                            placeholder="Confirm Password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required 
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <p className="login-link"> Already have an account? <Link to="/">Log In</Link></p>
                    <button type="submit" className="btn">Signup</button>
                </form>
            </div>
        </div>

     );
}
 
export default Signup;

