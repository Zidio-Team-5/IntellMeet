import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { act } from "@testing-library/react";
import ProtectedRoute from "../../routes/ProtectedRoute.jsx";
import useAuthStore from "../../core/store/authStore.js";

function Wrapper({ initialEntries = ["/dashboard"], children }) {
  return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    act(() => useAuthStore.getState().logout());
  });

  it("redirects to / when unauthenticated", () => {
    render(
      <Wrapper>
        <ProtectedRoute>
          <div>Secret content</div>
        </ProtectedRoute>
      </Wrapper>
    );
    expect(screen.queryByText("Secret content")).not.toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    act(() => useAuthStore.getState().login({ name: "Jane" }, "tok"));

    render(
      <Wrapper>
        <ProtectedRoute>
          <div>Secret content</div>
        </ProtectedRoute>
      </Wrapper>
    );
    expect(screen.getByText("Secret content")).toBeInTheDocument();
  });
});
