import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PersonDialog } from "@/components/titles/title-detail-client";

const castMember = { id: 42, name: "Actor Name", character: "Lead" };

describe("PersonDialog", () => {
  it("closes from its close button", () => {
    const onClose = vi.fn();
    render(<PersonDialog castMember={castMember} person={null} error={false} onClose={onClose} />);

    fireEvent.pointerDown(screen.getByRole("button", { name: "Close cast details" }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes with Escape", () => {
    const onClose = vi.fn();
    render(<PersonDialog castMember={castMember} person={null} error={false} onClose={onClose} />);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not close when the dialog content is pressed", () => {
    const onClose = vi.fn();
    render(<PersonDialog castMember={castMember} person={null} error={false} onClose={onClose} />);

    fireEvent.pointerDown(screen.getByRole("dialog"));

    expect(onClose).not.toHaveBeenCalled();
  });
});
