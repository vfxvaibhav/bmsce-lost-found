import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../utils/api';

export default function ReportFound() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    color: '',
    location: '',
    dateLostFound: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    data.append('type', 'found');
    if (image) data.append('image', image);

    try {
      await api.post('/items/report', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      router.push('/student/dashboard');
    } catch (error) {
      alert('Failed to report item');
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>Report Found Item</h1>
      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <div className="form-group">
          <label>Item Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            required
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="books">Books</option>
            <option value="documents">Documents</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Color</label>
          <input
            type="text"
            value={formData.color}
            onChange={(e) => setFormData({...formData, color: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Location Found</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Date Found</label>
          <input
            type="date"
            value={formData.dateLostFound}
            onChange={(e) => setFormData({...formData, dateLostFound: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Reporting...' : 'Report Found Item'}
        </button>
      </form>
    </div>
  );
}