/** Collapse duplicate brand cards only within the user's already authorized list. */
export function distinctDashboardBrands<T extends { brand: { slug: string } }>(brands: T[]): T[] {
  const hasHarinaPan = brands.some(({ brand }) => brand.slug === "harina-pan");
  return brands.filter(({ brand }) => !(hasHarinaPan && brand.slug === "pan-pdg"));
}