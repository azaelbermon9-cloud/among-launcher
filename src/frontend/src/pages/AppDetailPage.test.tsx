import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { TestRouter } from "@/test/TestRouter";

describe("AppDetailPage", () => {
  it("shows the app icon, name, category, description and primary action", async () => {
    render(<TestRouter initialPath="/app/among-us" />);

    expect(
      await screen.findByRole("heading", { name: "Among Us" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Juegos")).toBeInTheDocument();
    expect(screen.getByText(/completa tareas en la nave/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /jugar/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /añadir a favoritos/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /compartir/i }),
    ).toBeInTheDocument();
  });

  it("toggles the favorite state from the detail view", async () => {
    const user = userEvent.setup();
    render(<TestRouter initialPath="/app/among-us" />);

    const favorite = await screen.findByRole("button", {
      name: /añadir a favoritos/i,
    });
    await user.click(favorite);

    expect(
      screen.getByRole("button", { name: /en favoritos/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("navigates back to the launcher grid", async () => {
    const user = userEvent.setup();
    render(<TestRouter initialPath="/app/among-us" />);

    await user.click(
      await screen.findByRole("button", { name: /volver al launcher/i }),
    );

    expect(await screen.findByTestId("launcher.app_grid")).toBeInTheDocument();
  });

  it("records the app as recent when Jugar starts the launch", async () => {
    const user = userEvent.setup();
    const first = render(<TestRouter initialPath="/app/among-us" />);

    await user.click(await screen.findByRole("button", { name: /jugar/i }));
    await screen.findByRole("progressbar", {
      name: /progreso de lanzamiento/i,
    });
    first.unmount();

    render(<TestRouter initialPath="/" />);
    const recents = await screen.findByRole("region", { name: /recientes/i });
    expect(within(recents).getByText("Among Us")).toBeInTheDocument();
  });

  it("shows a not-found state for an unknown app id", async () => {
    render(<TestRouter initialPath="/app/does-not-exist" />);

    expect(await screen.findByText("App no encontrada")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /volver al launcher/i }),
    ).toBeInTheDocument();
  });
});
