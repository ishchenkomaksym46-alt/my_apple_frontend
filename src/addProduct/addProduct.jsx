import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState();
    const [img, setImg] = useState();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function createProduct(e) {
        e.preventDefault();
        const token = localStorage.getItem('token');

        await fetch('http://localhost:5000/createProduct', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                description,
                price,
                img
            })
        })
        .then(res => res.json())
        .then(result => {
            if(result.succes === true) {
                navigate('/');
            } else {
                setError(result.message || 'Cannot create product! Try again!');
            }
        })
    }

    return(
        <form onSubmit={createProduct}>
            <input placeholder="Product name: " onChange={(e) => setName(e.target.value)} required/>
            <input placeholder="Product description: " onChange={(e) => setDescription(e.target.value)} required/>
            <input placeholder="Product price: " onChange={(e) => setPrice(Number(e.target.value))} type="number" required/>
            <input placeholder="Product image: " onChange={(e) => setImg(e.target.value)}/>
            <p>{error}</p>
            <button>Add product</button>
        </form>
    )
}

export default AddProduct;
