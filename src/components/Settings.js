import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Upload, 
  Image, 
  Save, 
  Building2,
  Palette,
  Shield,
  Info
} from 'lucide-react';

const Settings = () => {
  const { settings, saveSettings } = useData();
  const { user } = useAuth();
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(settings.companyLogo || null);
  const [message, setMessage] = useState('');

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setLogoFile(file);
        setMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogo = () => {
    if (logoPreview) {
      saveSettings({
        ...settings,
        companyLogo: logoPreview
      });
      setMessage('Company logo updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
    saveSettings({
      ...settings,
      companyLogo: null
    });
    setMessage('Company logo removed successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>
          Settings
        </h1>
        <p style={{ color: '#666' }}>
          Configure system settings and preferences
        </p>
      </div>

      {message && (
        <div className={message.includes('successfully') ? 'success' : 'error'}>
          {message}
        </div>
      )}

      {/* Company Logo Settings */}
      {user?.role === 'super_admin' && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Building2 size={20} />
            Company Logo
          </h2>

          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div>
              <div className="form-group">
                <label className="form-label">Upload Company Logo</label>
                <div style={{ 
                  border: '2px dashed #e0e0e0', 
                  borderRadius: '8px', 
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#4CAF50';
                }}
                onDragLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  const files = e.dataTransfer.files;
                  if (files.length > 0) {
                    const event = { target: { files } };
                    handleLogoUpload(event);
                  }
                }}
                onClick={() => document.getElementById('logo-upload').click()}
                >
                  <Upload size={32} style={{ margin: '0 auto 12px', color: '#666' }} />
                  <p style={{ margin: '0 0 8px', color: '#666' }}>
                    Click to upload or drag and drop
                  </p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#999' }}>
                    PNG, JPG, GIF up to 5MB
                  </p>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              {logoPreview && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button
                    onClick={handleSaveLogo}
                    className="btn btn-primary"
                  >
                    <Save size={16} />
                    Save Logo
                  </button>
                  <button
                    onClick={handleRemoveLogo}
                    className="btn btn-danger"
                  >
                    Remove Logo
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="form-label">Preview</label>
              <div style={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: '8px', 
                padding: '20px',
                textAlign: 'center',
                background: '#f9f9f9',
                minHeight: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {logoPreview ? (
                  <img 
                    src={logoPreview} 
                    alt="Company Logo Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '80px',
                      borderRadius: '4px'
                    }}
                  />
                ) : (
                  <div style={{ color: '#666' }}>
                    <Image size={32} style={{ margin: '0 auto 8px' }} />
                    <p>No logo uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Information */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Info size={20} />
          System Information
        </h2>

        <div className="grid grid-2">
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>
              Application Details
            </h4>
            <div style={{ fontSize: '0.875rem', color: '#666', lineHeight: '1.6' }}>
              <div><strong>Application:</strong> Ubuntu Bounty Lead Management</div>
              <div><strong>Version:</strong> 1.0.0</div>
              <div><strong>Built with:</strong> React 18.2.0</div>
              <div><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>
              Current User
            </h4>
            <div style={{ fontSize: '0.875rem', color: '#666', lineHeight: '1.6' }}>
              <div><strong>Name:</strong> {user?.name} {user?.surname}</div>
              <div><strong>Role:</strong> {user?.role === 'super_admin' ? 'Super Admin' : 'User'}</div>
              <div><strong>Permissions:</strong> {user?.permissions?.join(', ')}</div>
              <div><strong>Login PIN:</strong> ••••</div>
            </div>
          </div>
        </div>
      </div>

      {/* Design Theme */}
      <div className="card">
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Palette size={20} />
          Design Theme
        </h2>

        <div>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            The application uses a modern blue and green color scheme as specified in the requirements.
          </p>
          
          <div className="grid grid-4">
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                borderRadius: '8px',
                margin: '0 auto 8px'
              }}></div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>Primary Green</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>#4CAF50</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                borderRadius: '8px',
                margin: '0 auto 8px'
              }}></div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>Primary Blue</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>#2196F3</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '8px',
                margin: '0 auto 8px'
              }}></div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>Background</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>Gradient</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: '#ffffff',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                margin: '0 auto 8px'
              }}></div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>Cards</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>#FFFFFF</div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      {user?.role === 'super_admin' && (
        <div className="card" style={{ marginTop: '20px', background: '#f8f9fa' }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Shield size={20} />
            Security Notice
          </h2>
          
          <div style={{ fontSize: '0.875rem', color: '#666', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '12px' }}>
              <strong>Data Storage:</strong> All data is stored locally in your browser's localStorage. 
              This ensures privacy but means data will be lost if browser data is cleared.
            </p>
            <p style={{ marginBottom: '12px' }}>
              <strong>Default PIN:</strong> The system uses PIN 2025 for authentication. 
              You can customize PINs for individual users in the User Management section.
            </p>
            <p style={{ margin: 0 }}>
              <strong>Backup:</strong> Consider regularly exporting your data using the export 
              functions in the Lead Management section to prevent data loss.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;