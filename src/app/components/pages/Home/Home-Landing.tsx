"use client";
import { Card, CardBody, Image } from "@nextui-org/react";
import content from "@/locales/en/home.json";

const data = {
  landing: {
    cards: [
      { alt: "money",   defaultSrc: "/images/computer-iso-gradient.png" },
      { alt: "computer",defaultSrc: "/images/mobile-iso-gradient.png" },
      { alt: "mobile",  defaultSrc: "/images/money-iso-gradient.png" },
    ],
  },
};

// ✅ เวอร์ชันตัด hover และตัดสลับรูป
const CardComponent = ({ title, description, image }) => {
  return (
    <div className="card-outer-bg card-outer-shadow relative overflow-hidden rounded-[25px] p-[1px]">
      <Card className="card-inner-bg card-inner-blur relative z-10 h-full rounded-[24px] border-0">
        <CardBody className="flex h-full flex-col justify-between p-6 text-center lg:p-8 lg:text-left">
          <div>
            <div className="mb-3 flex justify-center lg:mb-6">
              <Image
                src={image.defaultSrc}
                alt={image.alt}
                className="h-[160px] w-[160px] lg:h-[170px] lg:w-[170px]"
                radius="none"
                loading="lazy"
              />
            </div>
            <h3 className="mb-3 text-xl text-white">{title}</h3>
          </div>
          {description ? (
            <p className="text-sm leading-relaxed text-[#B3B3B3]">
              {description}
            </p>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
};

export default function LandingPage() {
  const landingContent = content.landing;
  const imageData = data.landing.cards;

  return (
    <section className="mx-auto max-w-[1270px] bg-black px-8 text-white lg:px-4 ">
      {/* Heading */}
      <div className="mb-12 text-center">
        <p className="mb-3 text-lg text-[#7E7E7E] lg:text-xl">
          {landingContent.heading.smallTitle}
        </p>
        <h2 className="text-xl lg:text-[40px]">{landingContent.heading.mainTitle}</h2>
        <div className="mx-auto mt-4 max-w-4xl text-xs text-[#7E7E7E] lg:px-2 lg:text-xl">
          <p>{landingContent.heading.description1}</p>
          <p>{landingContent.heading.description2}</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-8 pt-8 mb-20 lg:grid-cols-3 lg:px-6 lg:pt-12">
        {landingContent.cards.map(({ title, description }, i) => (
          <CardComponent
            key={i}
            title={title}
            description={description}
            image={imageData[i]}
          />
        ))}
      </div>
    </section>
  );
}
