import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

const AdminProducts = () => {
  const [form, setForm] = useState({
    title: '',
    mrp: '',
    discountPercent: 0,
    description: '',
    category: '',
    images: { image1: '', image2: '', image3: '' },
    product_info: { brand: '', manufacturer: '', SareeLength: '', SareeMaterial: '', SareeColor: '', IncludedComponents: '' },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.admin.listProducts();
      setList(data || []);
    } catch (e) {
      setError(e.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeNested = (section, key) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [section]: { ...(prev[section] || {}), [key]: value } }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        mrp: Number(form.mrp),
        discountPercent: Number(form.discountPercent) || 0,
        description: form.description,
        category: form.category,
        images: form.images,
        product_info: form.product_info,
      };
      await api.admin.createProduct(payload);
      setForm({ title: '', mrp: '', discountPercent: 0, description: '', category: '', images: { image1: '', image2: '', image3: '' }, product_info: { brand: '', manufacturer: '', SareeLength: '', SareeMaterial: '', SareeColor: '', IncludedComponents: '' } });
      await load();
    } catch (e2) {
      setError(e2.message || 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.admin.deleteProduct(id);
      await load();
    } catch (e) {
      setError(e.message || 'Failed to delete product');
    }
  };

  const priceFor = (p) => p.price || Math.round((p.mrp || 0) - (p.mrp || 0) * ((p.discountPercent || 0) / 100));

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={submit} className="bg-white border rounded p-4 space-y-3">
          {error && <div className="text-red-600">{error}</div>}
          <input name="title" value={form.title} onChange={onChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
          <input name="mrp" type="number" value={form.mrp} onChange={onChange} placeholder="MRP" className="w-full border rounded px-3 py-2" required />
          <input name="discountPercent" type="number" value={form.discountPercent} onChange={onChange} placeholder="Discount %" className="w-full border rounded px-3 py-2" />
          <input name="category" value={form.category} onChange={onChange} placeholder="Category" className="w-full border rounded px-3 py-2" required />
          <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="w-full border rounded px-3 py-2" rows="3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input value={form.images.image1} onChange={onChangeNested('images','image1')} placeholder="Image 1 URL" className="w-full border rounded px-3 py-2" required />
            <input value={form.images.image2} onChange={onChangeNested('images','image2')} placeholder="Image 2 URL" className="w-full border rounded px-3 py-2" />
            <input value={form.images.image3} onChange={onChangeNested('images','image3')} placeholder="Image 3 URL" className="w-full border rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input value={form.product_info.brand} onChange={onChangeNested('product_info','brand')} placeholder="Brand" className="w-full border rounded px-3 py-2" />
            <input value={form.product_info.manufacturer} onChange={onChangeNested('product_info','manufacturer')} placeholder="Manufacturer" className="w-full border rounded px-3 py-2" />
            <input value={form.product_info.SareeMaterial} onChange={onChangeNested('product_info','SareeMaterial')} placeholder="Material" className="w-full border rounded px-3 py-2" />
            <input value={form.product_info.SareeColor} onChange={onChangeNested('product_info','SareeColor')} placeholder="Color" className="w-full border rounded px-3 py-2" />
            <input value={form.product_info.SareeLength} onChange={onChangeNested('product_info','SareeLength')} placeholder="Length" className="w-full border rounded px-3 py-2" />
            <input value={form.product_info.IncludedComponents} onChange={onChangeNested('product_info','IncludedComponents')} placeholder="Included" className="w-full border rounded px-3 py-2" />
          </div>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded">{saving ? 'Saving...' : 'Create Product'}</button>
        </form>

        <div className="bg-white border rounded p-4">
          {loading ? (
            <div className="p-4">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">Image</th>
                    <th className="p-2">Title</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">MRP</th>
                    <th className="p-2">Discount</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((p) => (
                    <tr key={p._id} className="border-b">
                      <td className="p-2"><img src={p?.images?.image1} alt="" className="w-12 h-12 object-cover rounded" /></td>
                      <td className="p-2">{p.title}</td>
                      <td className="p-2">₹{priceFor(p).toLocaleString('en-IN')}</td>
                      <td className="p-2">₹{(p.mrp || 0).toLocaleString('en-IN')}</td>
                      <td className="p-2">{p.discountPercent || 0}%</td>
                      <td className="p-2">
                        <button onClick={() => remove(p._id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
