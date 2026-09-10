"use client";

import { useEffect, useRef, useState } from "react";

/*
  THESIS: A pre-launch page that argues the product is a sport, not an app — the referee (AI-judged
  reps), the ladder, and a $500 launch-week hook, in that order, all pointed at one email field.
  OWN-WORLD: Pitch-black ground, lime (#CCFF00) committed at page scale (logo glow, pill, CTA,
  focus states), rounded glass cards on a lime bloom, Inter/Outfit inherited from the shipped VYRO
  app, built on Tailwind utilities.
  STORY: A cold visitor learns the reps are camera-judged (so the ladder is real), sees a ranked
  ladder worth climbing, hears about the launch-week $500, and joins the waitlist to not miss it.
  FIRST VIEWPORT: The welcome hero carried over from the shipped app — mark, AI-JUDGED pill,
  "Fitness is now a competitive sport.", the empty 9:16 clip slot, the stat row, Get Started and
  the invite-code path.
  FORM: Content and structure pass over the existing whitelist route — hero preserved, three new
  sections added below it, one waitlist form at the close.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the
  verdict, DESIGN.md, and every shipping raster carrying its provenance.
*/

const VALID_CREATOR_CODES = ["VYROCREATOR", "ALPHA", "FOUNDER", "VIP1"];

// Illustrative, same as the shipped welcome screen: a launch-facing figure, not a live count.
const ONLINE_PLACEHOLDER = "2,481";
const LEAGUES_ADVERTISED = 3;
const EXERCISES = ["Push Ups", "Squats"];

type CreatorState = "idle" | "checking" | "granted" | "invalid";

export default function Page() {
  const [email, setEmail] = useState("");
  const [waitlisted, setWaitlisted] = useState(false);

  const [showInvite, setShowInvite] = useState(false);
  const [creatorCode, setCreatorCode] = useState("");
  const [creatorState, setCreatorState] = useState<CreatorState>("idle");
  const [unlocked, setUnlocked] = useState(false);

  const inviteInputRef = useRef<HTMLInputElement | null>(null);
  const inviteSectionRef = useRef<HTMLDivElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const waitlistRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (showInvite) inviteInputRef.current?.focus();
  }, [showInvite]);

  function scrollToWaitlist() {
    waitlistRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => emailInputRef.current?.focus(), 600);
  }

  function openInvite() {
    setShowInvite(true);
    inviteSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleWaitlistSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const list = JSON.parse(localStorage.getItem("vyro_waitlist") || "[]");
      list.push({ email: email.trim(), at: Date.now() });
      localStorage.setItem("vyro_waitlist", JSON.stringify(list));
    } catch {}
    setWaitlisted(true);
  }

  function handleCreatorSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = creatorCode.trim().toUpperCase();
    if (!code) {
      setCreatorState("invalid");
      return;
    }
    setCreatorState("checking");
    window.setTimeout(() => {
      if (!VALID_CREATOR_CODES.includes(code)) {
        setCreatorState("invalid");
        return;
      }
      try {
        localStorage.setItem("vyro_creator_code", code);
      } catch {}
      setCreatorState("granted");
      window.setTimeout(() => setUnlocked(true), 1100);
    }, 550);
  }

  return (
    <main className="relative min-h-dvh w-full overflow-x-hidden bg-black">
      {/* ambient field */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-30%] h-[80vh] w-[130vw] max-w-[1400px] -translate-x-1/2 blur-[6px]"
        style={{
          background:
            "radial-gradient(ellipse 55% 55% at 50% 30%, rgba(204,255,0,.22), rgba(204,255,0,.05) 48%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[120vh] h-[70vh] w-[120vw] max-w-[1200px] -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(204,255,0,.09), transparent 68%)" }}
      />
      <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 opacity-[.035] mix-blend-overlay" />

      <div className="relative z-10 mx-auto w-full max-w-[560px] px-5 pb-16 pt-10 sm:px-8">
        {/* ───────────── hero ───────────── */}
        <section className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/[.08] bg-[#1A1F14] shadow-[0_0_40px_-6px_rgba(204,255,0,.45)]">
            <svg viewBox="0 0 200 200" fill="none" aria-hidden className="h-9 w-9">
              <path d="M18 22 L78 22 L100 96 L122 22 L182 22 L122 178 L100 130 L78 178 Z" fill="#CCFF00" />
              <path d="M108 78 L128 78 L108 122 L96 122 L104 96 L88 96 Z" fill="#14171A" />
            </svg>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/[.12] bg-white/[.04] px-3.5 py-1.5 backdrop-blur-md">
            <span className="h-[6px] w-[6px] rounded-full bg-lime shadow-[0_0_8px_rgba(204,255,0,.9)]" />
            <span className="font-display text-[10.5px] font-extrabold tracking-[.14em] text-white/70">
              AI-JUDGED · 1V1 · RANKED
            </span>
          </div>

          <h1 className="mt-6 font-display text-[38px] font-black leading-[1.02] tracking-tight text-white sm:text-[44px]">
            Fitness is now
            <br />a competitive sport.
          </h1>
          <p className="mt-4 max-w-[34ch] text-[14px] font-medium leading-relaxed text-white/55">
            Real-time 1v1 battles. AI counts only perfect reps. Climb the global ladder.
          </p>

          {/* 9:16 clip slot — empty on purpose until a real workout clip lands */}
          <div className="relative mt-8 flex aspect-[9/16] w-[78%] max-w-[280px] flex-col items-center justify-center gap-3 overflow-hidden rounded-[28px] border border-white/[.09] bg-gradient-to-b from-[#0a0d07] via-black to-[#050600] shadow-[0_50px_110px_-35px_rgba(0,0,0,0.95)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse 100% 55% at 50% 8%, rgba(204,255,0,.14), transparent 62%)" }}
            />
            <div
              aria-hidden
              className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/[.15] bg-white/[.06]"
            >
              <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-lime">
                <path d="M6 4l14 8-14 8z" />
              </svg>
            </div>
            <span className="relative text-[11px] font-semibold tracking-wide text-white/35">
              Workout clip coming soon
            </span>
          </div>

          {/* stat row */}
          <div className="mt-7 grid w-full grid-cols-3 gap-2.5">
            <Stat value={ONLINE_PLACEHOLDER} label="Online" live />
            <Stat value={String(LEAGUES_ADVERTISED)} label="Leagues" />
            <Stat value={String(EXERCISES.length)} label="Exercises" />
          </div>

          {/* actions */}
          <button
            type="button"
            onClick={scrollToWaitlist}
            className="mt-7 w-full rounded-full bg-gradient-to-br from-lime-bright via-lime to-lime-deep py-[18px] font-display text-[16px] font-black tracking-tight text-lime-ink shadow-[0_0_0_1px_rgba(204,255,0,.4),0_18px_46px_-12px_rgba(204,255,0,.7),0_0_60px_-8px_rgba(204,255,0,.5)] transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[.98]"
          >
            Get Started
          </button>
          <button
            type="button"
            onClick={openInvite}
            className="mt-4 text-[12.5px] font-semibold text-white/45 transition-colors hover:text-white/75"
          >
            I already have an account
          </button>
        </section>

        {/* ───────────── what is VYRO ───────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[27px] font-black leading-tight tracking-tight text-white">
            This isn&rsquo;t a workout app.
          </h2>
          <p className="mt-3 text-[14px] font-medium leading-relaxed text-white/55">
            It&rsquo;s a ranked sport, and your phone is the referee. You face someone live, both of you
            go at once, and the camera decides whose reps actually counted.
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <Card>
              <CardTitle>The AI judges every rep</CardTitle>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/55">
                Prop your phone up and go. Pose tracking watches your form in real time — full range or
                it doesn&rsquo;t count. Nobody types in a score. There is nothing to lie about.
              </p>
            </Card>
            <Card>
              <CardTitle>A ladder that means something</CardTitle>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/55">
                Every battle moves your RP. Climb from Bronze to Master, check where you sit on the
                global board or just among your friends, then defend it when the season resets.
              </p>
            </Card>
            <Card>
              <CardTitle>Call somebody out</CardTitle>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/55">
                Challenge a friend directly or get matched with a stranger who thinks they&rsquo;re
                better. Share the result either way. Winner takes the RP, loser gets to explain.
              </p>
            </Card>
          </div>
        </section>

        {/* ───────────── launch week challenge ───────────── */}
        <section className="relative mt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 blur-2xl"
            style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(204,255,0,.20), transparent 70%)" }}
          />
          <div className="relative overflow-hidden rounded-[28px] border border-lime/30 bg-gradient-to-b from-lime/[.10] via-white/[.03] to-transparent p-7 shadow-[0_0_60px_-20px_rgba(204,255,0,.5)]">
            <span className="inline-flex items-center rounded-full border border-lime/40 bg-lime/10 px-3 py-1 font-display text-[9.5px] font-extrabold tracking-[.14em] text-lime">
              COMING SOON
            </span>
            <h2 className="mt-4 font-display text-[27px] font-black leading-[1.08] tracking-tight text-white">
              Launch Week Challenge —{" "}
              <span className="text-lime [text-shadow:0_0_30px_rgba(204,255,0,.5)]">$500</span> up for grabs.
            </h2>
            <p className="mt-4 text-[14px] font-medium leading-relaxed text-white/60">
              60 seconds. Most valid push-ups wins $500, cash.
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-white/50">
              Every rep is judged by the same AI that referees your battles — half reps get thrown out,
              scores can&rsquo;t be typed in, and the board can&rsquo;t be argued with. Runs all launch
              week, straight from the app.
            </p>
            <p className="mt-4 font-display text-[13.5px] font-bold text-white/80">
              You have to be in the app to enter. You have to be on the list to be in the app.
            </p>
            <button
              type="button"
              onClick={scrollToWaitlist}
              className="mt-6 w-full rounded-full border border-lime/50 bg-lime/[.12] py-4 font-display text-[14px] font-extrabold tracking-tight text-lime transition-colors hover:bg-lime hover:text-lime-ink"
            >
              Get on the list before launch week
            </button>
          </div>
        </section>

        {/* ───────────── how it works ───────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[27px] font-black leading-tight tracking-tight text-white">
            How it works.
          </h2>
          <ol className="mt-6 flex flex-col gap-3">
            <Step n={1}>Pick your exercise — push-ups or squats.</Step>
            <Step n={2}>Get matched, or call out a friend.</Step>
            <Step n={3}>Prop your phone up. The AI counts only clean reps.</Step>
            <Step n={4}>Take the RP and climb the ladder.</Step>
          </ol>
        </section>

        {/* ───────────── waitlist ───────────── */}
        <section ref={waitlistRef} className="mt-20 scroll-mt-10">
          <div className="rounded-[28px] border border-white/[.09] bg-white/[.03] p-7">
            <div className="font-display text-[10.5px] font-extrabold tracking-[.14em] text-lime">
              JOIN THE WAITLIST
            </div>
            <h2 className="mt-3 font-display text-[25px] font-black leading-tight tracking-tight text-white">
              Get in before the ladder fills up.
            </h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-white/55">
              Leave your email and we&rsquo;ll tell you the moment VYRO opens up — in time for launch
              week.
            </p>

            {!waitlisted ? (
              <form onSubmit={handleWaitlistSubmit} className="mt-6 flex flex-col gap-2.5">
                <input
                  ref={emailInputRef}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full rounded-2xl border border-white/[.14] bg-black/45 px-4 py-4 text-[14.5px] font-medium text-white placeholder:text-white/30 focus:border-lime focus:bg-lime/5 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-br from-lime-bright via-lime to-lime-deep py-[18px] font-display text-[16px] font-black tracking-tight text-lime-ink shadow-[0_0_0_1px_rgba(204,255,0,.4),0_18px_46px_-12px_rgba(204,255,0,.7),0_0_60px_-8px_rgba(204,255,0,.5)] transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[.98]"
                >
                  JOIN THE WAITLIST
                </button>
              </form>
            ) : (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-lime/40 bg-lime/10 px-5 py-4">
                <CheckIcon />
                <span className="font-display text-[13px] font-bold text-lime">
                  You&rsquo;re on the list. We&rsquo;ll notify you when VYRO drops.
                </span>
              </div>
            )}

            {/* invite code / creator bypass */}
            <div ref={inviteSectionRef} className="mt-5 border-t border-white/[.08] pt-5">
              {unlocked ? (
                <div className="flex items-center gap-3 rounded-2xl border border-lime/40 bg-lime/10 px-5 py-4">
                  <CheckIcon />
                  <span className="font-display text-[13px] font-bold text-lime">
                    Creator pass unlocked. You&rsquo;re skipping the line.
                  </span>
                </div>
              ) : creatorState === "granted" ? (
                <div className="flex items-center gap-3 rounded-2xl border border-lime/40 bg-lime/10 px-5 py-4">
                  <CheckIcon />
                  <span className="font-display text-[13px] font-bold text-lime">
                    Access granted! Creator pass unlocked. Redirecting to app…
                  </span>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setShowInvite((v) => !v)}
                    className="text-[12.5px] font-semibold text-white/45 underline decoration-white/20 underline-offset-2 transition-colors hover:text-lime hover:decoration-lime"
                  >
                    {showInvite ? "Hide invite code" : "Have an invite code?"}
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-[400ms] ease-out ${
                      showInvite ? "mt-3 grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <form onSubmit={handleCreatorSubmit} className="flex gap-2">
                        <input
                          ref={inviteInputRef}
                          type="text"
                          maxLength={16}
                          value={creatorCode}
                          onChange={(e) => {
                            setCreatorCode(e.target.value);
                            if (creatorState === "invalid") setCreatorState("idle");
                          }}
                          placeholder="Enter invite code"
                          autoComplete="off"
                          className="min-w-0 flex-1 rounded-xl border border-white/[.14] bg-black/45 px-3.5 py-3 text-[13px] font-bold uppercase tracking-wider text-white placeholder:text-white/30 placeholder:normal-case placeholder:tracking-normal focus:border-lime focus:bg-lime/5 focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={creatorState === "checking"}
                          className="flex-shrink-0 rounded-xl bg-white/10 px-4 py-3 font-display text-[12.5px] font-extrabold text-white transition-colors hover:bg-lime hover:text-lime-ink disabled:opacity-60"
                        >
                          {creatorState === "checking" ? "Checking…" : "REDEEM"}
                        </button>
                      </form>
                      {creatorState === "invalid" && (
                        <p className="mt-2 text-[11.5px] font-semibold text-white/40">
                          That code isn&rsquo;t valid. Double-check it and try again.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="mt-8 text-center text-[11px] font-semibold text-white/25">
            VYRO — fitness is now a competitive sport.
          </p>
        </section>
      </div>
    </main>
  );
}

/* ───────────── small building blocks ───────────── */

function Stat({ value, label, live }: { value: string; label: string; live?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/[.08] bg-white/[.03] py-3 text-center">
      <b className="flex items-center justify-center gap-1.5 font-display text-[17px] font-extrabold text-white [font-variant-numeric:tabular-nums]">
        {live && <span className="h-[6px] w-[6px] rounded-full bg-lime shadow-[0_0_8px_rgba(204,255,0,.9)]" />}
        {value}
      </b>
      <u className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-white/35 no-underline">
        {label}
      </u>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[24px] border border-white/[.08] bg-white/[.03] p-6">{children}</div>;
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-[16px] font-extrabold tracking-tight text-white">{children}</h3>;
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-4 rounded-2xl border border-white/[.08] bg-white/[.03] px-5 py-4">
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-lime/40 bg-lime/10 font-display text-[13px] font-extrabold text-lime">
        {n}
      </span>
      <span className="text-[13.5px] font-medium leading-snug text-white/70">{children}</span>
    </li>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 stroke-lime" fill="none" strokeWidth="2.4">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
