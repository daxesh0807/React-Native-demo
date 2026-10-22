import { Category, Product, ProductsResponse } from '@/types';

const BASE_URL = 'https://dummyjson.com';

export interface FetchProductsParams {
  skip?: number;
  limit?: number;
  q?: string;
  category?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export async function fetchProducts(params: FetchProductsParams = {}): Promise<ProductsResponse> {
  const { skip = 0, limit = 20, q, category, sortBy, order } = params;

  let url = `${BASE_URL}/products`;

  if (q && q.trim().length > 0) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(q.trim())}&limit=${limit}&skip=${skip}`;
  } else if (category && category !== 'all') {
    url = `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
  } else {
    url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
  }

  if (sortBy) {
    url += `&sortBy=${sortBy}&order=${order ?? 'asc'}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/products/categories`);
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  return res.json();
}

export async function fetchProductById(id: string | number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch product with id: ${id}`);
  }
  return res.json();
}

