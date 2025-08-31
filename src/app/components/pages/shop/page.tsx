"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  ArrowRight,
  Check,
  BookOpen,
  Download,
  Shield,
  Crown,
  Sparkles,
} from "lucide-react";

/* ===================== Data ===================== */

type Pack = {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  price: number;
  oldPrice?: number;
  decks: number;
  cards: number;
  rating: number;
  badge?: "popular" | "value";
  image?: { src: string; alt: string };
  features: string[];
};

const packs: Pack[] = [
  {
    id: "starter",
    title: "Starter Deck: พื้นฐาน GAT/TGAT",
    slug: "starter",
    tagline:
      "สรุปจากโน้ตจริงที่ผมใช้สอบ — เริ่มจากศูนย์สู่ทำข้อสอบได้เร็ว เน้นจำไว ใช้ได้จริง",
    price: 150,
    oldPrice: 199,
    decks: 5,
    cards: 300,
    rating: 4.6,
    badge: "popular",
    image: { src: "/images/3dicons-mobile-iso-gradient.png", alt: "Starter" },
    features: [
      "หัวข้อหลัก GAT เชื่อมโยง + TGAT คณิต/ภาษา เบื้องต้น",
      "แฟลชการ์ดสไตล์ Active Recall จากประสบการณ์สอบจริง",
      "ตัวอย่างโจทย์ระดับง่าย–กลาง พร้อมเฉลยย่อเข้าใจเร็ว",
      "เคล็ดลับแบ่งเวลาในห้องสอบและข้อควรระวัง",
    ],
  },
  {
    id: "pro",
    title: "Pro Bundle: ตะลุยโจทย์ออกบ่อย",
    slug: "pro",
    tagline:
      "คัดโจทย์จากแนวจริง + เทคนิคสนามสอบที่ผมใช้—ทำทันในเวลา ตัดช้อยส์ไว",
    price: 390,
    oldPrice: 520,
    decks: 18,
    cards: 1200,
    rating: 4.8,
    badge: "value",
    image: { src: "/images/3dicons-computer-iso-gradient.png", alt: "Pro" },
    features: [
      "เด็คโจทย์ออกบ่อย 18 หมวด ครอบคลุม GAT เชื่อมโยง / TGAT",
      "เทคนิคตัดช้อยส์เร็ว, Keyword mapping, แพทเทิร์นโจทย์ยอดนิยม",
      "เฉลยละเอียดพร้อมเหตุผล + จุดพลาดที่มักหลง (common traps)",
      "ตารางซ้อม 14 วัน + Checklist ก่อนสอบ พร้อมไฟล์ JSON/CSV/Anki",
    ],
  },
  {
    id: "ultimate",
    title: "Ultimate Lifetime: ครบทุกหมวด อัปเดตตลอดชีพ",
    slug: "ultimate",
    tagline:
      "ฐานความรู้จากสนามสอบจริง + อัปเดตตามแนวออกใหม่—ซื้อครั้งเดียวคุ้มยาว",
    price: 790,
    oldPrice: 1090,
    decks: 50,
    cards: 3200,
    rating: 4.95,
    image: { src: "/images/3dicons-money-iso-gradient.png", alt: "Ultimate" },
    features: [
      "แฟลชการ์ด 50+ หมวด ครอบคลุม TGAT/GAT และหัวข้อเสริมสำคัญ",
      "ข้อสอบจำลอง mini-mock พร้อมเฉลยอธิบายเชิงเหตุผล",
      "อัปเดตเนื้อหาตามแนวข้อสอบใหม่ต่อเนื่อง",
      "ลิขสิทธิ์ใช้ส่วนตัว ไม่จำกัดอุปกรณ์ (JSON/CSV/Anki ครบ)",
    ],
  },
];

const fmtTHB = (n: number) =>
  n.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  });

const discount = (price?: number, oldPrice?: number) =>
  oldPrice && oldPrice > price!
    ? Math.round(((oldPrice - price!) / oldPrice) * 100)
    : 0;

/* ===================== Card UI ===================== */

function PackCard(p: Pack) {
  const off = discount(p.price, p.oldPrice);

  return (
    <article className="stack-card relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-b from-zinc-900/70 to-black/70 p-6 text-white backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]">
      {/* Glow frame */}
      <div className="pointer-events-none absolute inset-0 rounded-[40px] ring-1 ring-white/10" />
      <div className="absolute -inset-px rounded-[40px] bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Badge */}
      {p.badge && (
        <div
          className={`absolute left-6 top-6 inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-xs ${
            p.badge === "popular"
              ? "bg-gradient-to-r from-violet-600 to-fuchsia-600"
              : "bg-gradient-to-r from-amber-500 to-orange-500"
          }`}
        >
          {p.badge === "popular" ? (
            <Sparkles className="h-4 w-4" />
          ) : (
            <Crown className="h-4 w-4" />
          )}
          <span className="font-medium">
            {p.badge === "popular" ? "ฮิตที่สุด" : "คุ้มสุด"}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {p.image?.src && (
          <img
            src={p.image.src}
            alt={p.image.alt}
            className="h-20 w-20 shrink-0 rounded-2xl object-contain"
          />
        )}
        <div className="min-w-0">
          <h3 className="truncate text-2xl font-bold">{p.title}</h3>
          <p className="mt-1 text-sm text-zinc-400">{p.tagline}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i + 1 <= Math.round(p.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-zinc-600"
                  }`}
                />
              ))}
              <span className="ml-1 text-zinc-300">{p.rating.toFixed(2)}</span>
            </div>
            <span className="h-3 w-px bg-white/10" />
            <span className="flex items-center gap-1 text-zinc-300">
              <BookOpen className="h-4 w-4 text-zinc-400" />
              {p.decks} เด็ค / {p.cards.toLocaleString()} การ์ด
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4 text-zinc-400" /> JSON · CSV · Anki
            </span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="mt-6 flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight">
              {fmtTHB(p.price)}
            </span>
            {p.oldPrice && (
              <span className="text-sm text-zinc-500 line-through">
                {fmtTHB(p.oldPrice)}
              </span>
            )}
          </div>
          {off > 0 && (
            <div className="mt-1 text-xs text-emerald-400">ประหยัด {off}%</div>
          )}
        </div>
        <div className="hidden items-center gap-2 text-xs text-zinc-400 sm:flex">
          <Shield className="h-4 w-4 text-zinc-500" />
          อัปเดตฟรีตามแพ็กเกจ
        </div>
      </div>

      {/* Features */}
      <ul className="mt-5 grid gap-2 text-sm text-zinc-300">
        {p.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-400" />
            <span className="leading-6">{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/checkout?sku=${p.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-black hover:opacity-90"
        >
          <ShoppingCart className="h-4 w-4" />
          ซื้อเลย
        </Link>
        <Link
          href={`/shop/${p.slug}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 px-5 py-3 text-white hover:bg-white/10"
        >
          ดูรายละเอียด
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

/* ===================== Stacked Scroller (no lib) ===================== */
export default function FlashcardStoreStackNoLib() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const rafRef = useRef<number | null>(null);

  // ปรับแต่งเอฟเฟกต์ได้ที่นี่
  const STACK_TOP = 0.2; // 20vh (ตำแหน่งที่การ์ดจะ sticky)
  const BASE_SCALE = 0.86; // สเกลพื้นฐานของใบที่ “ไปอยู่กองลึกสุด”
  const ITEM_SCALE = 0.035; // เพิ่มสเกลขึ้นทีละใบ (จากก้นกองไปหาใบบนสุด)
  const INTERP_RANGE = 160; // ระยะทาง px ที่ใช้ไล่ scale จาก 1 -> target
  const STACK_GAP = 30; // ระยะซ้อนแต่ละใบ (px)
  const RELEASE_SPACER = 600; // ระยะท้าย ๆ เผื่อปล่อยกอง

  const update = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const rectScroller = scroller.getBoundingClientRect();
    const stackTopPx = rectScroller.height * STACK_TOP;

    cardsRef.current.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const topInScroller = rect.top - rectScroller.top;

      const p = Math.max(
        0,
        Math.min(1, (stackTopPx - topInScroller) / INTERP_RANGE)
      );

      const targetScale = BASE_SCALE + i * ITEM_SCALE;
      const scale = 1 - p * (1 - targetScale);
      const translateY = Math.max(0, p * i * (STACK_GAP / 2));

      card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale.toFixed(
        3
      )})`;
      card.style.zIndex = String(1000 + i);
    });

    rafRef.current = null;
  };

  const onScroll = () => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      scroller.querySelectorAll<HTMLElement>(".stack-card")
    );
    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${STACK_GAP}px`;
      }
      card.style.willChange = "transform";
    });

    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="mx-auto mt-16 max-w-5xl px-4 py-12 text-white">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold md:text-3xl">
          การซื้อขายประสบการณ์
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
         เป็นการขายแฟรชการ์ดความรู้ละประสบการณ์ของคนที่เคยสอบมาก่อน
        </p>
      </div>

      {/* scroller แบบไม่ใช้ไลบราลี */}
      <div
        ref={scrollerRef}
        className="relative h-[100svh] overflow-y-auto overflow-x-visible rounded-2xl border border-white/5 bg-gradient-to-b from-black/40 to-black/80 p-4"
        style={{
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
          willChange: "scroll-position",
        }}
      >
        <div className="pb-[600px] pt-[20vh]">
          {packs.map((p) => (
            <div key={p.id} className="group mb-8">
              <PackCard {...p} />
            </div>
          ))}
          <div style={{ height: RELEASE_SPACER }} />
        </div>
      </div>

      {/* CSS สำหรับ sticky stack */}
      <style jsx>{`
        .stack-card {
          position: sticky;
          top: 20vh; /* ให้ “ติด” ที่ตำแหน่งนี้เวลาเลื่อน */
          transform-origin: top center;
          backface-visibility: hidden;
        }
          
      `}</style>
    </section>
  );
}
