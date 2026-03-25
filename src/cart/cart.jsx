import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCart = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/cart', {
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

                setCartItems(data);
            } catch (fetchError) {
                setError('Cannot load cart right now.');
            }
        };

        loadCart();
    }, [navigate]);

    const removeFromCart = async (id) => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/cart/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                setError(data.message || 'Cannot remove product from cart.');
                return;
            }

            setCartItems((currentItems) => currentItems.reduce((nextItems, item) => {
                if (item.id !== id) {
                    nextItems.push(item);
                    return nextItems;
                }

                if (item.quantity > 1) {
                    nextItems.push({
                        ...item,
                        quantity: item.quantity - 1
                    });
                }

                return nextItems;
            }, []));
            setError('');
        } catch (fetchError) {
            setError('Cannot remove product from cart.');
        }
    };

    const totalPrice = cartItems.reduce((sum, item) => (
        sum + item.product_price * item.quantity
    ), 0);

    const buyCart = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setIsSubmitting(true);

            const res = await fetch('http://localhost:5000/order/cart', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                setError(data.message || 'Cannot complete cart order.');
                return;
            }

            setCartItems([]);
            setError('');
        } catch (fetchError) {
            setError('Cannot complete cart order.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pageShell">
            <div className="pageHeader">
                <button className="secondaryButton" onClick={() => navigate('/')}>Back to products</button>
                <h1 className="sectionTitle">Cart</h1>
            </div>
            {error && <p className="statusMessage">{error}</p>}
            {cartItems.length === 0 ? (
                <div className="emptyState">
                    <p>Your cart is empty.</p>
                </div>
            ) : (
                <>
                    <div className="cardsGrid">
                        {cartItems.map(item => (
                        <div key={item.id} className="infoCard">
                            <h2>{item.product_name}</h2>
                            <p>{item.product_description}</p>
                            <p className="infoMeta">Price: {item.product_price}</p>
                            <p className="infoMeta">Quantity: {item.quantity}</p>
                            <div className="cardActions">
                                <button onClick={() => removeFromCart(item.id)}>Remove from cart</button>
                            </div>
                        </div>
                    ))}
                    </div>
                    <div className="summaryCard">
                        <h3>Total price: {totalPrice}</h3>
                        <button onClick={buyCart} disabled={isSubmitting}>
                            {isSubmitting ? 'Processing...' : 'Buy'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
