import BlogArticleLayout from "@/components/blog/BlogArticleLayout";

const PodcastMasLargo = () => (
  <BlogArticleLayout
    slug="podcast-mas-largo-historia"
    canonicalPath="/blog/podcast-mas-largo-historia"
    title="¿Cuál es el Podcast más Largo de la Historia? El Récord Mundial Explicado"
    h1="El podcast más largo de la historia: récords, datos y el intento venezolano"
    description="Cuántas horas dura el podcast más largo grabado, quién tiene el récord Guinness y cómo Vacílate Esto se prepara para romperlo desde Venezuela."
    keywords="podcast más largo del mundo, récord guinness podcast, podcast eterno venezuela, cuántas horas dura un podcast récord, podcast 24 horas, vacílate esto récord"
    datePublished="2026-04-26"
    readingMinutes={6}
    category="Récord"
    tags={["récord", "guinness", "podcast", "podcast eterno", "venezuela"]}
    toc={[
      { id: "record", label: "El récord actual" },
      { id: "intentos", label: "Otros intentos famosos" },
      { id: "como-funciona", label: "Cómo funciona el récord" },
      { id: "venezuela", label: "El intento de Vacílate Esto" },
    ]}
    faq={[
      {
        question: "¿Cuál es el podcast más largo grabado en una sola sesión?",
        answer:
          "El récord Guinness reconocido ronda las 100+ horas de transmisión continua, aunque varía según las normas de validación oficial (descansos, cantidad de hosts, etc.).",
      },
      {
        question: "¿Qué reglas pide Guinness para el récord?",
        answer:
          "Transmisión en vivo verificable, conteo de tiempo certificado por jueces independientes, descansos máximos de 5 minutos cada hora, dos testigos presenciales en todo momento y grabación íntegra en video.",
      },
    ]}
  >
    <p className="text-xl leading-relaxed">
      Hacer un podcast es fácil. Hacer <strong>el podcast más largo del mundo</strong> es otra cosa: requiere meses de planificación, validación oficial, equipo médico y locura suficiente para no dormir varios días. Esto es lo que sabemos del récord — y de lo que estamos preparando desde Venezuela.
    </p>

    <h2 id="record">El récord actual</h2>
    <p>
      El récord Guinness oficial de podcast más largo grabado en una sola sesión ronda las <strong>100+ horas continuas</strong>. Ha sido superado varias veces en los últimos años por equipos en India, Estados Unidos y Europa.
    </p>

    <h2 id="intentos">Otros intentos famosos</h2>
    <ul>
      <li>Equipos de podcasters indios han sostenido transmisiones de más de 5 días consecutivos.</li>
      <li>Streamers de Twitch han llegado a más de 200 horas, pero esos no clasifican como "podcast" para Guinness.</li>
      <li>Varios podcasts europeos lo han intentado en formato de relevos, lo que tampoco cuenta para el récord oficial.</li>
    </ul>

    <h2 id="como-funciona">Cómo funciona el récord</h2>
    <p>
      Guinness exige reglas estrictas: transmisión continua verificable, máximo 5 minutos de descanso por hora (acumulables), cobertura por jueces independientes, dos testigos presenciales 24/7 y grabación íntegra. Si parás más de lo permitido, el cronómetro vuelve a cero.
    </p>

    <h2 id="venezuela">El intento de Vacílate Esto: Podcast Eterno</h2>
    <p>
      <a href="/podcast-eterno">Podcast Eterno</a> es el formato con el que Vacílate Esto se prepara para intentar el récord <strong>desde Venezuela</strong>. La idea: convertirlo en el primer Récord Guinness de podcast hecho en Latinoamérica. Si querés ser parte (audiencia, patrocinador, testigo oficial), seguinos en redes — falta poco.
    </p>
  </BlogArticleLayout>
);

export default PodcastMasLargo;