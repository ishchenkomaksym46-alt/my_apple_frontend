import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const getOrders = async () => {
            const token = localStorage.getItem('token');

            if(!token) {
                navigate('/login');
            }

            await fetch('http://localhost:5000/getOrders', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if(data.succes === true) {
                    setOrders(data.orders);
                } else {
                    setError('Cannot get your orders');
                }
            });
        }

        getOrders();
    }, [navigate]);

    return(
        <div className="pageShell">
            <div className="pageHeader">
                <button className="secondaryButton" onClick={() => navigate('/')}>Back to products</button>
                <h1 className="sectionTitle">My orders</h1>
            </div>
            {orders.length === 0 && <div className="emptyState"><h2>No orders yet</h2></div>}

            <div className="cardsGrid">
            {orders.map(el => {
                const date = new Date(el.created_at);

                const formattedDate = new Intl.DateTimeFormat('us-US').format(date);

                return(
                    <div key={el.id} className="infoCard">
                        <h1>Product id: {el.product_id}</h1>
                        <h2>Order id: {el.id}</h2>
                        <h3 className="infoMeta">Created at: {formattedDate}</h3>
                        <div className="cardActions">
                            <button onClick={() => navigate(`/moreInfo/${el.product_id}`)}>Show more</button>
                        </div>
                    </div>
                )
            })}
            </div>
            <p className="statusMessage">{error}</p>
        </div>
    )
}

export default CheckOrders;
