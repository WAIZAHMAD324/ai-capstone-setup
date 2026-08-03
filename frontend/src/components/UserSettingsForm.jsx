import { useState } from 'react';

export default function UserSettingsForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validate = (data) => {
    const errors = {};

    if (!data.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    } else if (data.fullName.trim().length < 3) {
      errors.fullName = 'Full Name must be at least 3 characters';
    }

    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!data.password) {
      errors.password = 'Password is required';
    } else if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!data.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (data.confirmPassword !== data.password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const errors = validate(formData);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setSuccessMessage('');
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (isValid) {
      setSuccessMessage('Settings saved successfully');
    }
  };

  const showError = (field) => (touched[field] || submitted) && errors[field];

  return (
    <form onSubmit={handleSubmit} noValidate className="user-settings-form">
      <h2>User Settings</h2>

      {successMessage && (
        <div role="status" className="success-message">
          {successMessage}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="fullName">Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!showError('fullName')}
          aria-describedby={showError('fullName') ? 'fullName-error' : undefined}
        />
        {showError('fullName') && (
          <span id="fullName-error" className="error-message" role="alert">
            {errors.fullName}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!showError('email')}
          aria-describedby={showError('email') ? 'email-error' : undefined}
        />
        {showError('email') && (
          <span id="email-error" className="error-message" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!showError('password')}
          aria-describedby={showError('password') ? 'password-error' : undefined}
        />
        {showError('password') && (
          <span id="password-error" className="error-message" role="alert">
            {errors.password}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!showError('confirmPassword')}
          aria-describedby={showError('confirmPassword') ? 'confirmPassword-error' : undefined}
        />
        {showError('confirmPassword') && (
          <span id="confirmPassword-error" className="error-message" role="alert">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      <button type="submit" disabled={!isValid}>
        Save Settings
      </button>
    </form>
  );
}
