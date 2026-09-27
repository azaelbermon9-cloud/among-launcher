import { Toaster } from "@/components/ui/sonner";
import { AppDetailPage } from "@/pages/AppDetailPage";
import { LaunchPage } from "@/pages/LaunchPage";
import { LauncherPage, parseSearch } from "@/pages/LauncherPage";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

/**
 * Builds the same route tree as the production App, but backed by an in-memory
 * history so tests can seed a URL and assert navigation without a browser.
 */
export function buildRouter(initialPath: string) {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <Outlet />
        <Toaster position="top-center" />
      </>
    ),
  });

  const launcherRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    validateSearch: parseSearch,
    component: LauncherPage,
  });

  const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/app/$appId",
    component: () => {
      const { appId } = detailRoute.useParams();
      return <AppDetailPage appId={appId} />;
    },
  });

  const launchRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/app/$appId/launch",
    component: () => {
      const { appId } = launchRoute.useParams();
      return <LaunchPage appId={appId} />;
    },
  });

  const routeTree = rootRoute.addChildren([
    launcherRoute,
    detailRoute,
    launchRoute,
  ]);

  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });
}

export function TestRouter({
  initialPath = "/",
  onRouter,
}: {
  initialPath?: string;
  onRouter?: (router: ReturnType<typeof buildRouter>) => void;
}) {
  const router = buildRouter(initialPath);
  onRouter?.(router);
  return <RouterProvider router={router} />;
}
