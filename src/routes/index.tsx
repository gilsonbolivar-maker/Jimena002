import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Clock, MapPin, Phone, Instagram } from "lucide-react";
import foto from "@/assets/jimena-andrade.webp.asset.json";
import botox from "@/assets/tratamento-botox.jpg";
import pele from "@/assets/pele-luminosa.jpg";
import facial from "@/assets/cuidado-facial.jpg";

const WHATS = "https://wa.me/5577998000177?text=" + encodeURIComponent("Olá! Vim pelo site e gostaria de agendar um horário.");
const INSTA = "https://instagram.com/jimennandrade";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jimena Andrade — Harmonização Orofacial em Caetité" },
      { name: "description", content: "Botox, preenchimentos e bioestimuladores de colágeno. Agende seu horário com Jimena Andrade em Caetité — BA." },
      { property: "og:title", content: "Jimena Andrade — Harmonização Orofacial" },
      { property: "og:description", content: "Contra os efeitos do tempo. A favor da sua beleza. Agende seu horário." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const beneficios = [
  "Resultados em poucos dias",
  "Evita formação de rugas",
  "Ameniza linhas de expressão",
  "Aparência de pele descansada",
  "Traz luminosidade para a pele",
];

const servicos = [
  { img: pele, eyebrow: "Lembrete do dia", titulo: "Se cuide, se ame e se valorize", tom: "claro" },
  { img: botox, eyebrow: "Tudo que você precisa saber sobre", titulo: "Botox", tom: "peach" },
  { img: facial, eyebrow: "Tratamentos para", titulo: "Preenchimento & Colágeno", tom: "claro" },
];

function Ornamento({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="14">
        <circle cx="0" cy="0" r="120" />
        <path d="M60 -10 Q 120 60 60 130" />
        <path d="M-10 60 Q 60 120 130 60" />
      </g>
    </svg>
  );
}

function Agendar({ className = "" }: { className?: string }) {
  return (
    <a href={WHATS} target="_blank" rel="noopener" className={"inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium tracking-wide text-primary-foreground transition hover:bg-primary/90 " + className}>
      Agende seu horário <ChevronRight className="h-4 w-4" />
    </a>
  );
}

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="leading-none">
          <span className="block font-script text-4xl text-primary">Jimena Andrade</span>
          <span className="mt-1 block text-[10px] tracking-[0.35em] text-muted-foreground">HARMONIZAÇÃO OROFACIAL</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <a href="#beneficios" className="hover:text-accent">Benefícios</a>
          <a href="#tratamentos" className="hover:text-accent">Tratamentos</a>
          <a href="#contato" className="hover:text-accent">Contato</a>
          <a href="/cliente.html?aba=inscricao" className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground hover:bg-primary/90">Pedir consulta</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-8 md:grid-cols-[1.1fr_1fr]">
        <Ornamento className="pointer-events-none absolute -left-24 -top-10 h-64 w-64 text-primary/15" />
        <div className="relative">
          <p className="text-xs tracking-[0.4em] text-muted-foreground">ESPAÇO DE BELEZA · CAETITÉ — BA</p>
          <h1 className="mt-6 font-display text-6xl font-light leading-[0.95] text-primary md:text-8xl">
            Contra os efeitos do tempo.
            <span className="mt-2 block italic text-accent">A favor da sua beleza.</span>
          </h1>
          <p className="mt-8 max-w-md text-lg font-light text-muted-foreground">
            Botox, preenchimentos e bioestimuladores de colágeno com olhar cuidadoso e resultado natural.
          </p>
          <div className="mt-10 grid max-w-lg gap-3 sm:grid-cols-2">
            <a href="/cliente.html?aba=inscricao" className="rounded-2xl bg-primary px-5 py-4 text-primary-foreground transition hover:bg-primary/90">
              <span className="block font-medium">Pedir primeira consulta</span>
              <span className="block text-xs opacity-80">Faça sua inscrição e escolha o dia e o horário</span>
            </a>
            <a href="/cliente.html?aba=entrar" className="rounded-2xl border border-primary/40 px-5 py-4 transition hover:bg-secondary">
              <span className="block font-medium">Remarcar atendimento</span>
              <span className="block text-xs text-muted-foreground">Para quem já tem horário marcado</span>
            </a>
          </div>
          <p className="mt-6 max-w-lg rounded-2xl bg-secondary px-5 py-4 text-sm text-muted-foreground">
            <b className="text-foreground">Regra para remarcar:</b> pela internet, só com pelo menos 72 horas de antecedência. Com menos tempo, a remarcação é feita pessoalmente com a clínica.
          </p>
        </div>
        <div className="relative">
          <div className="absolute -right-24 top-10 bottom-[-3rem] w-2/3 rounded-l-3xl bg-primary" />
          <div className="absolute -right-6 top-0 bottom-[-1.5rem] w-1/2 rounded-3xl border-2 border-primary-foreground/70" />
          <img src={foto.url} alt="Jimena Andrade" width={960} height={1200} className="relative aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl" />
        </div>
      </section>

      {/* Benefícios — estilo "05 Benefícios do Botox" */}
      <section id="beneficios" className="relative bg-card py-24">
        <Ornamento className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 text-sage/20" />
        <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-2">
          <div className="relative">
            <p className="font-sans text-4xl font-light md:text-5xl">05 Benefícios do</p>
            <h2 className="font-display text-8xl font-light leading-none text-primary md:text-[9rem]">Botox</h2>
            <ul className="mt-10 space-y-6">
              {beneficios.map((b) => (
                <li key={b} className="flex items-center gap-4 text-xl font-light">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <Agendar className="mt-10" />
          </div>
          <div className="relative">
            <div className="absolute -right-24 -top-8 -bottom-8 w-1/2 bg-sage" />
            <div className="absolute -right-4 top-8 bottom-8 w-1/3 rounded-3xl border-2 border-primary-foreground/70" />
            <img src={botox} alt="Aplicação de botox" width={864} height={1152} loading="lazy" className="relative aspect-[3/4] w-full rounded-3xl object-cover shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Tratamentos — estilo social media */}
      <section id="tratamentos" className="relative py-24" style={{ background: "var(--gradient-peach)" }}>
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs tracking-[0.5em] text-muted-foreground">TRATAMENTOS</p>
          <h2 className="mt-4 font-display text-5xl font-medium text-accent md:text-7xl">clínica de estética</h2>
          <div className="mt-16 grid gap-6 text-left md:grid-cols-3">
            {servicos.map((s) => (
              <article key={s.titulo} className={"group relative aspect-square overflow-hidden rounded-sm shadow-xl " + (s.tom === "peach" ? "bg-accent" : "bg-card")}>
                <img src={s.img} alt={s.titulo} loading="lazy" width={1024} height={1024} className={"absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 " + (s.tom === "peach" ? "opacity-60 mix-blend-multiply" : "opacity-80")} />
                <div className="absolute inset-0 bg-gradient-to-r from-card/90 via-card/40 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-6">
                  <p className="text-xs text-muted-foreground">{s.eyebrow}</p>
                  <h3 className="mt-1 max-w-[70%] font-display text-4xl leading-tight text-accent">{s.titulo}</h3>
                  <div className="mt-6 h-px w-full bg-accent/50" />
                </div>
              </article>
            ))}
          </div>
          <p className="mt-20 font-display text-6xl text-accent md:text-7xl">Se cuide</p>
          <p className="mt-2 text-sm text-muted-foreground">Me acompanhe em: <a href={INSTA} className="underline">@jimennandrade</a></p>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="relative overflow-hidden bg-primary py-20 text-primary-foreground">
        <Ornamento className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 text-primary-foreground/10" />
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <span className="font-script text-5xl">Jimena Andrade</span>
            <p className="mt-2 text-xs tracking-[0.35em] opacity-80">HARMONIZAÇÃO OROFACIAL</p>
            <a href={WHATS} target="_blank" rel="noopener" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-6 py-3 text-sm font-medium text-primary hover:opacity-90">
              Agende seu horário <ChevronRight className="h-4 w-4" />
            </a>
          </div>
          <ul className="space-y-5 text-lg font-light">
            <li className="flex items-center gap-4"><Clock className="h-5 w-5 opacity-70" />Segunda a sábado, das 08:00 às 18:00</li>
            <li className="flex items-center gap-4"><Phone className="h-5 w-5 opacity-70" /><a href={WHATS} target="_blank" rel="noopener" className="hover:underline">(77) 99800-0177</a></li>
            <li className="flex items-center gap-4"><MapPin className="h-5 w-5 opacity-70" />Avenida Santana, 328 — Caetité — BA</li>
            <li className="flex items-center gap-4"><Instagram className="h-5 w-5 opacity-70" /><a href={INSTA} target="_blank" rel="noopener" className="hover:underline">@jimennandrade</a></li>
          </ul>
        </div>
      </section>
      <footer className="bg-primary pb-8 text-center text-xs text-primary-foreground/60">© Jimena Andrade · <a href="/entrar.html" className="underline">Área da equipe</a></footer>
    </div>
  );
}
