import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                email,
                password
            })
        })
        .then(res => res.json())
        .then(() => navigate('/'));
    }
    
    return(
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Your email: " onChange={(e) => setEmail(e.target.value)} required/>
            <input type="password" placeholder="Your password" onChange={(e) => setPassword(e.target.value)} required/>
            <button>Sign In</button>
            <p>Have an account? <a href="/login">Log In</a></p>
        </form>
    )
}

export default Signin;