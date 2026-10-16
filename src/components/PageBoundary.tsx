import { Component, lazy, Suspense, type ComponentType, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

/** lazy() con un reintento: tras una publicación nueva, un chunk viejo puede fallar una vez. */
// eslint-disable-next-line react-refresh/only-export-components
export const lazyPage = <T extends ComponentType<object>>(load: () => Promise<{ default: T }>) =>
  lazy(() => load().catch(() => new Promise<{ default: T }>((r) => setTimeout(() => r(load()), 400))));

class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: unknown) { console.error("Error al cargar la página:", error); }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
        <div>
          <h1 className="mb-3 text-2xl font-bold text-foreground">No pudimos cargar esta página</h1>
          <p className="mb-6 text-muted-foreground">Revisa tu conexión e inténtalo de nuevo.</p>
          <button type="button" onClick={() => window.location.reload()} className="rounded-full bg-primary px-6 py-2 font-semibold text-primary-foreground">
            Recargar
          </button>
        </div>
      </main>
    );
  }
}

const Fallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background" role="status" aria-live="polite">
    <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" aria-hidden="true" />
    <span className="sr-only">Cargando…</span>
  </div>
);

/** Suspense + error boundary; se reinicia al cambiar de ruta. */
export const PageBoundary = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary key={pathname}>
      <Suspense fallback={<Fallback />}>{children}</Suspense>
    </ErrorBoundary>
  );
};
