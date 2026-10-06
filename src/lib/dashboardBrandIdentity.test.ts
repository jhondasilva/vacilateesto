import { test } from "node:test";
import { deepStrictEqual } from "node:assert";
import { distinctDashboardBrands } from "./dashboardBrandIdentity";

test("PAN and Harina P.A.N. appear as one brand when both are authorized", () => {
  const brands = [{ brand: { slug: "pan-pdg" } }, { brand: { slug: "harina-pan" } }, { brand: { slug: "doritos-pdg" } }];
  deepStrictEqual(distinctDashboardBrands(brands).map(({ brand }) => brand.slug), ["harina-pan", "doritos-pdg"]);
});

test("a user with only PAN keeps their existing authorized dashboard", () => {
  const brands = [{ brand: { slug: "pan-pdg" } }];
  deepStrictEqual(distinctDashboardBrands(brands), brands);
});