"use client";
import Hero from "./components/pages/Home/Home-Hero";
import dynamic from "next/dynamic";
import LightRays from "./components/ui/LightRays";
const LandingPage = dynamic(
  () =>
    import("./components/pages/Home/Home-Landing").then((mod) => mod.default),
  { ssr: false },
);
export default function Home() {
  return (
    <>
      <div className="overflow-hidden">
        <div style={{ width: "100%", height: "800px", position: "absolute" }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays z-[-1]"
          />
        </div>
        <Hero />
        <LandingPage />
      </div>
    </>
  );
}
