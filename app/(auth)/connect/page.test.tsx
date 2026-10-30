import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import Consent from "./page";
vi.mock("@/lib/api", () => ({ api: vi.fn() }));
vi.mock("@/lib/auth/session", () => ({ getCurrentUser: async () => ({ email: "viewer@example.test" }) }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/components/ui/submit-button", () => ({ SubmitButton: ({ children }: { children: React.ReactNode }) => <button>{children}</button> }));
const props = { searchParams: Promise.resolve({ scope: "tvcask:read tvcask:write" }) };
describe("AI connection consent", () => {
  it("requires a separate unchecked opt-in for requested write access", async () => {
    vi.mocked(api).mockResolvedValue({ clientName: "Test assistant", redirectUri: "https://client.test/callback", scope: "tvcask:read tvcask:write" });
    render(await Consent(props));
    expect(screen.getByRole("checkbox", { name: /Also allow library management/ })).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Allow selected access" })).toBeInTheDocument();
    expect(screen.getByText(/publish lists, and delete lists/)).toBeInTheDocument();
  });
  it("does not offer writes when only read access was requested", async () => {
    vi.mocked(api).mockResolvedValue({ clientName: "Test assistant", redirectUri: "https://client.test/callback", scope: "tvcask:read" });
    render(await Consent(props));
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Allow read access" })).toBeInTheDocument();
  });
  it("never offers consent after a failed server verification", async () => {
    vi.mocked(api).mockRejectedValue(new Error("unverified"));
    render(await Consent(props));
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("This connection couldn’t be verified")).toBeInTheDocument();
  });
});
