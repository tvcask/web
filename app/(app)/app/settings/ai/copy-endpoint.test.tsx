import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CopyEndpoint } from "./copy-endpoint";

describe("copy connection address", () => {
  it("copies the complete address and announces success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(<CopyEndpoint value="https://api.example.test/mcp" />);
    fireEvent.click(screen.getByRole("button", { name: "Copy address" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Copied"));
    expect(writeText).toHaveBeenCalledWith("https://api.example.test/mcp");
  });

  it("leaves a selectable address when clipboard access is denied", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    render(<CopyEndpoint value="https://api.example.test/mcp" />);
    fireEvent.click(screen.getByRole("button", { name: "Copy address" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("copy it manually"));
    expect(screen.getByRole("textbox", { name: "MCP server address" })).toHaveValue("https://api.example.test/mcp");
  });
});
