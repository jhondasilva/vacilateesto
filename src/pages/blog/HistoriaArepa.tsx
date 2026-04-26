import BlogArticleLayout from "@/components/blog/BlogArticleLayout";

const HistoriaArepa = () => (
  <BlogArticleLayout
    slug="historia-de-la-arepa"
    canonicalPath="/blog/historia-de-la-arepa"
    title="Historia de la Arepa: Origen, Evolución y Por Qué es Patrimonio Venezolano"
    h1="La historia de la arepa: del budare indígena al desayuno nacional"
    description="De dónde viene la arepa, cuántos años tiene, cómo se hacía antes de la harina precocida y por qué es uno de los símbolos culturales más fuertes de Venezuela."
    keywords="historia de la arepa, origen de la arepa, arepa venezolana, arepa indígena, harina pan historia, arepas más famosas venezuela, cultura venezolana arepa"
    datePublished="2026-04-26"
    readingMinutes={8}
    category="Cultura"
    tags={["arepa", "gastronomía", "venezuela", "cultura", "historia"]}
    toc={[
      { id: "origen", label: "Origen prehispánico" },
      { id: "nombre", label: "El nombre 'arepa'" },
      { id: "harina-pan", label: "La revolución de la harina precocida" },
      { id: "rellenos", label: "Los rellenos clásicos" },
      { id: "patrimonio", label: "Patrimonio cultural" },
    ]}
    faq={[
      {
        question: "¿Cuántos años tiene la arepa?",
        answer:
          "Más de 2.800 años. Se han encontrado budares (planchas de arcilla para cocinar arepas) en yacimientos arqueológicos venezolanos que datan del siglo VIII a.C.",
      },
      {
        question: "¿La arepa es venezolana o colombiana?",
        answer:
          "Las dos. La arepa es un alimento ancestral de los pueblos indígenas que habitaban lo que hoy es Venezuela y Colombia, mucho antes de la división política actual. Cada país desarrolló sus propias variantes.",
      },
    ]}
  >
    <p className="text-xl leading-relaxed">
      La <strong>arepa</strong> no es un platillo: es una identidad. Tiene <strong>más de 2.800 años</strong> de historia y sigue siendo lo primero que extraña un venezolano cuando emigra. Esta es su historia, contada como nos gusta a nosotros.
    </p>

    <h2 id="origen">Origen prehispánico</h2>
    <p>
      La arepa nació mucho antes que Venezuela como país. Los <strong>cumanagotos, caribes y timoto-cuicas</strong> ya cocinaban discos de masa de maíz sobre <strong>budares</strong> (planchas circulares de arcilla). Arqueólogos han encontrado budares en el oriente de Venezuela que datan del <strong>siglo VIII a.C.</strong>
    </p>

    <h2 id="nombre">El nombre "arepa"</h2>
    <p>
      Se cree que viene de la voz cumanagota <em>erepa</em>, que significaba "maíz". Otros lingüistas la asocian al término <em>aripo</em>, el budare donde se cocinaba.
    </p>

    <h2 id="harina-pan">La revolución de la harina precocida</h2>
    <p>
      Hasta los años 50, hacer arepas era trabajo duro: pilar el maíz, cocinarlo, molerlo, amasarlo. Eso cambió en <strong>1960</strong> cuando Empresas Polar lanzó la <strong>Harina P.A.N.</strong> (precocida y agrobiental nacional). Lo que tomaba horas se convirtió en 5 minutos. La arepa pasó de ser comida de fin de semana a desayuno diario nacional.
    </p>

    <h2 id="rellenos">Los rellenos clásicos</h2>
    <ul>
      <li><strong>Reina Pepiada:</strong> pollo, aguacate y mayonesa. Creada en honor a Susana Duijm en 1955.</li>
      <li><strong>Pelúa:</strong> carne mechada con queso amarillo rallado.</li>
      <li><strong>Dominó:</strong> caraotas negras con queso blanco.</li>
      <li><strong>Catira:</strong> pollo guisado con queso amarillo.</li>
      <li><strong>Sifrina:</strong> reina pepiada con queso amarillo encima.</li>
      <li><strong>Llanera:</strong> carne asada, tomate, aguacate y queso de mano.</li>
      <li><strong>Rumbera:</strong> pernil con queso amarillo.</li>
    </ul>

    <h2 id="patrimonio">Patrimonio cultural</h2>
    <p>
      En 2014, la <strong>arepa fue declarada Patrimonio Cultural</strong> de Venezuela. Y aunque no tiene aún reconocimiento UNESCO, es probablemente el alimento que más une a venezolanos dentro y fuera del país. La diáspora montó arepera en cada ciudad del mundo: Madrid, Buenos Aires, Miami, Sídney.
    </p>

    <p>
      Si querés escuchar conversaciones venezolanísimas sobre comida, identidad y nostalgia, suscribite a <a href="/podcast-eterno">Podcast Eterno</a>.
    </p>
  </BlogArticleLayout>
);

export default HistoriaArepa;