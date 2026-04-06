import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import logo from './Image.svg';

function MainPage() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [sortBy, setSortBy] = useState('id_desc');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const getProducts = useCallback(async (sort) => {
        await fetch(`https://myapplebackend-production.up.railway.app/getProducts?sort=${sort}&page=${page}`)
        .then(res => res.json())
        .then(result => {
            setProducts(result);
            // Предполагаем 10 продуктов на странице
            setTotalPages(Math.ceil(result.length > 0 ? result.length / 10 : 1));
        });
    }, [page]);

    const searchProduct = async () => {
        await fetch(`https://myapplebackend-production.up.railway.app/getProductsSearch?search=${search}`)
        .then(res => res.json())
        .then(data => {
            if(data.succes === false) {
                setError('Cannot find product with this name!');
            } else {
                setProducts(data.result);
                setError('');
            }
        });
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
    }, [sortBy, getProducts])

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

            <div className="catalogLayout">
                <aside className="container">
                    <div className="filterHeader">
                        <h2 className="filterTitle">Filters</h2>
                    </div>
                    <div className="filterDivider"></div>
                    <div className="filterSection">
                        <h3 className="filterSectionTitle">Sort by</h3>
                        <div className="sortOptions">
                        <label className={`sortOption ${sortBy === 'price_asc' ? 'isActive' : ''}`}>
                            <input
                                type="radio"
                                name="filter"
                                className="filters"
                                checked={sortBy === 'price_asc'}
                                onChange={() => setSortBy('price_asc')}
                            />
                            <span className="sortText">The cheapest</span>
                        </label>
                        <label className={`sortOption ${sortBy === 'price_desc' ? 'isActive' : ''}`}>
                            <input
                                type="radio"
                                name="filter"
                                className="filters"
                                checked={sortBy === 'price_desc'}
                                onChange={() => setSortBy('price_desc')}
                            />
                            <span className="sortText">The most expensive</span>
                        </label>
                        <label className={`sortOption ${sortBy === 'id_asc' ? 'isActive' : ''}`}>
                            <input
                                type="radio"
                                name="filter"
                                className="filters"
                                checked={sortBy === 'id_asc'}
                                onChange={() => setSortBy('id_asc')}
                            />
                            <span className="sortText">The oldest</span>
                        </label>
                        <label className={`sortOption ${sortBy === 'id_desc' ? 'isActive' : ''}`}>
                            <input
                                type="radio"
                                name="filter"
                                className="filters"
                                checked={sortBy === 'id_desc'}
                                onChange={() => setSortBy('id_desc')}
                            />
                            <span className="sortText">The newest</span>
                        </label>
                        </div>
                    </div>
                    <div className="filterDivider"></div>
                    <div className="searchSection">
                        <div className="searchSectionHeader">
                            <h2 className="searchTitle">Search</h2>
                            <p className="searchHint">Find a product by name in a few letters.</p>
                        </div>
                        <input
                            className="searchInput"
                            placeholder="Search product"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="searchButton" onClick={() => {
                            if(search.trim().length === 0) {
                                return setError('Enter product name you want to find!');
                            }
                            searchProduct();
                        }}>Search</button>
                    </div>
                </aside>

                <section className="catalogContent">
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
                </section>

                <section className="paginationButtons">
                    <button className="back" onClick={() => setPage(page - 1)} disabled={page <= 1}>Back</button>
                    <span>Page {page}</span>
                    <button className="next" onClick={() => setPage(page + 1)} disabled={products.length < 10}>Next</button>
                </section>
            </div>
        </div>
    )
}

export default MainPage;
