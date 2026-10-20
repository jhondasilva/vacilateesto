import { describe, expect, test } from "bun:test";
import { CIMA_2026 } from "../src/data/cima2026";

describe("Resultados oficiales CIMA 2026", () => {
  test("solo los cuatro ganadores autorizados, sin Ecosistema B2B", () => {
    expect(CIMA_2026.winners.map(({ category, project }) => [category, project])).toEqual([
      ["Plataforma de Streaming de Medios", "Streaming From the Lost World"],
      ["Podcast", "Podcast en la Cumbre"],
      ["Experiencia Figital", "Movilnet E en Pelotica de Goma: cuando el asfalto y los e-sports juegan en el mismo equipo"],
      ["Talento de la Industria · Creativo", "Jhon Da Silva"],
    ]);
  });

  test("Movilnet conserva su atribución y el vínculo con el torneo de Vacílate Esto", () => {
    expect(CIMA_2026.winners.find(({ category }) => category === "Experiencia Figital")?.attribution)
      .toBe("Movilnet, en el Torneo de Pelotica de Goma de Vacílate Esto");
  });

  test("cuarta edición, aval y ceremonia oficiales", () => {
    expect(CIMA_2026.edition).toBe(4);
    expect(CIMA_2026.endorsedBy).toBe("FEVAP");
    expect(CIMA_2026.ceremonyDate).toBe("2026-10-19");
    expect(CIMA_2026.venue).toBe("Hotel Eurobuilding, Caracas");
    expect(CIMA_2026.agency).toBe("La Web Figital Agency");
  });
});