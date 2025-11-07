import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.admin.stats();
        if (mounted) setStats(data);
      } catch (e) {
        setError(e.message || 'Failed to load stats');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/admin/products" className="px-3 py-2 bg-indigo-600 text-white rounded">Products</Link>
          <Link to="/admin/orders" className="px-3 py-2 bg-indigo-600 text-white rounded">Orders</Link>
        </div>
      </div>
      {loading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : error ? (
        <div className="p-4 text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded p-4">
            <div className="text-gray-500">Total Revenue</div>
            <div className="text-3xl font-bold">{formatINR(stats.totalRevenue)}</div>
          </div>
          <div className="bg-white border rounded p-4">
            <div className="text-gray-500">Total Orders</div>
            <div className="text-3xl font-bold">{stats.totalOrders}</div>
          </div>
          <div className="bg-white border rounded p-4">
            <div className="text-gray-500">Total Products</div>
            <div className="text-3xl font-bold">{stats.totalProducts}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
