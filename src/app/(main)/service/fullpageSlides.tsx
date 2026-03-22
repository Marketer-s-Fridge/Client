// components/FullpageSlides.tsx
export default function FullpageSlides() {
  const SECTIONS = [
    { id: 1, color: "bg-rose-50" },
    { id: 2, color: "bg-blue-50" },
    { id: 3, color: "bg-emerald-50" },
    { id: 4, color: "bg-emerald-50" },
    { id: 5, color: "bg-emerald-50" },
  ];
  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {SECTIONS.map((s) => (
        <section
          key={s.id}
          className={`h-screen snap-start flex items-center justify-center ${s.color}`}
        >
          <div className="w-full h-full relative overflow-hidden">
            {/* 들어올 때 아래→위 슬라이드 느낌 */}
            <div className="slide-enter h-full w-full" />
            <h1 className="absolute inset-0 grid place-items-center text-3xl font-bold">
              Section {s.id}
            </h1>
          </div>
        </section>
      ))}
    </main>
  );
}
