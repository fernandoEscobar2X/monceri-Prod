import { Check, Star } from "lucide-react";

type TestimonialCard = {
  city: string;
  heightClassName: string;
  image: string;
  name: string;
  quote: string;
};

type TestimonialsSectionProps = {
  reviews: TestimonialCard[];
};

export function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  return (
    <section className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="max-w-2xl text-left">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#E63946]">
            Clientes felices
          </p>
          <h2 className="font-display mt-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">
            Fotos reales, espacios reales, resultados que si venden.
          </h2>
        </div>

        <div className="mt-10 columns-1 gap-6 md:columns-2 xl:columns-3">
          {reviews.map((review) => (
            <article key={`${review.name}-${review.city}`} className="mb-6 break-inside-avoid">
              <div
                className={`${review.heightClassName} bg-cover bg-center`}
                style={{ backgroundImage: `url('${review.image}')` }}
              />
              <div className="relative -mt-10 mx-5 border border-gray-200 bg-white px-5 py-5 shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 text-[#FF8FA3]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={`${review.name}-${index}`} className="size-4 fill-current" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF1F3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#E63946]">
                    <Check className="size-3.5" />
                    Verified
                  </span>
                </div>
                <p className="mt-4 text-base leading-7 text-gray-600">&ldquo;{review.quote}&rdquo;</p>
                <div className="mt-5">
                  <p className="font-semibold text-[#111827]">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.city}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
