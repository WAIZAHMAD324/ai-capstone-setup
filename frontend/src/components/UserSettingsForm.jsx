import { useState, useEffect } from 'react';
import {
  UserIcon,
  ShieldIcon,
  BellIcon,
  PaletteIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  CameraIcon,
  TrashIcon,
  KeyIcon,
  SmartphoneIcon,
  MonitorIcon,
  DownloadIcon,
  AlertTriangleIcon,
  SearchIcon,
  RefreshIcon,
  SunIcon,
  MoonIcon,
  SparklesIcon,
  InfoIcon
} from './Icons';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
];

const DEFAULT_SETTINGS = {
  profile: {
    avatar: AVATAR_PRESETS[0],
    firstName: 'Alex',
    lastName: 'Morgan',
    username: 'alexmorgan',
    email: 'alex.morgan@example.com',
    jobTitle: 'Senior Product Designer',
    department: 'Design Systems',
    bio: 'Passionate about crafting intuitive user interfaces, accessibility, and scalable web applications.',
    phone: '+1 (555) 234-5678',
    timezone: 'America/New_York',
    country: 'United States',
    website: 'https://alexmorgan.design'
  },
  security: {
    twoFactorEnabled: true,
    emailAlertsOnLogin: true,
    passwordLastChanged: '2026-05-14',
    activeSessions: [
      { id: 1, device: 'MacBook Pro 16" (Chrome)', location: 'New York, USA', status: 'Active now', isCurrent: true },
      { id: 2, device: 'iPhone 15 Pro (Safari)', location: 'New York, USA', status: '2 hours ago', isCurrent: false },
      { id: 3, device: 'Windows Desktop (Firefox)', location: 'Austin, USA', status: '3 days ago', isCurrent: false }
    ]
  },
  notifications: {
    emailProductUpdates: true,
    emailSecurityAlerts: true,
    emailWeeklyDigest: false,
    emailMarketing: false,
    pushDirectMessages: true,
    pushMentions: true,
    pushSystemUpdates: false,
    smsSecurityAuth: true,
    quietHours: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00'
  },
  appearance: {
    theme: 'dark', // 'light', 'dark', 'cyberpunk'
    accentColor: 'violet', // 'violet', 'indigo', 'emerald', 'amber', 'rose'
    fontSize: 'medium',
    compactDensity: false,
    enableAnimations: true,
    fontFamily: 'Inter'
  },
  privacy: {
    profileVisibility: 'public', // 'public', 'team', 'private'
    searchEngineIndexing: false,
    activityStatusVisible: true,
    dataUsageAnalytics: true,
    personalizedAds: false
  }
};

export default function UserSettingsForm() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('user_settings_v1');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [initialSettings, setInitialSettings] = useState(settings);
  const [activeTab, setActiveTab] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Password change state
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, next: false, confirm: false });
  const [passError, setPassError] = useState('');

  // Detect dirty state
  const isDirty = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  // Apply theme & accent to document element dynamically
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.appearance.theme);
    document.documentElement.setAttribute('data-accent', settings.appearance.accentColor);
    if (settings.appearance.compactDensity) {
      document.body.classList.add('compact-density');
    } else {
      document.body.classList.remove('compact-density');
    }
  }, [settings.appearance]);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleNestedChange = (category, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('user_settings_v1', JSON.stringify(settings));
      setInitialSettings(settings);
      setIsSaving(false);
      triggerToast('Settings updated successfully!', 'success');
    }, 600);
  };

  const handleReset = () => {
    setSettings(initialSettings);
    triggerToast('Unsaved changes discarded.', 'info');
  };

  const handleResetToDefault = () => {
    setSettings(DEFAULT_SETTINGS);
    setInitialSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('user_settings_v1');
    triggerToast('All settings reset to default values.', 'info');
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleNestedChange('profile', 'avatar', reader.result);
        triggerToast('Avatar image updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'var(--text-muted)' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: '#ef4444' };
      case 2:
        return { score: 50, label: 'Fair', color: '#f59e0b' };
      case 3:
        return { score: 75, label: 'Good', color: '#3b82f6' };
      case 4:
        return { score: 100, label: 'Strong', color: '#10b981' };
      default:
        return { score: 10, label: 'Too short', color: '#ef4444' };
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwords.current) {
      setPassError('Please enter your current password.');
      return;
    }
    if (passwords.next.length < 8) {
      setPassError('New password must be at least 8 characters long.');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPassError('New passwords do not match.');
      return;
    }
    setPassError('');
    setPasswords({ current: '', next: '', confirm: '' });
    handleNestedChange('security', 'passwordLastChanged', new Date().toISOString().split('T')[0]);
    triggerToast('Password changed successfully!', 'success');
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `user-settings-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('Account data exported as JSON.', 'success');
  };

  const handleRevokeSession = (sessionId) => {
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        activeSessions: prev.security.activeSessions.filter((s) => s.id !== sessionId)
      }
    }));
    triggerToast('Session revoked successfully.', 'info');
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: UserIcon, badge: null },
    { id: 'security', label: 'Account & Security', icon: ShieldIcon, badge: null },
    { id: 'notifications', label: 'Notifications', icon: BellIcon, badge: '4' },
    { id: 'appearance', label: 'Appearance & Themes', icon: PaletteIcon, badge: null },
    { id: 'privacy', label: 'Privacy & Data', icon: LockIcon, badge: null }
  ];

  const matchesSearch = (text) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const filteredTabs = tabs.filter((tab) => matchesSearch(tab.label));

  return (
    <div className="settings-app">
      {/* Top Header Navigation */}
      <header className="settings-header">
        <div className="header-brand">
          <div className="brand-logo">
            <SparklesIcon className="icon-pulse" />
          </div>
          <div>
            <h1 className="header-title">Account Settings</h1>
            <p className="header-subtitle">Manage your personal details, preferences, and security settings</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                ×
              </button>
            )}
          </div>

          <button className="btn-secondary btn-icon-only" onClick={handleResetToDefault} title="Reset all to defaults">
            <RefreshIcon />
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="settings-container">
        {/* Navigation Sidebar */}
        <aside className="settings-sidebar">
          <nav className="nav-menu">
            {filteredTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`nav-item ${active ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="nav-icon" />
                  <span className="nav-label">{tab.label}</span>
                  {tab.badge && <span className="nav-badge">{tab.badge}</span>}
                </button>
              );
            })}
          </nav>

          {/* Quick User Summary Card */}
          <div className="sidebar-user-card">
            <div className="avatar-wrapper">
              <img src={settings.profile.avatar} alt="User Avatar" className="user-avatar-sm" />
              <span className="online-indicator"></span>
            </div>
            <div className="user-info-sm">
              <div className="user-name">{settings.profile.firstName} {settings.profile.lastName}</div>
              <div className="user-email">{settings.profile.email}</div>
            </div>
          </div>
        </aside>

        {/* Tab Content Panel */}
        <main className="settings-content">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="tab-pane animated-fadeIn">
              <div className="pane-header">
                <h2>Public Profile</h2>
                <p>Information you add here will be visible to other users on your workspace.</p>
              </div>

              {/* Avatar Section */}
              <section className="form-card">
                <h3 className="card-title">Profile Picture</h3>
                <div className="avatar-edit-layout">
                  <div className="avatar-preview-lg">
                    <img src={settings.profile.avatar} alt="Profile" />
                    <label className="avatar-upload-overlay" title="Upload new photo">
                      <CameraIcon />
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} hidden />
                    </label>
                  </div>

                  <div className="avatar-controls">
                    <div className="preset-label">Choose from presets:</div>
                    <div className="avatar-presets">
                      {AVATAR_PRESETS.map((presetUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`preset-btn ${settings.profile.avatar === presetUrl ? 'selected' : ''}`}
                          onClick={() => handleNestedChange('profile', 'avatar', presetUrl)}
                        >
                          <img src={presetUrl} alt={`Preset ${idx + 1}`} />
                        </button>
                      ))}
                    </div>
                    <p className="help-text">JPG, PNG or GIF. Max file size 5MB.</p>
                  </div>
                </div>
              </section>

              {/* Profile Details Grid */}
              <section className="form-card">
                <h3 className="card-title">Personal Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      value={settings.profile.firstName}
                      onChange={(e) => handleNestedChange('profile', 'firstName', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      value={settings.profile.lastName}
                      onChange={(e) => handleNestedChange('profile', 'lastName', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <div className="input-prefix-group">
                      <span className="input-prefix">@</span>
                      <input
                        id="username"
                        type="text"
                        value={settings.profile.username}
                        onChange={(e) => handleNestedChange('profile', 'username', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => handleNestedChange('profile', 'email', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="jobTitle">Job Title</label>
                    <input
                      id="jobTitle"
                      type="text"
                      value={settings.profile.jobTitle}
                      onChange={(e) => handleNestedChange('profile', 'jobTitle', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <input
                      id="department"
                      type="text"
                      value={settings.profile.department}
                      onChange={(e) => handleNestedChange('profile', 'department', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group span-full">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      rows="3"
                      value={settings.profile.bio}
                      onChange={(e) => handleNestedChange('profile', 'bio', e.target.value)}
                      className="form-textarea"
                      placeholder="Write a short description about yourself..."
                    />
                    <span className="character-count">{settings.profile.bio.length}/240 characters</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      value={settings.profile.phone}
                      onChange={(e) => handleNestedChange('profile', 'phone', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="timezone">Timezone</label>
                    <select
                      id="timezone"
                      value={settings.profile.timezone}
                      onChange={(e) => handleNestedChange('profile', 'timezone', e.target.value)}
                      className="form-select"
                    >
                      <option value="America/New_York">Eastern Time (US & Canada)</option>
                      <option value="America/Chicago">Central Time (US & Canada)</option>
                      <option value="America/Denver">Mountain Time (US & Canada)</option>
                      <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: SECURITY */}
          {activeTab === 'security' && (
            <div className="tab-pane animated-fadeIn">
              <div className="pane-header">
                <h2>Account & Security</h2>
                <p>Manage your login credentials, two-factor authentication, and connected devices.</p>
              </div>

              {/* Password Form */}
              <section className="form-card">
                <h3 className="card-title">Change Password</h3>
                <form onSubmit={handlePasswordSubmit}>
                  {passError && <div className="alert alert-error">{passError}</div>}
                  <div className="form-grid">
                    <div className="form-group span-full">
                      <label htmlFor="currentPass">Current Password</label>
                      <div className="password-input-wrapper">
                        <input
                          id="currentPass"
                          type={showPass.current ? 'text' : 'password'}
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          className="form-input"
                          placeholder="••••••••••••"
                        />
                        <button
                          type="button"
                          className="toggle-pass-btn"
                          onClick={() => setShowPass({ ...showPass, current: !showPass.current })}
                        >
                          {showPass.current ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="nextPass">New Password</label>
                      <div className="password-input-wrapper">
                        <input
                          id="nextPass"
                          type={showPass.next ? 'text' : 'password'}
                          value={passwords.next}
                          onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                          className="form-input"
                          placeholder="At least 8 characters"
                        />
                        <button
                          type="button"
                          className="toggle-pass-btn"
                          onClick={() => setShowPass({ ...showPass, next: !showPass.next })}
                        >
                          {showPass.next ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>

                      {/* Strength Meter */}
                      {passwords.next && (
                        <div className="strength-meter">
                          <div className="strength-bar-track">
                            <div
                              className="strength-bar-fill"
                              style={{
                                width: `${calculatePasswordStrength(passwords.next).score}%`,
                                backgroundColor: calculatePasswordStrength(passwords.next).color
                              }}
                            ></div>
                          </div>
                          <span
                            className="strength-label"
                            style={{ color: calculatePasswordStrength(passwords.next).color }}
                          >
                            {calculatePasswordStrength(passwords.next).label}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPass">Confirm New Password</label>
                      <div className="password-input-wrapper">
                        <input
                          id="confirmPass"
                          type={showPass.confirm ? 'text' : 'password'}
                          value={passwords.confirm}
                          onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                          className="form-input"
                          placeholder="Re-enter new password"
                        />
                        <button
                          type="button"
                          className="toggle-pass-btn"
                          onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                        >
                          {showPass.confirm ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions-inline">
                    <button type="submit" className="btn-primary">
                      <KeyIcon /> Update Password
                    </button>
                    <span className="last-changed-text">
                      Last updated on {settings.security.passwordLastChanged}
                    </span>
                  </div>
                </form>
              </section>

              {/* Two-Factor Authentication */}
              <section className="form-card">
                <div className="card-header-flex">
                  <div>
                    <h3 className="card-title">Two-Factor Authentication (2FA)</h3>
                    <p className="card-subtitle">
                      Add an extra layer of security to your account using an authenticator app.
                    </p>
                  </div>
                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorEnabled}
                      onChange={(e) => handleNestedChange('security', 'twoFactorEnabled', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                {settings.security.twoFactorEnabled && (
                  <div className="two-factor-box animated-fadeIn">
                    <div className="two-fa-badge">
                      <CheckIcon /> 2FA Protection Active
                    </div>
                    <p className="two-factor-desc">
                      Your account is protected using TOTP authentication apps (like Google Authenticator or 1Password).
                    </p>
                    <button className="btn-secondary" onClick={() => triggerToast('Security recovery codes generated.')}>
                      View Backup Recovery Codes
                    </button>
                  </div>
                )}
              </section>

              {/* Active Sessions */}
              <section className="form-card">
                <h3 className="card-title">Active Logged-in Sessions</h3>
                <div className="sessions-list">
                  {settings.security.activeSessions.map((session) => (
                    <div key={session.id} className="session-item">
                      <div className="session-icon">
                        {session.device.includes('iPhone') ? <SmartphoneIcon /> : <MonitorIcon />}
                      </div>
                      <div className="session-details">
                        <div className="session-device">
                          {session.device} {session.isCurrent && <span className="current-badge">This Device</span>}
                        </div>
                        <div className="session-meta">
                          {session.location} • {session.status}
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <button
                          className="btn-danger-light"
                          onClick={() => handleRevokeSession(session.id)}
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="tab-pane animated-fadeIn">
              <div className="pane-header">
                <h2>Notification Preferences</h2>
                <p>Choose when and how you want to be notified about activity and updates.</p>
              </div>

              {/* Email Notifications */}
              <section className="form-card">
                <h3 className="card-title">Email Notifications</h3>
                <div className="toggle-list">
                  <div className="toggle-row">
                    <div className="toggle-label">
                      <strong>Product Announcements & Updates</strong>
                      <p>Receive emails about new features, improvements, and news.</p>
                    </div>
                    <label className="switch-toggle">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailProductUpdates}
                        onChange={(e) => handleNestedChange('notifications', 'emailProductUpdates', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="toggle-row">
                    <div className="toggle-label">
                      <strong>Security & Account Alerts</strong>
                      <p>Get notified immediately about logins from new devices or password changes.</p>
                    </div>
                    <label className="switch-toggle">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailSecurityAlerts}
                        onChange={(e) => handleNestedChange('notifications', 'emailSecurityAlerts', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="toggle-row">
                    <div className="toggle-label">
                      <strong>Weekly Summary Digest</strong>
                      <p>A concise weekly summary of team activity and performance statistics.</p>
                    </div>
                    <label className="switch-toggle">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailWeeklyDigest}
                        onChange={(e) => handleNestedChange('notifications', 'emailWeeklyDigest', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Push & In-App Notifications */}
              <section className="form-card">
                <h3 className="card-title">Push & Activity Alerts</h3>
                <div className="toggle-list">
                  <div className="toggle-row">
                    <div className="toggle-label">
                      <strong>Direct Messages</strong>
                      <p>Push notifications when someone sends you a direct message.</p>
                    </div>
                    <label className="switch-toggle">
                      <input
                        type="checkbox"
                        checked={settings.notifications.pushDirectMessages}
                        onChange={(e) => handleNestedChange('notifications', 'pushDirectMessages', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="toggle-row">
                    <div className="toggle-label">
                      <strong>Mentions & Comments</strong>
                      <p>Alerts when someone mentions your username or comments on your work.</p>
                    </div>
                    <label className="switch-toggle">
                      <input
                        type="checkbox"
                        checked={settings.notifications.pushMentions}
                        onChange={(e) => handleNestedChange('notifications', 'pushMentions', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Quiet Hours */}
              <section className="form-card">
                <div className="card-header-flex">
                  <div>
                    <h3 className="card-title">Do Not Disturb (Quiet Hours)</h3>
                    <p className="card-subtitle">Pause non-urgent notifications during set hours.</p>
                  </div>
                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={settings.notifications.quietHours}
                      onChange={(e) => handleNestedChange('notifications', 'quietHours', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                {settings.notifications.quietHours && (
                  <div className="form-grid inline-grid-2 margin-top-md animated-fadeIn">
                    <div className="form-group">
                      <label>Quiet Start Time</label>
                      <input
                        type="time"
                        value={settings.notifications.quietHoursStart}
                        onChange={(e) => handleNestedChange('notifications', 'quietHoursStart', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Quiet End Time</label>
                      <input
                        type="time"
                        value={settings.notifications.quietHoursEnd}
                        onChange={(e) => handleNestedChange('notifications', 'quietHoursEnd', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* TAB 4: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="tab-pane animated-fadeIn">
              <div className="pane-header">
                <h2>Appearance & Themes</h2>
                <p>Customize how the interface looks and feels across your devices.</p>
              </div>

              {/* Theme Selector */}
              <section className="form-card">
                <h3 className="card-title">Theme Mode</h3>
                <div className="theme-options-grid">
                  <button
                    type="button"
                    className={`theme-card ${settings.appearance.theme === 'light' ? 'selected' : ''}`}
                    onClick={() => handleNestedChange('appearance', 'theme', 'light')}
                  >
                    <div className="theme-preview preview-light">
                      <SunIcon />
                    </div>
                    <span className="theme-name">Light Mode</span>
                  </button>

                  <button
                    type="button"
                    className={`theme-card ${settings.appearance.theme === 'dark' ? 'selected' : ''}`}
                    onClick={() => handleNestedChange('appearance', 'theme', 'dark')}
                  >
                    <div className="theme-preview preview-dark">
                      <MoonIcon />
                    </div>
                    <span className="theme-name">Dark Mode</span>
                  </button>

                  <button
                    type="button"
                    className={`theme-card ${settings.appearance.theme === 'cyberpunk' ? 'selected' : ''}`}
                    onClick={() => handleNestedChange('appearance', 'theme', 'cyberpunk')}
                  >
                    <div className="theme-preview preview-cyberpunk">
                      <SparklesIcon />
                    </div>
                    <span className="theme-name">Cyber Neon</span>
                  </button>
                </div>
              </section>

              {/* Color Accent Picker */}
              <section className="form-card">
                <h3 className="card-title">Accent Color</h3>
                <div className="accent-picker">
                  {[
                    { id: 'violet', label: 'Violet', color: '#8b5cf6' },
                    { id: 'indigo', label: 'Indigo', color: '#6366f1' },
                    { id: 'emerald', label: 'Emerald', color: '#10b981' },
                    { id: 'amber', label: 'Amber', color: '#f59e0b' },
                    { id: 'rose', label: 'Rose', color: '#f43f5e' }
                  ].map((accent) => (
                    <button
                      key={accent.id}
                      type="button"
                      className={`accent-swatch ${settings.appearance.accentColor === accent.id ? 'active' : ''}`}
                      style={{ backgroundColor: accent.color }}
                      onClick={() => handleNestedChange('appearance', 'accentColor', accent.id)}
                      title={accent.label}
                    >
                      {settings.appearance.accentColor === accent.id && <CheckIcon />}
                    </button>
                  ))}
                </div>
              </section>

              {/* Interface Display Density & Motion */}
              <section className="form-card">
                <h3 className="card-title">Display & Layout Preferences</h3>
                <div className="toggle-list">
                  <div className="toggle-row">
                    <div className="toggle-label">
                      <strong>Compact Layout Density</strong>
                      <p>Reduce padding and spacing to fit more content on screen.</p>
                    </div>
                    <label className="switch-toggle">
                      <input
                        type="checkbox"
                        checked={settings.appearance.compactDensity}
                        onChange={(e) => handleNestedChange('appearance', 'compactDensity', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="toggle-row">
                    <div className="toggle-label">
                      <strong>Interface Animations</strong>
                      <p>Enable smooth transitions, hover effects, and micro-animations.</p>
                    </div>
                    <label className="switch-toggle">
                      <input
                        type="checkbox"
                        checked={settings.appearance.enableAnimations}
                        onChange={(e) => handleNestedChange('appearance', 'enableAnimations', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 5: PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="tab-pane animated-fadeIn">
              <div className="pane-header">
                <h2>Privacy & Data</h2>
                <p>Control who can see your profile and manage how your data is processed.</p>
              </div>

              {/* Visibility Settings */}
              <section className="form-card">
                <h3 className="card-title">Profile Visibility</h3>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={settings.privacy.profileVisibility === 'public'}
                      onChange={(e) => handleNestedChange('privacy', 'profileVisibility', e.target.value)}
                    />
                    <div className="radio-content">
                      <div className="radio-title">Public</div>
                      <div className="radio-desc">Anyone on the web can view your profile and public posts.</div>
                    </div>
                  </label>

                  <label className="radio-option">
                    <input
                      type="radio"
                      name="visibility"
                      value="team"
                      checked={settings.privacy.profileVisibility === 'team'}
                      onChange={(e) => handleNestedChange('privacy', 'profileVisibility', e.target.value)}
                    />
                    <div className="radio-content">
                      <div className="radio-title">Team Only</div>
                      <div className="radio-desc">Only authenticated members in your workspace can view your info.</div>
                    </div>
                  </label>

                  <label className="radio-option">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={settings.privacy.profileVisibility === 'private'}
                      onChange={(e) => handleNestedChange('privacy', 'profileVisibility', e.target.value)}
                    />
                    <div className="radio-content">
                      <div className="radio-title">Private</div>
                      <div className="radio-desc">Hidden from directory searches. Only admins can see profile.</div>
                    </div>
                  </label>
                </div>
              </section>

              {/* Data Export & Backup */}
              <section className="form-card">
                <h3 className="card-title">Export Account Data</h3>
                <p className="card-subtitle">
                  Download a JSON copy of all your profile configurations, active sessions, and setting history.
                </p>
                <button className="btn-secondary" onClick={handleExportData}>
                  <DownloadIcon /> Export Account Data (.json)
                </button>
              </section>

              {/* Danger Zone */}
              <section className="form-card card-danger">
                <h3 className="card-title title-danger">
                  <AlertTriangleIcon /> Danger Zone
                </h3>
                <p className="card-subtitle">
                  Deleting your account will permanently purge all your workspaces, personal data, and preferences.
                </p>
                <button className="btn-danger" onClick={() => setShowDeleteModal(true)}>
                  <TrashIcon /> Delete Account
                </button>
              </section>
            </div>
          )}
        </main>
      </div>

      {/* Floating Save Drawer when Form is Dirty */}
      {isDirty && (
        <div className="floating-save-bar animated-slideUp">
          <div className="save-bar-info">
            <InfoIcon />
            <span>You have unsaved changes in your settings.</span>
          </div>
          <div className="save-bar-actions">
            <button className="btn-secondary" onClick={handleReset}>
              Discard
            </button>
            <button className={`btn-primary ${isSaving ? 'loading' : ''}`} onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      {toast && (
        <div className={`toast-notification toast-${toast.type} animated-bounceIn`}>
          <CheckIcon />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-backdrop animated-fadeIn">
          <div className="modal-content">
            <div className="modal-header">
              <AlertTriangleIcon className="danger-icon-lg" />
              <h3>Delete Account Permanently</h3>
            </div>
            <p className="modal-body">
              This action <strong>cannot be undone</strong>. Please type <code>DELETE</code> below to confirm you want to permanently erase your account.
            </p>
            <input
              type="text"
              className="form-input margin-bottom-md"
              placeholder="Type DELETE"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="btn-danger"
                disabled={deleteConfirmText !== 'DELETE'}
                onClick={() => {
                  setShowDeleteModal(false);
                  handleResetToDefault();
                  triggerToast('Account deleted successfully.', 'info');
                }}
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
