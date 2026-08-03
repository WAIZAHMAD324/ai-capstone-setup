import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("Settings Form", () => {
  test("renders all form fields", () => {
    render(<App />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/confirm password/i)
    ).toBeInTheDocument();
  });

  test("submit button is disabled initially", () => {
    render(<App />);
    const button = screen.getByRole("button", { name: /save settings/i });
    expect(button).toBeDisabled();
  });

  test("shows validation error for invalid email", () => {
    render(<App />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
  });

  test("submits successfully with valid data", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "John Doe" },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "123456" },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "123456" },
    });

    const button = screen.getByRole("button", { name: /save settings/i });
    fireEvent.click(button);

    expect(
      screen.getByText(/settings saved successfully/i)
    ).toBeInTheDocument();
  });
});