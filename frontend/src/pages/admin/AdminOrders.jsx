import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.admin.listOrders();
        if (mounted) setOrders(data || []);
      } catch (e) {
        setError(e.message || 'Failed to load orders');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const StatusBadge = ({ status }) => {
    const s = String(status || '').toLowerCase();
    const map = {
      paid: 'bg-green-100 text-green-700 border border-green-200',
      created: 'bg-amber-100 text-amber-700 border border-amber-200',
      failed: 'bg-red-100 text-red-700 border border-red-200',
    };
    const cls = map[s] || 'bg-gray-100 text-gray-700 border border-gray-200';
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{status}</span>;
  };

  const renderAddress = (a) => {
    if (!a) return <span className="text-gray-400">No address</span>;
    return (
      <div className="max-w-xs">
        <div className="font-medium">{a.fullName}</div>
        <div className="text-gray-600 text-xs">{a.mobileNumber || a.alternatePhone}</div>
        <div className="text-gray-700 text-sm line-clamp-2">{a.address}{a.landmark ? `, ${a.landmark}` : ''}</div>
        <div className="text-gray-500 text-xs">{a.city}, {a.state} - {a.pincode}</div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      {loading ? (
        <div className="p-4">Loading...</div>
      ) : error ? (
        <div className="p-4 text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto bg-white border rounded">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Order</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Address</th>
                <th className="p-2">Items</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b">
                  <td className="p-2">#{String(o._id).slice(-6)}</td>
                  <td className="p-2">{o.user?.name || ''}<div className="text-gray-500">{o.user?.email || ''}</div></td>
                  <td className="p-2">{renderAddress(o.address)}</td>
                  <td className="p-2">{o.items?.length || 0}</td>
                  <td className="p-2">₹{Number(o.amount || 0).toLocaleString('en-IN')}</td>
                  <td className="p-2"><StatusBadge status={o.status} /></td>
                  <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
