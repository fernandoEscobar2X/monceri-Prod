import Link from "next/link";

export default function SeasonNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4 text-center text-[#111827]">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.28em] text-[#E63946]">
          Temporada no encontrada
        </p>
        <h1 className="font-display mt-4 text-4xl font-black tracking-tight">
          Esta coleccion ya no esta disponible.
        </h1>
        <Link
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#111827] px-5 text-sm font-semibold text-white hover:bg-black"
          href="/catalogo"
        >
          Ir al catalogo
        </Link>
      </div>
    </main>
  );
}
