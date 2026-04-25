import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'wd0reprb',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: 'skzVy2N5ZG4pEfO4BQehbty0CXxz4wqAuDGWINj0resBQUlSgdH7obkCRi5wFLGYXCuXcqrDDM6kOHojOZ3KB1lMLsFOqhZ4jCfNaKvuPMRNlTScW1eySEVGC4oxH5jCLWzaw0kul0n0avq1JmCaMJl8LgC0oBAzjjp28yqwkDH4g9vqWvfi',
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

export const queries = {
  allProducts: `*[_type == "product"]{_id, name, nameFr, slug, description, price, originalPrice, discount, "images": images[].asset->url, "category": category->{name, slug}, isNew, colors, stock}`,
  
  newProducts: `*[_type == "product" && isNew == true]{_id, name, nameFr, slug, description, price, originalPrice, discount, "images": images[].asset->url, "category": category->{name, slug}, isNew, colors, stock}`,
  
  discountedProducts: `*[_type == "product" && discount > 0]{_id, name, nameFr, slug, description, price, originalPrice, discount, "images": images[].asset->url, "category": category->{name, slug}, isNew, colors, stock}`,
  
  productsByCategory: `*[_type == "product" && category->slug.current == $slug]{_id, name, nameFr, slug, description, price, originalPrice, discount, "images": images[].asset->url, "category": category->{name, slug}, isNew, colors, stock}`,
  
  searchProducts: `*[_type == "product" && [name, nameFr] match $query]{_id, name, nameFr, slug, description, price, originalPrice, discount, "images": images[].asset->url, "category": category->{name, slug}, isNew, colors, stock}`,
  
  productBySlug: `*[_type == "product" && slug.current == $slug][0]{_id, name, nameFr, slug, description, price, originalPrice, discount, "images": images[].asset->url, "category": category->{name, slug}, isNew, colors, stock}`,
  
  allCategories: `*[_type == "category"]{_id, name, nameFr, slug, icon}`,
};
