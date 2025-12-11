import headerBanner from "@/assets/header-banner.png";

const HeroBanner = () => {
  return (
    <section className="w-full">
      <div className="w-full">
        <img
          src={headerBanner}
          alt="Vacílate Esto - JuanSofa y JhonSnacks"
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  );
};

export default HeroBanner;
