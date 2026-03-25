import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        setError('');

        try {
            const res = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Login failed.');
                return;
            }

            localStorage.setItem('token', data.token);
            console.log('Login succesfull!');
            navigate('/');
        } catch (error) {
            setError('Unable to log in right now.');
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Your email: " onChange={(e) => setEmail(e.target.value)} required/>
            <input type="password" placeholder="Your password: " onChange={(e) => setPassword(e.target.value)} required/>
            <button>Log In</button>
            {error && <p>{error}</p>}
            <p>Don't have an account? <a href="/signin">Create an account!</a></p>
        </form>
    )
}

export default Login;
