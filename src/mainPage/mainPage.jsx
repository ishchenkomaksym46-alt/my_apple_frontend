import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from './Image.svg';

function MainPage() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loginCheck = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/mainPageCheck', {
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

        const getProducts = async () => {
            await fetch('http://localhost:5000/getProducts')
            .then(res => res.json())
            .then(result => setProducts(result));
        }

        const checkRole = async () => {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:5000/checkRole', {
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
        getProducts();
    }, [navigate]);

    const addToCart = async (product) => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/cart', {
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
            {error && <p>{error}</p>}
            <div className="productsGrid">
                {products.map(el => (
                    <div key={el.id} className="products">
                        <img src={el.img} alt="product" className="productImage"></img>
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
