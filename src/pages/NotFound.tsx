import { Helmet } from "react-helmet-async";

const NotFound = () => (
  <>
    <Helmet>
      <title>Página no encontrada | Vacílate Esto</title>
      <meta name="description" content="La página que buscas no existe o cambió de dirección." />
      <meta name="robots" content="noindex, nofollow" />
      <meta property="og:title" content="Página no encontrada | Vacílate Esto" />
      <meta property="og:description" content="La página que buscas no existe o cambió de dirección." />
    </Helmet>
    <main className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Esta página no existe o cambió de dirección.</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Volver al inicio
        </a>
      </div>
    </main>
  </>
);

export default NotFound;
