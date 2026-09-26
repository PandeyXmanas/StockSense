export default function Home() {
  return (
    <div className="min-h-screen bg-offwhite text-charcoal flex flex-col items-center justify-center p-8 text-center border-4 border-charcoal m-4">
      <h1 className="font-mono text-5xl font-bold uppercase tracking-widest mb-4">
        Gantavya
      </h1>
      <p className="font-bold uppercase text-lg mb-12">
        B2G Municipal Micro-Transit Utility Prototype
      </p>
      
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <a
          href="/passenger"
          className="border-2 border-charcoal p-4 font-mono font-bold uppercase tracking-wider bg-charcoal text-offwhite hover:bg-offwhite hover:text-charcoal transition-colors"
        >
          1. Mobile Passenger Interface
        </a>
        <a
          href="/dashboard"
          className="border-2 border-charcoal p-4 font-mono font-bold uppercase tracking-wider hover:bg-charcoal hover:text-offwhite transition-colors"
        >
          2. Municipal Dashboard
        </a>
      </div>
    </div>
  );
}
