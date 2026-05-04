import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#FAFAFA] px-4 text-center text-[#111827]">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#E63946]">Monceri</p>
        <h1 className="font-display mt-4 text-4xl font-black tracking-tight">Producto no encontrado</h1>
        <Link
          href="/catalogo"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-[#111827] px-5 text-sm font-semibold text-white hover:bg-black"
        >
          Ver catalogo completo
        </Link>
      </div>
    </main>
  );
}
