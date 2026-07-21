import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/format';

export default function Profile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const { data } = await api.get('/profile');
      setProfile(data);
      setName(data.name);
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const { data } = await api.put('/profile', {
        name,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined
      });
      updateUser(data.user);
      setProfile(data.user);
      setMessage('Profile updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile.');
    }
  };

  if (!profile) return <div className="page"><p>Loading profile...</p></div>;

  return (
    <div className="page">
      <h1>Profile</h1>

      <div className="panel panel-narrow">
        <h2>Account Details</h2>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Member since:</strong> {formatDate(profile.created_at)}</p>
      </div>

      <form className="auth-form panel-narrow" onSubmit={handleSubmit}>
        <h2>Update Profile</h2>
        {message && <p className="form-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}

        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Current Password (required to change password)</label>
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />

        <label>New Password</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} />

        <button type="submit" className="btn-primary">Save Changes</button>
      </form>
    </div>
  );
}
