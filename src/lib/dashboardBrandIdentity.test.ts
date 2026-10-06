import { test, expect } from "bun:test";
import { distinctDashboardBrands } from "./dashboardBrandIdentity";

test("PAN and Harina P.A.N. appear as one brand when both are authorized", () => {
  const brands = [{ brand: { slug: "pan-pdg" } }, { brand: { slug: "harina-pan" } }, { brand: { slug: "doritos-pdg" } }];
  expect(distinctDashboardBrands(brands).map(({ brand }) => brand.slug)).toEqual(["harina-pan", "doritos-pdg"]);
});

test("a user with only PAN keeps their existing authorized dashboard", () => {
  const brands = [{ brand: { slug: "pan-pdg" } }];
  expect(distinctDashboardBrands(brands)).toEqual(brands);
});