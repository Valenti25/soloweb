import React, { Suspense, useRef, useState, useEffect } from "react";

export default function ModelCanvas() {
  const Spline = React.lazy(() => import("@splinetool/react-spline"));
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    import("@splinetool/react-spline");
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative h-[25vh] w-full lg:min-h-[500px] lg:overflow-hidden"
    >
      <div className="absolute top-[90%] z-[-10] -left-10 h-4/5 w-1/2 lg:top-[30%] lg:-left-24">
        {isInView && (
          <Suspense>
            <Spline scene="https://prod.spline.design/xL-t0Lh448fOlFwb/scene.splinecode" />
          </Suspense>
        )}
      </div>
    </div>
  );
}