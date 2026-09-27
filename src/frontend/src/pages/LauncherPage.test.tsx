import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { APPS } from "@/lib/apps";
import { TestRouter, type buildRouter } from "@/test/TestRouter";

function renderLauncher(initialPath = "/") {
  return render(<TestRouter initialPath={initialPath} />);
}

async function findGrid() {
  return screen.findByTestId("launcher.app_grid");
}

describe("LauncherPage", () => {
  it("renders the featured Among Us hero with a Jugar action", async () => {
    renderLauncher();

    const hero = await screen.findByTestId("launcher.hero");
    expect(
      within(hero).getByRole("heading", { name: "Among Us" }),
    ).toBeInTheDocument();
    expect(
      within(hero).getByRole("button", { name: /jugar/i }),
    ).toBeInTheDocument();
  });

  it("shows at least 8 app cards with name and category", async () => {
    renderLauncher();

    const grid = await findGrid();
    const cards = within(grid).getAllByTestId(/^launcher\.app_card\./);
    expect(cards.length).toBeGreaterThanOrEqual(8);

    // Every card exposes its name and a human-readable category label.
    expect(within(grid).getByText("Discord")).toBeInTheDocument();
    expect(within(grid).getAllByText("Social").length).toBeGreaterThan(0);
    expect(within(grid).getByText("Calculadora")).toBeInTheDocument();
    expect(within(grid).getAllByText("Utilidades").length).toBeGreaterThan(0);
  });

  it("filters apps by name in real time and shows the empty state", async () => {
    const user = userEvent.setup();
    renderLauncher();

    const search = await screen.findByLabelText("Buscar apps");
    await user.type(search, "disc");

    const grid = await findGrid();
    expect(within(grid).getByText("Discord")).toBeInTheDocument();
    expect(within(grid).queryByText("Calculadora")).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "zzzz-no-match");

    expect(
      await screen.findByTestId("launcher.empty_state"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/ninguna app coincide con tu búsqueda o filtro/i),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("launcher.app_grid")).not.toBeInTheDocument();
  });

  it("filters by category chip and reflects the active filter in the URL", async () => {
    const user = userEvent.setup();
    let router: ReturnType<typeof buildRouter> | undefined;
    render(
      <TestRouter
        initialPath="/"
        onRouter={(instance) => {
          router = instance;
        }}
      />,
    );

    await user.click(await screen.findByTestId("launcher.filter.juegos"));

    const grid = await findGrid();
    expect(within(grid).getByText("Among Us")).toBeInTheDocument();
    expect(within(grid).queryByText("Discord")).not.toBeInTheDocument();

    expect(screen.getByTestId("launcher.filter.juegos")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(router?.state.location.search).toMatchObject({ cat: "juegos" });
  });

  it("hydrates the active filter from the URL", async () => {
    renderLauncher("/?cat=social");

    const grid = await findGrid();
    expect(within(grid).getByText("Discord")).toBeInTheDocument();
    expect(within(grid).queryByText("Among Us")).not.toBeInTheDocument();
    expect(screen.getByTestId("launcher.filter.social")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("marks an app as favorite and surfaces it under the Favoritos filter", async () => {
    const user = userEvent.setup();
    renderLauncher();

    const discordCard = await screen.findByTestId("launcher.app_card.2");
    await user.click(
      within(discordCard).getByRole("button", {
        name: /añadir discord a favoritos/i,
      }),
    );

    await user.click(screen.getByTestId("launcher.filter.favoritos"));

    const grid = await findGrid();
    expect(within(grid).getByText("Discord")).toBeInTheDocument();
    expect(within(grid).queryByText("Among Us")).not.toBeInTheDocument();
  });

  it("persists favorites across a remount", async () => {
    const user = userEvent.setup();
    const first = renderLauncher();

    await user.click(
      within(await screen.findByTestId("launcher.app_card.2")).getByRole(
        "button",
        { name: /añadir discord a favoritos/i },
      ),
    );
    first.unmount();

    renderLauncher("/?cat=favoritos");
    const grid = await findGrid();
    expect(within(grid).getByText("Discord")).toBeInTheDocument();
  });

  it("records an opened app in the Recientes row and persists it", async () => {
    const user = userEvent.setup();
    const first = renderLauncher();

    await user.click(await screen.findByTestId("launcher.app_open_button.2"));
    first.unmount();

    renderLauncher();
    const recents = await screen.findByRole("region", { name: /recientes/i });
    expect(within(recents).getByText("Discord")).toBeInTheDocument();
  });

  it("exposes every catalog app through the grid", async () => {
    renderLauncher();
    const grid = await findGrid();
    for (const app of APPS) {
      expect(within(grid).getByText(app.name)).toBeInTheDocument();
    }
  });

  it("opens the Among Us detail from its grid card", async () => {
    const user = userEvent.setup();
    renderLauncher();

    const grid = await findGrid();
    await user.click(within(grid).getByTestId("launcher.app_open_button.1"));

    expect(
      await screen.findByTestId("launcher.detail_panel"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Among Us" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /jugar/i })).toBeInTheDocument();
  });

  it("opens the Among Us detail from the hero Jugar action", async () => {
    const user = userEvent.setup();
    renderLauncher();

    const hero = await screen.findByTestId("launcher.hero");
    await user.click(within(hero).getByRole("button", { name: /jugar/i }));

    expect(
      await screen.findByTestId("launcher.detail_panel"),
    ).toBeInTheDocument();
  });

  it("reaches the launch screen from the Among Us card", async () => {
    const user = userEvent.setup();
    renderLauncher();

    const grid = await findGrid();
    await user.click(within(grid).getByTestId("launcher.app_open_button.1"));

    await user.click(await screen.findByRole("button", { name: /jugar/i }));

    expect(
      await screen.findByRole("progressbar", {
        name: /progreso de lanzamiento/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /abrir among us/i }),
    ).toBeInTheDocument();
  });

  it("reaches the launch screen from the detail Jugar action", async () => {
    const user = userEvent.setup();
    renderLauncher("/app/among-us");

    await user.click(await screen.findByRole("button", { name: /jugar/i }));

    expect(
      await screen.findByRole("progressbar", {
        name: /progreso de lanzamiento/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /abrir among us/i }),
    ).toBeInTheDocument();
  });
});
