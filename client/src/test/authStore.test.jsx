import { describe, it, expect, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import useAuthStore from "../core/store/authStore.js";

describe("authStore", () => {
  beforeEach(() => {
    // Reset store state between tests
    act(() => useAuthStore.getState().logout());
  });

  it("initialises with empty state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("logs in user and sets isAuthenticated", () => {
    const user = { name: "Jane", email: "jane@example.com" };
    const token = "test-token-abc";

    act(() => useAuthStore.getState().login(user, token));

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.token).toBe(token);
    expect(state.isAuthenticated).toBe(true);
  });

  it("logs out and clears state", () => {
    act(() => useAuthStore.getState().login({ name: "Jane" }, "tok"));
    act(() => useAuthStore.getState().logout());

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("updateUser merges fields", () => {
    act(() => useAuthStore.getState().login({ name: "Jane", email: "jane@a.com" }, "tok"));
    act(() => useAuthStore.getState().updateUser({ department: "Engineering" }));

    const { user } = useAuthStore.getState();
    expect(user.name).toBe("Jane");
    expect(user.department).toBe("Engineering");
  });
});
