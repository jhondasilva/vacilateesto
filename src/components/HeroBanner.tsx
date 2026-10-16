import headerBanner from "@/assets/header-banner.png";

const HeroBanner = () => {
  return (
    <section className="w-full pt-20" aria-label="Banner principal de Vacílate Esto">
      <div className="w-full">
        <img
          src={headerBanner}
          alt="Vacílate Esto - JuanSofa y JhonSnacks, los hosts del sistema de contenidos venezolano de Fun Educaitment"
          width={1584}
          height={396}
          className="w-full h-auto aspect-[4/1] object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>
    </section>
  );
};

export default HeroBanner;
