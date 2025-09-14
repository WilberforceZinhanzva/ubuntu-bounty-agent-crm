import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';

const Login = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = login(pin);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <User size={40} color="white" />
          </div>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            color: '#333',
            marginBottom: '8px'
          }}>
            Ubuntu Bounty
          </h1>
          <p style={{ color: '#666' }}>Lead Management System</p>
        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <Lock size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Enter PIN
            </label>
            <input
              type="password"
              className="form-input"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter your PIN"
              required
              maxLength="10"
              style={{ fontSize: '1.125rem', textAlign: 'center' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !pin}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? (
              <div className="spinner" style={{ width: '20px', height: '20px' }} />
            ) : (
              <>
                <Lock size={16} />
                Login
              </>
            )}
          </button>
        </form>

        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#666'
        }}>
          <strong>Default PIN:</strong> 2025
        </div>
      </div>
    </div>
  );
};

export default Login;