import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminRoute({ children }) {
    const [isAllowed, setIsAllowed] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAccess = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/checkRole', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();

                if (!res.ok || data.admin !== true) {
                    navigate('/');
                    return;
                }

                setIsAllowed(true);
            } catch (error) {
                navigate('/');
            } finally {
                setIsChecking(false);
            }
        };

        checkAccess();
    }, [navigate]);

    if (isChecking) {
        return null;
    }

    if (!isAllowed) {
        return null;
    }

    return children;
}

export default AdminRoute;
