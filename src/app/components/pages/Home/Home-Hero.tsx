"use client";

import React, {
  useState,
  useEffect,
  useRef,
  memo,
  useCallback,
  type ReactElement,
} from "react";
import Link from "next/link";
import {
  Button,
  Input,
  Image as NextUIImage,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { Plus, Send } from "lucide-react";

import ModelCanvas from "../../ModelsObject/ModelStar";
import content from "@/locales/en/home.json";
import Meteors from "../../ui/meteors";
import { SparklesCore } from "../../ui/SparklesCore";
import { Canvas, type ShaderParams } from "../../Canvas/glass";
import { parseLogoImage } from "../../Canvas/parse-logo-image";
import { toast } from "sonner";

/** ================== Types & Data ================== */
interface Logo {
  src: string;
  hoverSrc?: string;
  alt: string;
}
interface InfiniteMarqueeProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

const LOGO_DATA: Logo[] = [
  { src: "/images/kioki (2).png", alt: "ChatGPT" },
  { src: "/images/kioki (2).png", alt: "Google Gemini" },
  { src: "/images/kioki (2).png",  alt: "Poe" },
  { src: "/images/kioki (2).png", alt: "ChatGPT" },
  { src: "/images/kioki (2).png", alt: "Google Gemini" },
  { src: "/images/kioki (2).png",  alt: "Poe" },
  { src: "/images/kioki (2).png", alt: "ChatGPT" },
  { src: "/images/kioki (2).png", alt: "Google Gemini" },
  { src: "/images/kioki (2).png",  alt: "Poe" },
  { src: "/images/kioki (2).png", alt: "ChatGPT" },
  { src: "/images/kioki (2).png", alt: "Google Gemini" },
  { src: "/images/kioki (2).png",  alt: "Poe" },
];

const DUPLICATE_COUNT = 2;
const DEFAULT_SPEED = 0.4;

/** ================== Marquee ================== */
const InfiniteMarquee = memo(function InfiniteMarquee({
  children,
  speed = DEFAULT_SPEED,
  className = "",
}: InfiniteMarqueeProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-visible ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="marquee-track flex"
        style={{
          animationDuration: `${30 / speed}s`,
          animationPlayState: isHovered ? "paused" : "running",
        }}
      >
        {Array.from({ length: DUPLICATE_COUNT }, (_, i) => (
          <React.Fragment key={i}>{children}</React.Fragment>
        ))}
      </div>

      <style jsx global>{`
        @keyframes hero-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          width: max-content;
          will-change: transform;
          animation-name: hero-marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          overflow: visible;
          padding-block: 6px;
          gap: 1rem;
        }
        .logo-item { position: relative; }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
});

/** ================== Logo Item ================== */
const LogoItem: React.FC<Logo> = ({ src, hoverSrc, alt }) => {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hoverSrc) return;
    const img = new globalThis.Image();
    img.src = hoverSrc;
  }, [hoverSrc]);

  const displaySrc = hovered && hoverSrc ? hoverSrc : src;

  return (
    <motion.div
      className="logo-item select-none"
      whileHover={{ scale: 1.25 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      aria-label={alt}
      role="img"
    >
      <NextUIImage
        src={displaySrc}
        alt={alt}
        className="pointer-events-auto h-9 w-9 flex-shrink-0 object-contain transition-transform duration-150 will-change-transform lg:h-[50px] lg:w-[50px]"
        loading="lazy"
        radius="none"
      />
    </motion.div>
  );
};

const LogoGrid = memo(function LogoGrid() {
  return (
    <div className="mt-8 flex items-center justify-center gap-4 pr-4 lg:gap-12 lg:pr-12">
      {LOGO_DATA.map((logo, index) => (
        <LogoItem key={`${logo.alt}-${index}`} {...logo} />
      ))}
    </div>
  );
});

/** ================== Mask ================== */
const GradientMask: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="overflow-visible"
    style={{
      maskImage:
        "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      WebkitMaskImage:
        "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
    }}
  >
    {children}
  </div>
);

/** ================== GlowFrame ================== */
function GlowFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={[
        "group card-outer-bg card-outer-shadow relative overflow-hidden p-[1px] transition-all duration-300",
        "rounded-full",
        className,
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.15), transparent 50%)`,
          mixBlendMode: "screen",
        }}
        aria-hidden
      />
      <div className="card-inner-bg card-inner-blur relative z-10 rounded-full">
        {children}
      </div>
    </div>
  );
}

/** ================== Hero Content ================== */
interface HeroContentProps {
  subtitle: string;
  line1: string;
  line2: string;
}

const HeroContent = memo(function HeroContentBase({
  subtitle,
  line1,
  line2,
}: HeroContentProps) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [imageData, setImageData] = useState<ImageData | null>(null);

  useEffect(() => {
    const imagePath = "/images/kioki.png";
    let cancelled = false;

    const processImage = async () => {
      try {
        setIsProcessing(true);
        const response = await fetch(imagePath);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        const blob = await response.blob();
        const file = new File([blob], "kioki.png", { type: "image/png" });
        const { imageData: processedImageData } = await parseLogoImage(file);
        if (!cancelled) setImageData(processedImageData);
      } catch (err) {
        console.error("Error processing image:", err);
        toast.error("Failed to process logo image for shader.");
      } finally {
        if (!cancelled) setIsProcessing(false);
      }
    };

    processImage();
    return () => { cancelled = true; };
  }, []);

  const params: ShaderParams = {
    patternScale: 4.5,
    refraction: 0.025,
    edge: 0.35,
    patternBlur: 0.003,
    liquid: 0.07,
    speed: 0.25,
  };

  return (
    <div className="relative z-10 mx-auto mt-16 w-full px-4 py-20 sm:px-8 lg:px-28 lg:py-52">
      <div className="m-auto flex w-full items-center justify-center">
        <div className="absolute mx-auto mb-36 ml-56 w-full max-w-5xl lg:h-[30vh]">
          <div className="lg:h-full lg:w-[40vh]">
            {isProcessing ? (
              <div className="text-center text-white">Processing Image...</div>
            ) : (
              imageData && <Canvas imageData={imageData} params={params} />
            )}
          </div>
        </div>
      </div>

      <h1 className="mb-3 text-lg leading-tight text-white lg:mt-6 lg:text-[36px]">
        {subtitle}
      </h1>

      <div className="mx-auto max-w-6xl text-xs text-neutral-400 lg:text-lg">
        <p>{line1}</p>
        <p>{line2}</p>
      </div>

      {/* CTA Buttons with Next.js Link */}
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
        <Button
          as={Link}
          href="/components/pages/card"
          color="primary"
          radius="full"
          size="md"
          className="bg-white text-black font-semibold hover:opacity-90"
        >
          เริ่มใช้งาน
        </Button>

        <Button
          as={Link}
          href="/components/pages/shop"
          variant="bordered"
          radius="full"
          size="md"
          className="border-white/40 text-white hover:bg-white/10"
        >
          ซื้อขาย
        </Button>
      </div>
    </div>
  );
});

/** ================== Hero ================== */
const SparklesCoreMemo = memo(SparklesCore);
const MeteorsMemo = memo(Meteors);
const ModelCanvasMemo = memo(ModelCanvas);

export default function Hero(): ReactElement {
  const heroText = content.hero;
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [inputText, SetInputText] = useState<string>("");

  useEffect(() => {
    const t = setTimeout(() => setIsModelLoaded(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`You asked: ${inputText}`);
    SetInputText(inputText);
  }, [inputText]);

  return (
    <section className="relative flex flex-col items-center justify-center px-4 text-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <SparklesCoreMemo
          background="transparent"
          minSize={0.2}
          maxSize={0.6}
          particleDensity={1}
          speed={0.15}
          className="h-full w-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full">
        <MeteorsMemo number={1} className="opacity-40" />
      </div>

      {isModelLoaded && (
        <div className="pointer-events-none absolute inset-0 z-20 select-none">
          <ModelCanvasMemo />
        </div>
      )}

      <div className="relative z-20">
        <HeroContent
          subtitle={heroText.subtitle}
          line1={heroText.line1}
          line2={heroText.line2}
        />
      </div>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="z-[9999] mx-auto w-full max-w-2xl -translate-y-36"
      >
        <GlowFrame>
          <Input
            defaultValue=""
            value={inputText}
            onChange={(e) => { SetInputText(e.target.value); }}
            radius="full"
            size="sm"
            variant="flat"
            placeholder="Ask me anything"
            aria-label="Ask me anything"
            autoComplete="off"
            spellCheck={false}
            classNames={{
              base: "w-full",
              inputWrapper:
                "bg-transparent data-[hover=true]:bg-transparent group-hover:bg-transparent shadow-none border-none h-12 px-2 rounded-full",
              input: "text-sm text-white",
              innerWrapper: "gap-2",
            }}
            startContent={
              <div className="ml-3 flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full">
                  <Plus className="h-4.5 w-4.5 text-white/75" />
                </span>
                <span className="h-4 w-px bg-white/10" />
              </div>
            }
            endContent={
              <button
                type="submit"
                aria-label="Send"
                className="mr-2 flex h-8 w-8 items-center justify-center rounded-full"
              >
                <Send className="h-5 w-5 text-white/80" />
              </button>
            }
          />
        </GlowFrame>
      </form>

      {/* Logos */}
      <div className="relative z-30 mx-auto w-[90%] lg:mb-28 lg:max-w-5xl">
        <GradientMask>
          <InfiniteMarquee speed={0.7}>
            <LogoGrid />
          </InfiniteMarquee>
        </GradientMask>
      </div>
    </section>
  );
}
