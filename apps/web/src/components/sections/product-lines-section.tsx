type ProductLineCard = {
  category: string;
  image: string;
  name: string;
  price: number;
};

type ProductLinesSectionProps = {
  formatPrice: (value: number) => string;
  onProductDetail: (productName: string) => void;
  products: ProductLineCard[];
};

export function ProductLinesSection({
  formatPrice,
  onProductDetail,
  products,
}: ProductLinesSectionProps) {
  return (
    <section id="catalogo" className="border-b border-gray-200 bg-[#FAFAFA]">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="flex flex-col gap-4 text-left lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#E63946]">
              Te puede interesar
            </p>
            <h2 className="font-display mt-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">
              Productos predisenados con vibes de showroom.
            </h2>
          </div>
          <a href="#configurador" className="text-sm font-bold uppercase tracking-[0.2em] text-[#111827]">
            Ir al configurador
          </a>
        </div>

        <p className="mt-4 text-sm text-gray-500 sm:hidden">Desliza para ver mas productos.</p>

        <div
          className="no-scrollbar -mx-4 mt-8 flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory sm:mx-0 sm:mt-10 sm:gap-5 sm:px-0"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {products.map((product) => (
            <article
              key={product.name}
              className="w-[84vw] max-w-[320px] shrink-0 snap-start overflow-hidden border border-gray-200 bg-white shadow-sm"
            >
              <div
                className="h-[280px] bg-cover bg-center sm:h-[360px]"
                style={{ backgroundImage: `url('${product.image}')` }}
              />
              <div className="px-5 py-5 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                  {product.category}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#111827]">
                  {product.name}
                </h3>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <span className="text-lg font-bold text-[#111827]">{formatPrice(product.price)}</span>
                  <button
                    type="button"
                    onClick={() => onProductDetail(product.name)}
                    className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition-colors hover:bg-black"
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
