import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../site/Breadcrumbs";
import LearnSidebar, { isLearnAreaPath } from "../site/LearnSidebar";

/** Wraps page content with breadcrumbs and optional learn sidebar. */
export default function PageFrame({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const learnLayout = isLearnAreaPath(pathname);
  const isCheckout = pathname.startsWith("/checkout");
  const isHome = pathname === "/";

  if (isHome) {
    return <>{children}</>;
  }

  if (isCheckout) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6 md:py-8">
        <Breadcrumbs />
        {children}
      </div>
    );
  }

  if (learnLayout) {
    return (
      <div className="mx-auto max-w-site px-4 py-8 md:px-6 md:py-10">
        <Breadcrumbs />
        <div className="flex gap-10">
          <LearnSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-site px-4 py-8 md:px-6 md:py-10">
      <Breadcrumbs />
      {children}
    </div>
  );
}
