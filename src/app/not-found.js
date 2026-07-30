import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mt-navbar flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-h2 font-bold">404</h1>
      <p className="text-p text-auxwhite">No hemos encontrado esta página.</p>
      <Link
        href="/"
        className="rounded-full bg-secnd px-8 py-3 font-medium text-main transition-colors hover:bg-boldhover hover:text-secnd"
      >
        VOLVER AL INICIO
      </Link>
    </main>
  );
}
