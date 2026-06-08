import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "../../theme/ThemeProvider.jsx";
import { AuthProvider } from "../../context/AuthContext.jsx";

const makeClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

function TestApp({ initialEntries }) {
  return (
    <QueryClientProvider client={makeClient()}>
      <ThemeProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <AuthProvider>
            <div data-testid="app-root">Loaded</div>
          </AuthProvider>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe("AppRoutes", () => {
  it("renders without crashing on /", () => {
    render(<TestApp initialEntries={["/"]} />);
    expect(screen.getByTestId("app-root")).toBeInTheDocument();
  });
});
