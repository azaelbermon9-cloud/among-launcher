import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TestRouter } from "@/test/TestRouter";

const PROTOCOL_TIMEOUT_MS = 1800;

describe("LaunchPage", () => {
  beforeEach(() => {
    // `shouldAdvanceTime` keeps the router's async initial render resolving
    // while still letting tests drive the launch progress interval.
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the loading animation and status message", async () => {
    render(<TestRouter initialPath="/app/among-us/launch" />);

    const progress = await screen.findByRole("progressbar", {
      name: /progreso de lanzamiento/i,
    });
    expect(progress).toBeInTheDocument();
    expect(screen.getByText(/preparando motores/i)).toBeInTheDocument();
  });

  it("enables Abrir Among Us once loading completes", async () => {
    render(<TestRouter initialPath="/app/among-us/launch" />);

    const openButton = await screen.findByRole("button", {
      name: /abrir among us/i,
    });
    expect(openButton).toBeDisabled();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(openButton).toBeEnabled();
    expect(screen.getByText(/sistemas listos/i)).toBeInTheDocument();
  });

  it("attempts the amongus:// protocol and shows the fallback notice", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TestRouter initialPath="/app/among-us/launch" />);

    await screen.findByRole("progressbar", {
      name: /progreso de lanzamiento/i,
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await user.click(screen.getByRole("button", { name: /abrir among us/i }));

    act(() => {
      vi.advanceTimersByTime(PROTOCOL_TIMEOUT_MS + 100);
    });

    const notice = screen.getByTestId("launch.protocol_notice");
    expect(notice).toBeInTheDocument();
    expect(screen.getByText("amongus://")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /copiar enlace/i }),
    ).toBeInTheDocument();
  });

  it("copies the protocol link to the clipboard and confirms visually", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<TestRouter initialPath="/app/among-us/launch" />);

    await screen.findByRole("progressbar", {
      name: /progreso de lanzamiento/i,
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    await user.click(screen.getByRole("button", { name: /abrir among us/i }));
    act(() => {
      vi.advanceTimersByTime(PROTOCOL_TIMEOUT_MS + 100);
    });

    await user.click(screen.getByRole("button", { name: /copiar enlace/i }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("amongus://");
    });
    expect(
      await screen.findByText(/enlace copiado al portapapeles/i),
    ).toBeInTheDocument();
  });

  it("returns to the launcher grid", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TestRouter initialPath="/app/among-us/launch" />);

    await user.click(
      await screen.findByRole("button", { name: /volver al launcher/i }),
    );

    expect(await screen.findByTestId("launcher.app_grid")).toBeInTheDocument();
  });

  it("shows a not-found state for an unknown app id", async () => {
    render(<TestRouter initialPath="/app/does-not-exist/launch" />);

    expect(await screen.findByTestId("launch.error_state")).toBeInTheDocument();
    expect(screen.getByText("App no encontrada")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /volver al launcher/i }),
    ).toBeInTheDocument();
  });

  it("derives the protocol from the app id when none is declared", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TestRouter initialPath="/app/calculadora/launch" />);

    await screen.findByRole("progressbar", {
      name: /progreso de lanzamiento/i,
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await user.click(
      screen.getByRole("button", { name: /abrir calculadora/i }),
    );
    act(() => {
      vi.advanceTimersByTime(PROTOCOL_TIMEOUT_MS + 100);
    });

    expect(screen.getByText("calculadora://")).toBeInTheDocument();
  });

  it("falls back to execCommand when the clipboard API is unavailable", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommand,
    });

    render(<TestRouter initialPath="/app/among-us/launch" />);

    await screen.findByRole("progressbar", {
      name: /progreso de lanzamiento/i,
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    await user.click(screen.getByRole("button", { name: /abrir among us/i }));
    act(() => {
      vi.advanceTimersByTime(PROTOCOL_TIMEOUT_MS + 100);
    });

    await user.click(screen.getByRole("button", { name: /copiar enlace/i }));

    await waitFor(() => {
      expect(execCommand).toHaveBeenCalledWith("copy");
    });
    expect(
      await screen.findByText(/enlace copiado al portapapeles/i),
    ).toBeInTheDocument();
  });

  it("attempts to navigate to the amongus:// protocol when Abrir is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const hrefSetter = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        ...window.location,
        set href(value: string) {
          hrefSetter(value);
        },
        get href() {
          return "http://localhost/";
        },
      },
    });

    render(<TestRouter initialPath="/app/among-us/launch" />);

    await screen.findByRole("progressbar", {
      name: /progreso de lanzamiento/i,
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await user.click(screen.getByRole("button", { name: /abrir among us/i }));

    expect(hrefSetter).toHaveBeenCalledWith("amongus://");
  });

  it("re-attempts the protocol and re-shows the notice on a second Abrir click", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TestRouter initialPath="/app/among-us/launch" />);

    await screen.findByRole("progressbar", {
      name: /progreso de lanzamiento/i,
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    const openButton = screen.getByRole("button", { name: /abrir among us/i });
    await user.click(openButton);
    act(() => {
      vi.advanceTimersByTime(PROTOCOL_TIMEOUT_MS + 100);
    });
    expect(screen.getByTestId("launch.protocol_notice")).toBeInTheDocument();

    // A second attempt clears the notice immediately, then re-arms the timeout.
    await user.click(openButton);
    expect(
      screen.queryByTestId("launch.protocol_notice"),
    ).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(PROTOCOL_TIMEOUT_MS + 100);
    });
    expect(screen.getByTestId("launch.protocol_notice")).toBeInTheDocument();
  });

  it("does not show the fallback notice before the protocol timeout elapses", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TestRouter initialPath="/app/among-us/launch" />);

    await screen.findByRole("progressbar", {
      name: /progreso de lanzamiento/i,
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await user.click(screen.getByRole("button", { name: /abrir among us/i }));

    act(() => {
      vi.advanceTimersByTime(PROTOCOL_TIMEOUT_MS - 200);
    });

    expect(
      screen.queryByTestId("launch.protocol_notice"),
    ).not.toBeInTheDocument();
  });

  it("resets the copy confirmation back to idle after the feedback window", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<TestRouter initialPath="/app/among-us/launch" />);

    await screen.findByRole("progressbar", {
      name: /progreso de lanzamiento/i,
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    await user.click(screen.getByRole("button", { name: /abrir among us/i }));
    act(() => {
      vi.advanceTimersByTime(PROTOCOL_TIMEOUT_MS + 100);
    });

    await user.click(screen.getByRole("button", { name: /copiar enlace/i }));
    expect(
      await screen.findByText(/enlace copiado al portapapeles/i),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText(/enlace copiado al portapapeles/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /copiar enlace/i }),
    ).toBeInTheDocument();
  });

  it("does not show the fallback notice when the handoff hides the page", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TestRouter initialPath="/app/among-us/launch" />);

    await screen.findByRole("progressbar", {
      name: /progreso de lanzamiento/i,
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await user.click(screen.getByRole("button", { name: /abrir among us/i }));

    // The native app took over: the page lost visibility before the timeout.
    act(() => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        value: "hidden",
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    act(() => {
      vi.advanceTimersByTime(PROTOCOL_TIMEOUT_MS + 100);
    });

    expect(
      screen.queryByTestId("launch.protocol_notice"),
    ).not.toBeInTheDocument();
  });

  it("dismisses the fallback notice when the user returns from the native app", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TestRouter initialPath="/app/among-us/launch" />);

    await screen.findByRole("progressbar", {
      name: /progreso de lanzamiento/i,
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await user.click(screen.getByRole("button", { name: /abrir among us/i }));
    act(() => {
      vi.advanceTimersByTime(PROTOCOL_TIMEOUT_MS + 100);
    });
    expect(screen.getByTestId("launch.protocol_notice")).toBeInTheDocument();

    // The user comes back to the launcher tab: the notice is cleared.
    act(() => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        value: "visible",
      });
      window.dispatchEvent(new Event("focus"));
    });

    expect(
      screen.queryByTestId("launch.protocol_notice"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /abrir among us/i }),
    ).toBeInTheDocument();
  });

  it("reports an error when the link cannot be copied", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn().mockReturnValue(false),
    });

    render(<TestRouter initialPath="/app/among-us/launch" />);

    await screen.findByRole("progressbar", {
      name: /progreso de lanzamiento/i,
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    await user.click(screen.getByRole("button", { name: /abrir among us/i }));
    act(() => {
      vi.advanceTimersByTime(PROTOCOL_TIMEOUT_MS + 100);
    });

    await user.click(screen.getByRole("button", { name: /copiar enlace/i }));

    expect(
      await screen.findByText(/no se pudo copiar el enlace/i),
    ).toBeInTheDocument();
  });
});
