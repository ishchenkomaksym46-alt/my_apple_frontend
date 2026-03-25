import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Signin from './auth/signin.js';
import Login from './auth/login.js';
import AdminRoute from './auth/AdminRoute.jsx';
import MainPage from './mainPage/mainPage.jsx';
import AddProduct from './addProduct/addProduct.jsx';
import DeleteProduct from './deleteProduct/deleteProduct.jsx';
import MoreInfo from './moreInfo/moreInfo.jsx';
import Cart from './cart/cart.jsx';
import Pay from './cart/pay.jsx';
import CheckOrders from './checkOrders/checkOrders.jsx';
import './styles/style.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<MainPage />} />
      <Route path='/signin' element={<Signin />} />
      <Route path='/login' element={<Login />} />
      <Route path='/addProduct' element={<AdminRoute><AddProduct /></AdminRoute>} />
      <Route path='/deleteProduct' element={<AdminRoute><DeleteProduct /></AdminRoute>} />
      <Route path='/moreInfo/:id' element={<MoreInfo />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/pay/:id' element={<Pay />} />
      <Route path='/getOrders' element={<CheckOrders />} />
    </Routes>
  </BrowserRouter>
);
