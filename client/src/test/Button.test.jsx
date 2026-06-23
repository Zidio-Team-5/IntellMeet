import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../shared/ui/Button.jsx";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick handler", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText("Click"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when loading", () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies correct variant class for primary", () => {
    render(<Button variant="primary">Primary</Button>);
    // Primary uses the brand gradient (current design token).
    expect(screen.getByRole("button").className).toContain("var(--gradient-brand)");
  });

  it("applies correct variant class for danger", () => {
    render(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole("button").className).toContain("bg-[var(--error)]");
  });
});