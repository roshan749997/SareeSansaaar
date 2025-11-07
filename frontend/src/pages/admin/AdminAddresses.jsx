import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

const AdminAddresses = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.admin.listAddresses();
        if (mounted) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || 'Failed to load addresses');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="bg-white border rounded p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">User Addresses</h2>
      </div>
      {loading ? (
        <div className="p-4">Loading...</div>
      ) : error ? (
        <div className="p-4 text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">User</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Address</th>
                <th className="p-2">City/State</th>
                <th className="p-2">Pincode</th>
                <th className="p-2">Type</th>
                <th className="p-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(a => (
                <tr key={a._id} className="border-b">
                  <td className="p-2">
                    <div className="font-medium">{a.userId?.name || a.fullName}</div>
                    <div className="text-gray-500">{a.userId?.email || ''}</div>
                  </td>
                  <td className="p-2">{a.mobileNumber || a.alternatePhone || ''}</td>
                  <td className="p-2">{a.address}{a.landmark ? `, ${a.landmark}` : ''}</td>
                  <td className="p-2">{a.city}, {a.state}</td>
                  <td className="p-2">{a.pincode}</td>
                  <td className="p-2">{a.addressType}</td>
                  <td className="p-2">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAddresses;
