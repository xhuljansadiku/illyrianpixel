export default function Loading() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="section-wrap py-20 md:py-28">
        <div className="loading-shimmer h-6 w-40 rounded-full bg-white/10" />
        <div className="mt-8 space-y-4">
          <div className="loading-shimmer h-16 max-w-3xl rounded-2xl bg-white/10 md:h-24" />
          <div className="loading-shimmer h-16 max-w-2xl rounded-2xl bg-white/10 md:h-24" />
        </div>
        <div className="mt-10 loading-shimmer h-5 max-w-xl rounded-full bg-white/10" />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="loading-shimmer h-[320px] rounded-[2rem] bg-white/10" />
          <div className="loading-shimmer h-[320px] rounded-[2rem] bg-white/10" />
        </div>
      </div>
    </main>
  );
}
