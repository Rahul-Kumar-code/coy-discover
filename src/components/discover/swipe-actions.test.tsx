import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SwipeActions } from "@/components/discover/swipe-actions";

describe("SwipeActions", () => {
  it("calls LIKE and PASS once while enabled", () => {
    const onLike = vi.fn();
    const onPass = vi.fn();

    render(<SwipeActions onLike={onLike} onPass={onPass} />);

    fireEvent.click(screen.getByRole("button", { name: "Pass on profile" }));
    fireEvent.click(screen.getByRole("button", { name: "Like profile" }));

    expect(onPass).toHaveBeenCalledOnce();
    expect(onLike).toHaveBeenCalledOnce();
  });

  it("disables both actions while processing", () => {
    render(<SwipeActions onLike={() => undefined} onPass={() => undefined} disabled />);

    expect(screen.getByRole("button", { name: "Pass on profile" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Like profile" })).toBeDisabled();
  });
});
