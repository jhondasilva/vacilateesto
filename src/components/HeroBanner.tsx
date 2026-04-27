import headerBanner from "@/assets/header-banner.png";

const HeroBanner = () => {
  return (
    <section className="w-full pt-20" aria-label="Banner principal de Vacílate Esto">
      <div className="w-full">
        <img
          src={headerBanner}
          alt="Vacílate Esto Podcast - JuanSofa y JhonSnacks, los hosts del mejor podcast de Venezuela"
          className="w-full h-auto object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>
    </section>
  );
};

export default HeroBanner;
