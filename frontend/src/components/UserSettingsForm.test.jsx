import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserSettingsForm from './UserSettingsForm';

describe('UserSettingsForm', () => {
  it('renders required validation errors when fields are empty and interacted with', async () => {
    render(<UserSettingsForm />);
    const submitButton = screen.getByRole('button', { name: /save settings/i });
    expect(submitButton).toBeDisabled();

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.blur(fullNameInput);
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    fireEvent.blur(confirmPasswordInput);

    expect(await screen.findByText('Full Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password is required')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<UserSettingsForm />);

    const emailInput = screen.getByLabelText(/^email$/i);
    await user.type(emailInput, 'invalid-email');
    fireEvent.blur(emailInput);

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /save settings/i });
    expect(submitButton).toBeDisabled();
  });

  it('validates password match', async () => {
    const user = userEvent.setup();
    render(<UserSettingsForm />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password456');

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /save settings/i });
    expect(submitButton).toBeDisabled();
  });

  it('handles successful submission when form is valid', async () => {
    const user = userEvent.setup();
    render(<UserSettingsForm />);

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /save settings/i });

    await user.type(fullNameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    expect(submitButton).not.toBeDisabled();
    await user.click(submitButton);

    expect(screen.getByText('Settings saved successfully')).toBeInTheDocument();
  });
});
