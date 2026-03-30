import React from "react";
import CategoryItemCompact from "./CategoryItemCompact";

interface Category {
  id: string;
  title: string;
  href: string;
  bgImage: string;
}

interface ApiCategory {
  id: string;
  name: string;
  image: string | null;
}

const toImagePath = (image: string | null | undefined) => {
  if (!image) return "/product_placeholder.jpg";
  const trimmed = String(image).trim();
  if (!trimmed) return "/product_placeholder.jpg";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

async function getCategories(): Promise<Category[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "").replace(/\/api$/, "") ||
    (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "");

  if (!baseUrl) return [];

  const url = `${baseUrl}/api/categories`;
  const res = await fetch(url, {
    next: { revalidate: 300 },
  } as any);

  if (!res.ok) return [];

  const data = await res.json();
  const categoriesArray: ApiCategory[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.categories)
      ? data.categories
      : [];

  return categoriesArray
    .filter((cat) => cat?.id && cat?.name)
    .map((cat) => ({
      id: cat.id,
      title: cat.name,
      href: `/shop/category/${cat.id}`,
      bgImage: toImagePath(cat.image),
    }));
}

const CategoryMenu = async () => {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-brand-text-primary tracking-tight mb-4">
            Nos Univers
          </h2>
          <div className="w-24 h-px bg-brand-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {categories.length > 0 ? (
            categories.map((item, index) => (
              <div
                key={item.id}
                className="opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "forwards" }}
              >
                <CategoryItemCompact title={item.title} href={item.href} bgImage={item.bgImage} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-brand-text-secondary py-20">
              <p className="font-serif text-lg">Aucune catégorie disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryMenu;
