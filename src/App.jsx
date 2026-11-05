import { Routes, Route, Link } from 'react-router-dom';
import Layout from './Layout.jsx';
import Home from './pages/Home.jsx';
import Collection from './pages/Collection.jsx';
import Product from './pages/Product.jsx';
import Auth from './pages/Auth.jsx';
import Account from './pages/Account.jsx';
import Admin from './pages/admin/Admin.jsx';
import Bag from './pages/Bag.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmed from './pages/OrderConfirmed.jsx';
import Favorites from './pages/Favorites.jsx';
import NewArrivals from './pages/NewArrivals.jsx';
import { useAuth } from './AuthContext.jsx';

const NotFound = () => (
  <div className="wrap py-32 text-center"><h1 className="display text-3xl">Page not found</h1><Link to="/" className="btn-cobalt mt-6">Back to home</Link></div>
);
const AccountGate = () => {
  const { user } = useAuth();
  return user ? <Account /> : <Auth />;
};

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {['clothing', 'shoes', 'bags', 'accessories', 'sale'].map((c) => <Route key={c} path={c} element={<Collection key={c} category={c} />} />)}
        <Route path="product/:slug" element={<Product />} />
        <Route path="new-arrivals" element={<NewArrivals />} />
        <Route path="bag" element={<Bag />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-confirmed" element={<OrderConfirmed />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="account/wishlists" element={<Favorites />} />
        <Route path="account" element={<AccountGate />} />
        <Route path="account/profile" element={<AccountGate />} />
        <Route path="account/create" element={<Auth create />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
