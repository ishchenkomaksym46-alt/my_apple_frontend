import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Pay() {
    const { id } = useParams();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if(!token) {
            navigate('/login');
            return;
        }

        await fetch(`http://localhost:5000/order/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.succes === true) {
                navigate('/');
            } else {
                setError('Item don\'t exists!');
            }
        })
    }

    return(
        <form onSubmit={handleSubmit}>
            <input placeholder="Card number" required/>
            <p>This is just an example please don't enter your real card info</p>
            <p>{error}</p>
            <button>Submit</button>
        </form>
    )
}

export default Pay;