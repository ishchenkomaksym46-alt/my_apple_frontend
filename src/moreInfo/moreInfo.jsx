import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function MoreInfo() {
    const [productInfo, setProductInfo] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getProductData = async () => {
            const res = await fetch(`http://localhost:5000/moreInfo/${id}`);
            const data = await res.json();
            setProductInfo(data.data);
        }

        if (id) {
            getProductData();
        }
    }, [id])
    
    return(
        <div className="pageShell">
            <div className="pageHeader">
                <button className="secondaryButton" onClick={() => navigate(-1)}>Back</button>
                <h1 className="sectionTitle">Product details</h1>
            </div>
            {productInfo.length === 0 ? (
                <div className="emptyState">
                    <p>Loading product information...</p>
                </div>
            ) : (
                productInfo.map(el => (
                    <div key={el.id} className="detailsLayout">
                        <div className="detailsImageCard">
                            <img src={el.img} alt="product" className="detailsImage"/>
                        </div>
                        <div className="detailsContentCard">
                            <div className="detailsBadge">Product #{el.id}</div>
                            <h2 className="detailsTitle">{el.name}</h2>
                            <p className="detailsDescription">{el.description}</p>
                            <div className="detailsMetaGrid">
                                <div className="detailsMetaItem">
                                    <span className="detailsMetaLabel">Price</span>
                                    <span className="detailsMetaValue">{el.price}</span>
                                </div>
                                <div className="detailsMetaItem">
                                    <span className="detailsMetaLabel">Image URL</span>
                                    <span className="detailsMetaValue detailsLinkValue">{el.img}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default MoreInfo;
