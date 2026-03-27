import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from './Image.svg';

function MainPage() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [sortBy, setSortBy] = useState('id_desc');
    const navigate = useNavigate();

    const getProducts = async (sort) => {
        await fetch(`https://myapplebackend-production.up.railway.app/getProducts?sort=${sort}`)
        .then(res => res.json())
        .then(result => setProducts(result));
    }

    useEffect(() => {
        const loginCheck = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await fetch('https://myapplebackend-production.up.railway.app/mainPageCheck', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();

                if (!res.ok) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                console.log(data.user);
            } catch (error) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        const checkRole = async () => {
            const token = localStorage.getItem('token');
            await fetch('https://myapplebackend-production.up.railway.app/checkRole', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if(data.admin === true) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            })
        }

        checkRole();
        loginCheck();
    }, [navigate]);

    useEffect(() => {
        getProducts(sortBy);
    }, [sortBy])

    const addToCart = async (product) => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const res = await fetch('https://myapplebackend-production.up.railway.app/cart', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    product_name: product.name,
                    product_description: product.description,
                    product_price: product.price
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Cannot add product to cart.');
                return;
            }

            setError('');
        } catch (fetchError) {
            setError('Cannot add product to cart.');
        }
    };
    
    return(
        <div>
            <div className="headerWrapper">
                <header>
                    <img src={logo} alt="logo" width="40" height="40" className="logoImage"/>
                    <p className="logo">MyApple</p>
                    {isAdmin && <>
                        <a href="/addProduct">Add product</a>
                        <a href="/deleteProduct">Delete Product</a>
                    </>}
                    <a href="/cart">Cart</a>
                    <a href="/getOrders">Check my orders</a>
                </header>
                <hr/>
            </div>

            <div className="container">
                <h3>Sort by</h3>
                <input type="radio" name="filter" value="The cheapest" className="filters" checked={sortBy === 'price_asc'} onChange={(e) => {
                    setSortBy('price_asc');
                }}/>The cheapest
                <input type="radio" name="filter" value="The most expensive" className="filters" checked={sortBy === 'price_desc'} onChange={(e) => {
                    setSortBy('price_desc');
                }}/>The most expensive
                <input type="radio" name="filter" value="The oldest" className="filters" checked={sortBy === 'id_asc'} onChange={(e) => {
                    setSortBy('id_asc');
                }}/>The oldest
                <input type="radio" name="filter" value="The newest" className="filters" checked={sortBy === 'id_desc'} onChange={(e) => {
                    setSortBy('id_desc');
                }}/>The newest
            </div>

            {error && <p>{error}</p>}
            <div className="productsGrid">
                {products.map(el => (
                    <div key={el.id} className="products">
                        <img src={el.img} alt="product" className="productImage" loading="lazy"></img>
                        <h2>{el.name}</h2>
                        <h3>Price: {el.price}</h3>
                        <button onClick={() => addToCart(el)}>Add to cart</button>
                        <button onClick={() => navigate(`/pay/${el.id}`)}>Buy right now</button>
                        <button onClick={() => navigate(`/moreInfo/${el.id}`)}>More information</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MainPage;
