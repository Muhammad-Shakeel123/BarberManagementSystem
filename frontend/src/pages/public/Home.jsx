import {
  ArrowRight,
  CalendarCheck2,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
  Menu,
  Scissors,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeSelector from "@/components/layout/ThemeSelector";

const services = [
  {
    name: "Signature Cut",
    detail: "Precision shape, finish and styling",
    price: "From Rs. 1,200",
  },
  {
    name: "Beard Ritual",
    detail: "Hot towel, line-up and conditioning",
    price: "From Rs. 700",
  },
  {
    name: "Cut + Beard",
    detail: "The complete BarberPro reset",
    price: "From Rs. 1,700",
  },
];

const steps = [
  [
    "01",
    "Find your branch",
    "Search nearby locations or browse the full network.",
    MapPin,
  ],
  [
    "02",
    "Choose your craft",
    "Pick a service and barber whose work fits your style.",
    Scissors,
  ],
  [
    "03",
    "Claim your time",
    "See live availability, reserve a slot and stay in control.",
    CalendarCheck2,
  ],
];

function Home() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const go = (path) => {
    setMobileOpen(false);
    navigate(path);
  };
  const links = [
    ["Services", "#services"],
    ["How it works", "#how-it-works"],
    ["Locations", "#locations"],
    ["For barbers", "#barbers"],
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--bg-primary)] text-[var(--text-main)]">
      <header className="sticky inset-x-0 top-0 z-50 border-b border-[var(--border-color-subtle)] bg-[var(--topbar-bg)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <button
            type="button"
            onClick={() => go("/")}
            className="group flex items-center gap-3 text-left"
          >
            <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--btn-gradient-from)] to-[var(--btn-gradient-to)] text-[var(--btn-text)] shadow-lg shadow-black/20">
              <Scissors className="size-5 transition-transform group-hover:rotate-12" />
            </span>
            <span>
              <strong className="block text-base font-black tracking-tight">
                Barber<span className="text-[var(--accent-color)]">Pro</span>
              </strong>
              <small className="block text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                The better cut, booked
              </small>
            </span>
          </button>
          <nav className="hidden items-center gap-8 lg:flex">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-xs font-bold text-[var(--text-muted)] transition hover:text-[var(--text-main)]"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeSelector compact />
            <button
              type="button"
              onClick={() => go("/login")}
              className="hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] px-4 py-2.5 text-xs font-bold text-[var(--text-subtle)] transition hover:border-[var(--accent-color)] hover:text-[var(--text-main)] sm:block"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => go("/register")}
              className="hidden items-center gap-2 rounded-xl bg-gradient-to-br from-[var(--btn-gradient-from)] to-[var(--btn-gradient-to)] px-4 py-2.5 text-xs font-black text-[var(--btn-text)] shadow-lg shadow-black/20 transition hover:brightness-110 sm:inline-flex"
            >
              Book a visit <ArrowRight className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="flex size-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-subtle)] lg:hidden"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="border-t border-[var(--border-color-subtle)] bg-[var(--bg-surface)] px-5 py-4 lg:hidden">
            <div className="mx-auto grid max-w-7xl gap-1">
              {links.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-bold text-[var(--text-subtle)] hover:bg-[var(--bg-elevated)]"
                >
                  {label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => go("/register")}
                className="mt-2 rounded-xl bg-[var(--btn-gradient-from)] px-3 py-3 text-left text-sm font-black text-[var(--btn-text)]"
              >
                Book a visit
              </button>
            </div>
          </nav>
        )}
      </header>

      <main>
        <section className="relative isolate flex min-h-[680px] items-center overflow-hidden py-16 sm:min-h-[740px] sm:py-20">
          <div className="absolute inset-0 -z-20 bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=2200&q=85')] bg-cover bg-center" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,9,12,0.96)_0%,rgba(7,9,12,0.8)_42%,rgba(7,9,12,0.24)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,var(--bg-primary)_0%,transparent_35%)] opacity-90" />
          <div className="mx-auto grid w-full max-w-7xl items-end gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--accent-color)] backdrop-blur-md">
                <Sparkles className="size-3.5" /> A sharper way to show up
              </div>
              <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-7xl">
                Good hair days
                <br />
                <span className="text-[var(--accent-color)]">
                  start on time.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
                Find the right barber, choose the right service, and walk into a
                chair that is ready for you.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => go("/register")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent-color)] px-5 py-3 text-sm font-black text-[var(--btn-text)] shadow-xl transition hover:brightness-110"
                >
                  Reserve your chair <ArrowRight className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go("/login")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-black/25 px-5 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-black/40"
                >
                  I already have an account
                </button>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-white/65">
                <span className="inline-flex items-center gap-2">
                  <Check className="size-4 text-[var(--accent-color)]" /> Live
                  slot availability
                </span>
                <span className="inline-flex items-center gap-2">
                  <Check className="size-4 text-[var(--accent-color)]" /> Secure
                  payments
                </span>
                <span className="inline-flex items-center gap-2">
                  <Check className="size-4 text-[var(--accent-color)]" /> Nearby
                  branches
                </span>
              </div>
            </div>
            <div className="hidden justify-self-end lg:block">
              <div className="w-80 rounded-3xl border border-white/20 bg-black/35 p-5 text-white shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--accent-color)]">
                      BarberPro live
                    </p>
                    <p className="mt-1 text-sm font-bold">
                      Your next appointment
                    </p>
                  </div>
                  <span className="flex size-9 items-center justify-center rounded-xl bg-[var(--accent-color)] text-[var(--btn-text)]">
                    <CalendarCheck2 className="size-4" />
                  </span>
                </div>
                <div className="py-5">
                  <p className="text-xs text-white/50">Signature Cut</p>
                  <p className="mt-1 text-2xl font-black">Find your time</p>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-white/15 bg-white/5 p-3">
                      <Clock3 className="size-4 text-[var(--accent-color)]" />
                      <p className="mt-2 text-[10px] font-bold text-white/60">
                        Flexible slots
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/15 bg-white/5 p-3">
                      <MapPin className="size-4 text-[var(--accent-color)]" />
                      <p className="mt-2 text-[10px] font-bold text-white/60">
                        Nearby salons
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => go("/register")}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-xs font-black text-black transition hover:bg-[var(--accent-color)]"
                >
                  Start booking <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--border-color-subtle)] bg-[var(--bg-surface)]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[var(--border-color-subtle)] sm:grid-cols-4">
            <Metric value="3 steps" label="from search to chair" />
            <Metric value="Live" label="availability you can trust" />
            <Metric value="1 account" label="for every visit" />
            <Metric value="24/7" label="book when ready" />
          </div>
        </section>

        <section id="services" className="scroll-mt-24">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <SectionIntro
              eyebrow="The menu"
              title="A better cut starts with a clear choice."
              text="Choose the service that fits the moment. Your barber, branch and live slots come next."
            />
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.name}
                  className="group relative overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--accent-color)]"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--bg-elevated)] text-[var(--accent-color)]">
                    <Scissors className="size-5" />
                  </div>
                  <h3 className="mt-8 text-xl font-black">{service.name}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-[var(--text-muted)]">
                    {service.detail}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-[var(--border-color-subtle)] pt-4">
                    <span className="text-xs font-bold text-[var(--accent-color)]">
                      {service.price}
                    </span>
                    <ArrowRight className="size-4 text-[var(--text-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--accent-color)]" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--border-color-subtle)] bg-[var(--bg-surface)]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <SectionIntro
                eyebrow="The BarberPro standard"
                title="The details are the difference."
                text="A calm space, a clean finish and a professional who knows exactly what to do next."
              />
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
                <Sparkles className="size-4 text-[var(--accent-color)]" />{" "}
                Crafted for the chair
              </span>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <ImageTile
                image="https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=82"
                label="Precision"
                detail="The finish matters."
              />
              <ImageTile
                image="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=82"
                label="Craft"
                detail="Experience in every detail."
              />
              <ImageTile
                image="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=82"
                label="Confidence"
                detail="Leave ready for anything."
              />
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-24 border-y border-[var(--border-color-subtle)] bg-[var(--bg-surface)]"
        >
          <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <SectionIntro
                eyebrow="The rhythm"
                title="No calls. No guesswork. No wasted afternoon."
                text="Everything important is visible before you leave home."
              />
              <button
                type="button"
                onClick={() => go("/register")}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--btn-gradient-from)] px-5 py-3 text-sm font-black text-[var(--btn-text)]"
              >
                Book your first visit <ArrowRight className="size-4" />
              </button>
            </div>
            <div className="space-y-3">
              {steps.map(([number, title, text, Icon]) => (
                <div
                  key={number}
                  className="flex gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-5"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-color)] text-[var(--btn-text)]">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black tracking-[0.18em] text-[var(--accent-color)]">
                        {number}
                      </span>
                      <h3 className="text-sm font-black">{title}</h3>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="locations" className="scroll-mt-24">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
              <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] border border-[var(--border-color)] bg-[url('https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-color)]">
                    The network
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">
                    A good chair should be close.
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    Find a branch in your city, then let the live schedule do
                    the rest.
                  </p>
                </div>
              </div>
              <div>
                <SectionIntro
                  eyebrow="Find your place"
                  title="Your favorite branch is one search away."
                  text="Browse locations by city, street or branch code. Select a salon, see the barbers, and book the slot that fits."
                />
                <div className="mt-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4">
                  <div className="flex items-center gap-3 border-b border-[var(--border-color-subtle)] pb-4">
                    <Search className="size-4 text-[var(--accent-color)]" />
                    <span className="text-sm text-[var(--text-muted)]">
                      Search branches, cities or streets
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <Branch name="Mardan Main Branch" location="Mardan, KPK" />
                    <Branch
                      name="Blue Area Express"
                      location="Islamabad, ICT"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => go("/register")}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] py-3 text-xs font-black text-[var(--text-subtle)] transition hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
                  >
                    Browse all locations <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="barbers"
          className="scroll-mt-24 border-y border-[var(--border-color-subtle)] bg-[var(--bg-surface)]"
        >
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <SectionIntro
                  eyebrow="More than a booking"
                  title="Built for calm visits and confident barbers."
                  text="Customers get clarity. Barbers get a clean schedule, live queue context and fewer interruptions."
                />
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <Benefit
                    icon={Clock3}
                    title="Less waiting"
                    text="Live slots and queue updates."
                  />
                  <Benefit
                    icon={ShieldCheck}
                    title="More trust"
                    text="Secure profiles and payments."
                  />
                  <Benefit
                    icon={Users}
                    title="Better flow"
                    text="One shared source of truth."
                  />
                </div>
              </div>
              <div className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-primary)] p-6 sm:p-8">
                <div className="flex items-center justify-between border-b border-[var(--border-color-subtle)] pb-5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--accent-color)]">
                      Live queue
                    </p>
                    <p className="mt-1 text-lg font-black">Blue Area Express</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-color)]/15 px-3 py-1.5 text-[10px] font-black text-[var(--accent-color)]">
                    <span className="size-1.5 rounded-full bg-[var(--accent-secondary)]" />{" "}
                    Active
                  </span>
                </div>
                <div className="py-7">
                  <p className="text-6xl font-black tracking-[-0.06em]">06</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    customers in the wider branch queue
                  </p>
                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                    <div className="h-full w-[68%] rounded-full bg-[var(--accent-color)]" />
                  </div>
                  <div className="mt-3 flex justify-between text-[10px] font-bold text-[var(--text-muted)]">
                    <span>Good time to reserve</span>
                    <span>68% flow</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => go("/register")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent-color)] py-3 text-xs font-black text-[var(--btn-text)]"
                >
                  Join the flow <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <SectionIntro
              eyebrow="The feeling"
              title="Leave with more than a haircut."
              text="A polished experience is made of small things: a clear arrival, a prepared barber and time that respects yours."
            />
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <Quote
                quote="I know exactly where to go and when to arrive. That alone changed the whole experience."
                name="Ayesha M."
                detail="Regular customer"
              />
              <Quote
                quote="The live schedule keeps my day moving and lets me focus on the work in the chair."
                name="Hamza R."
                detail="BarberPro barber"
              />
              <Quote
                quote="Simple choices, clean service and no awkward phone calls. That is how booking should feel."
                name="Saad K."
                detail="Verified customer"
              />
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 sm:px-8">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-surface)] px-6 py-16 text-center shadow-2xl sm:px-12">
            <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-[var(--ambient-1)] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-20 size-80 rounded-full bg-[var(--ambient-2)] blur-3xl" />
            <div className="relative">
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[var(--accent-color)] text-[var(--btn-text)]">
                <Scissors className="size-6" />
              </span>
              <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Your next great look is waiting.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--text-muted)]">
                Create your account, choose your branch and make the next visit
                the easiest one yet.
              </p>
              <button
                type="button"
                onClick={() => go("/register")}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[var(--btn-gradient-from)] to-[var(--btn-gradient-to)] px-6 py-3.5 text-sm font-black text-[var(--btn-text)] shadow-xl"
              >
                Create your account <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border-color-subtle)] bg-[var(--bg-sidebar)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black">
              Barber<span className="text-[var(--accent-color)]">Pro</span>
            </p>
            <p className="mt-1 text-[10px] text-[var(--text-muted)]">
              Modern appointments for modern barbershops.
            </p>
          </div>
          <div className="flex items-center gap-5 text-xs font-bold text-[var(--text-muted)]">
            <button
              type="button"
              onClick={() => go("/login")}
              className="hover:text-[var(--text-main)]"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => go("/register")}
              className="hover:text-[var(--text-main)]"
            >
              Register
            </button>
            <span>Copyright {new Date().getFullYear()} BarberPro</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Metric({ value, label }) {
  return (
    <div className="px-4 py-6 text-center sm:px-5">
      <p className="text-xl font-black sm:text-2xl">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>
    </div>
  );
}
function SectionIntro({ eyebrow, title, text }) {
  return (
    <div className="max-w-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-color)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black leading-tight tracking-[-0.03em] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{text}</p>
    </div>
  );
}
function Branch({ name, location }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border-color-subtle)] bg-[var(--bg-elevated)] p-3">
      <span className="flex size-9 items-center justify-center rounded-lg bg-[var(--accent-color)]/15 text-[var(--accent-color)]">
        <MapPin className="size-4" />
      </span>
      <span>
        <strong className="block text-xs font-black">{name}</strong>
        <small className="block text-[10px] text-[var(--text-muted)]">
          {location}
        </small>
      </span>
    </div>
  );
}
function Benefit({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-4">
      <Icon className="size-4 text-[var(--accent-color)]" />
      <p className="mt-3 text-xs font-black">{title}</p>
      <p className="mt-1 text-[10px] leading-5 text-[var(--text-muted)]">
        {text}
      </p>
    </div>
  );
}
function ImageTile({ image, label, detail }) {
  return (
    <article className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-elevated)]">
      <img
        src={image}
        alt={label}
        className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5 text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-color)]">
          {label}
        </p>
        <p className="mt-2 text-lg font-black">{detail}</p>
      </div>
    </article>
  );
}
function Quote({ quote, name, detail }) {
  return (
    <article className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6">
      <div className="flex gap-1 text-[var(--accent-color)]">
        <Star className="size-3.5 fill-current" />
        <Star className="size-3.5 fill-current" />
        <Star className="size-3.5 fill-current" />
        <Star className="size-3.5 fill-current" />
        <Star className="size-3.5 fill-current" />
      </div>
      <p className="mt-5 text-sm font-bold leading-7">&quot;{quote}&quot;</p>
      <div className="mt-6 border-t border-[var(--border-color-subtle)] pt-4">
        <p className="text-xs font-black">{name}</p>
        <p className="mt-1 text-[10px] text-[var(--text-muted)]">{detail}</p>
      </div>
    </article>
  );
}

export default Home;
