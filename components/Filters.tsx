"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import { formatPriceMRU } from "@/lib/formatPrice";

interface InputCategory {
  inStock: { text: string, isChecked: boolean },
  outOfStock: { text: string, isChecked: boolean },
  priceFilter: { text: string, value: number },
  ratingFilter: { text: string, value: number },
}

interface Category {
  id: string;
  title: string;
  href: string; // e.g., /shop/category-slug
  bgImage: string;
}

interface ApiCategory {
  id: string;
  name: string;
  image: string | null;
}

const Filters = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { push } = useRouter(); // Use push for navigation to update path
  const { replace } = useRouter();

  // getting current page number from Zustand store
  const { page } = usePaginationStore();

  const [inputCategory, setInputCategory] = useState<InputCategory>({
    inStock: { text: "instock", isChecked: true },
    outOfStock: { text: "outofstock", isChecked: true },
    priceFilter: { text: "price", value: 3000 },
    ratingFilter: { text: "rating", value: 0 },
  });
  const { sortBy } = useSortStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Extract current category from pathname, e.g., /shop/some-category -> some-category
  const currentPathSegments = pathname.split('/').filter(Boolean);
  const currentCategorySlug = currentPathSegments.length > 1 && currentPathSegments[0] === 'shop'
    ? currentPathSegments[1]
    : null;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Utiliser apiClient pour utiliser la bonne URL de base (backend)
        const apiClient = (await import('@/lib/api')).default;
        
        // Ajouter un timeout pour éviter les blocages
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes timeout
        
        const response = await apiClient.get("/api/categories", {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          if (response.status === 404) {
            console.warn('⚠️ API endpoint not found. Is the backend server running?');
            setCategories([]);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawData = await apiClient.safeJsonParse(response);
        
        // Handle both array format and object format (for backward compatibility)
        let categoriesArray: ApiCategory[] = rawData;
        if (!Array.isArray(rawData)) {
          if (rawData.categories && Array.isArray(rawData.categories)) {
            categoriesArray = rawData.categories;
          } else {
            console.error("Invalid categories data format:", rawData);
            setCategories([]);
            return;
          }
        }
        
        // Transform API categories to component format
        const transformedCategories: Category[] = categoriesArray
          .filter((cat: ApiCategory) => cat.id && cat.name) // Filter out invalid categories
          .map((cat: ApiCategory) => ({
            id: cat.id,
            title: cat.name,
            href: `/shop/category/${cat.id}`, // Generate href from category ID
            bgImage: cat.image || "/product_placeholder.jpg",
          }));
        
        setCategories(transformedCategories);
      } catch (e: any) {
        if (e.name === 'AbortError') {
          setCategoriesError("Timeout: Le serveur met trop de temps à répondre");
        } else {
          setCategoriesError(e.message);
        }
        console.error("Failed to fetch categories:", e);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    // Skip updating URL if categories are still loading or there's an error
    if (loadingCategories || categoriesError) return;

    const params = new URLSearchParams(searchParams.toString()); // Preserve existing search params
    
    // Update availability, price, rating, sort, and page
    params.set("outOfStock", inputCategory.outOfStock.isChecked.toString());
    params.set("inStock", inputCategory.inStock.isChecked.toString());
    params.set("rating", inputCategory.ratingFilter.value.toString());
    params.set("price", inputCategory.priceFilter.value.toString());
    params.set("sort", sortBy);
    params.set("page", page.toString());

    // Construct new path based on selected category
    let newPath = "/shop";
    if (currentCategorySlug) {
      newPath = `/shop/${currentCategorySlug}`;
    }
    
    replace(`${newPath}?${params.toString()}`);
  }, [inputCategory, sortBy, page, currentCategorySlug, searchParams, replace, loadingCategories, categoriesError]);

  const handleCategoryClick = (categorySlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    let newPath = "/shop";

    if (categorySlug) {
      newPath = `/shop/${categorySlug}`;
    } else {
      // If "All Categories" is clicked, clear category from path
      // Also clear any category-specific search params if they exist, though not currently implemented.
    }
    // Reset page to 1 when changing category
    params.set("page", "1");
    push(`${newPath}?${params.toString()}`);
  };

  return (
    <div>
      <h3 className="text-2xl mb-2">Filters</h3>
      <div className="divider"></div>

      <div className="flex flex-col gap-y-1 mb-4">
        <h3 className="text-xl mb-2">Categories</h3>
        {loadingCategories && <p>Loading categories...</p>}
        {categoriesError && <p className="text-red-500">Error: {categoriesError}</p>}
        {!loadingCategories && !categoriesError && (
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => handleCategoryClick(null)}
                className={`w-full text-left py-1 px-2 rounded-md ${
                  !currentCategorySlug ? 'bg-blue-100 text-blue-800 font-semibold' : 'hover:bg-gray-100'
                }`}
              >
                All Products
              </button>
            </li>
            {categories.map((cat) => {
              // Safely generate slug from title
              const categorySlug = cat.title ? cat.title.toLowerCase().replace(/\s+/g, '-') : '';
              
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(categorySlug)}
                    className={`w-full text-left py-1 px-2 rounded-md ${
                      currentCategorySlug === categorySlug
                        ? 'bg-blue-100 text-blue-800 font-semibold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {cat.title || 'Catégorie sans nom'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="divider"></div>
      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Availability</h3>
        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.inStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  inStock: {
                    text: "instock",
                    isChecked: !inputCategory.inStock.isChecked,
                  },
                })
              }
              className="checkbox"
            />
            <span className="label-text text-lg ml-2 text-black">In stock</span>
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={inputCategory.outOfStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  outOfStock: {
                    text: "outofstock",
                    isChecked: !inputCategory.outOfStock.isChecked,
                  },
                })
              }
              className="checkbox"
            />
            <span className="label-text text-lg ml-2 text-black">
              Out of stock
            </span>
          </label>
        </div>
      </div>

      <div className="divider"></div>
      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl mb-2">Price</h3>
        <div>
          <input
            type="range"
            min={0}
            max={3000}
            step={10}
            value={inputCategory.priceFilter.value}
            className="range"
            onChange={(e) =>
              setInputCategory({
                ...inputCategory,
                priceFilter: {
                  text: "price",
                  value: Number(e.target.value),
                },
              })
            }
          />
          <span>{`Prix max: ${formatPriceMRU(inputCategory.priceFilter.value)}`}</span>
        </div>
      </div>

      <div className="divider"></div>

      <div>
        <h3 className="text-xl mb-2">Minimum Rating:</h3>
        <input
          type="range"
          min={0}
          max="5"
          value={inputCategory.ratingFilter.value}
          onChange={(e) =>
            setInputCategory({
              ...inputCategory,
              ratingFilter: { text: "rating", value: Number(e.target.value) },
            })
          }
          className="range range-info"
          step="1"
        />
        <div className="w-full flex justify-between text-xs px-2">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
