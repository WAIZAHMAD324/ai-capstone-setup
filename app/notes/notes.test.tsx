import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NotesPage from "./page";

describe("Smart Notes Component", () => {
  it("renders the heading and initial UI correctly", () => {
    render(<NotesPage />);
    expect(
      screen.getByRole("heading", { name: /AI Smart Notes & Action Items/i })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Paste lecture notes/i)
    ).toBeInTheDocument();
  });

  it("populates sample notes when sample button is clicked", () => {
    render(<NotesPage />);
    const sampleBtn = screen.getByRole("button", { name: /Load Sample Notes/i });
    fireEvent.click(sampleBtn);

    const textarea = screen.getByPlaceholderText(/Paste lecture notes/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain("CS101 Algorithm Study Group");
  });

  it("keeps extract button disabled if notes are less than 20 characters", () => {
    render(<NotesPage />);
    const extractBtn = screen.getByRole("button", { name: /Extract with AI/i });
    expect(extractBtn).toBeDisabled();

    const textarea = screen.getByPlaceholderText(/Paste lecture notes/i);
    fireEvent.change(textarea, { target: { value: "Short note" } });
    expect(extractBtn).toBeDisabled();

    fireEvent.change(textarea, { target: { value: "This is a sufficiently long note with more than 20 characters." } });
    expect(extractBtn).not.toBeDisabled();
  });
});