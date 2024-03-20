import { ChangeEvent, FormEvent, useState } from "react";


const Signup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        

        const newUser = {
            username: username,
            email: email,
            password: password
        }

        const response = await fetch('http://localhost:4000/register', {
           method: 'POST',
           body: JSON.stringify(newUser),
           headers: {
                'Content-Type': 'application/json'
           } 
        });

        const data = await response.json();

        if (!response.ok) {
            console.log(data.error);
        }

        if (response.ok) {
            setUsername('');
            setEmail('');
            setPassword('');
            window.location.href = '/home'; // Redirect on successful register
        }
    }


    return (
        <div className="flexbox">
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>Signup</h1>
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
                    <button type="submit" className="btn">Signup</button>
                </form>
            </div>
        </div>

     );
}
 
export default Signup;

