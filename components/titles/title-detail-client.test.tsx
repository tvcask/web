import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PersonDialog } from "@/components/titles/title-detail-client";

const castMember = { id: 42, name: "Actor Name", character: "Lead" };

const credit = {
  id: "t1",
  title: "Another Show",
  type: "tv" as const,
  category: "tv_show" as const,
  genres: [],
  character: "Someone Else"
};

describe("PersonDialog", () => {
  it("closes from its close button", () => {
    const onClose = vi.fn();
    render(<PersonDialog castMember={castMember} person={null} credits={null} error={false} onClose={onClose} />);

    fireEvent.pointerDown(screen.getByRole("button", { name: "Close cast details" }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes with Escape", () => {
    const onClose = vi.fn();
    render(<PersonDialog castMember={castMember} person={null} credits={null} error={false} onClose={onClose} />);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("links each credit to its title page", () => {
    render(
      <PersonDialog castMember={castMember} person={null} credits={[credit]} error={false} onClose={vi.fn()} />
    );

    expect(screen.getByRole("link", { name: /Another Show/ })).toHaveAttribute("href", "/app/titles/t1");
  });

  it("hides the filmography when there are no credits", () => {
    render(<PersonDialog castMember={castMember} person={null} credits={[]} error={false} onClose={vi.fn()} />);

    expect(screen.queryByText("Also in")).not.toBeInTheDocument();
  });

  it("does not close when the dialog content is pressed", () => {
    const onClose = vi.fn();
    render(<PersonDialog castMember={castMember} person={null} credits={null} error={false} onClose={onClose} />);

    fireEvent.pointerDown(screen.getByRole("dialog"));

    expect(onClose).not.toHaveBeenCalled();
  });
});
