import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DeleteProduct() {
    const [id, setId] = useState(1);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem('token');

        await fetch('http://localhost:5000/deleteProduct', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                id: id
            })
        })
        .then(res => res.json())
        .then(result => {
            if(result.succes === true) {
                navigate('/');
            } else {
                setError(result.message || 'No products with this ID');
            }
        })
    }
    
    return(
        <form onSubmit={handleSubmit}>
            <input placeholder="Product id: " type="number" onChange={(e) => setId(e.target.value)} required/>
            <p>{error}</p>
            <button>Delete</button>
        </form>
    )
}

export default DeleteProduct;
