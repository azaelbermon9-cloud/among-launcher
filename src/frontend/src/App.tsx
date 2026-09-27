import { Toaster } from "@/components/ui/sonner";
import { AppDetailPage } from "@/pages/AppDetailPage";
import { LaunchPage } from "@/pages/LaunchPage";
import { LauncherPage, parseSearch } from "@/pages/LauncherPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

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

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
