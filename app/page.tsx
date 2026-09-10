"use client";

import { useEffect, useRef, useState } from "react";

/*
  THESIS: A pre-launch page that argues the product is a sport, not an app — headline, gameplay
  slot, then the $500 launch-week hook as the page's centerpiece, all pointed at one email field.
  OWN-WORLD: The app's own ground, not flat black — green-black surfaces (#0E1210 / #12160E)
  warmed toward lime, alternating raised bands, hairline lime-tinted borders, and low-opacity lime
  blooms bleeding behind hero, challenge and close. Lime is the atmosphere; only the CTAs and the
  prize figure are allowed to be loud.
  STORY: A cold visitor learns from the headline alone that reps are camera-judged and ranked, sees
  the gameplay slot, hits the $500 challenge, and joins the waitlist to not miss it.
  FIRST VIEWPORT: Mark, AI-JUDGED pill, the headline doing the full explaining, and the 9:16 clip
  slot — no stat row and no account buttons competing with it.
  FORM: Theme overhaul plus reorder — hero copy carries the explanation, the challenge becomes the
  centerpiece, the invite code is demoted below the waitlist.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the
  verdict, DESIGN.md, and every shipping raster carrying its provenance.
*/

const VALID_CREATOR_CODES = ["VYROCREATOR", "ALPHA", "FOUNDER", "VIP1"];

type CreatorState = "idle" | "checking" | "granted" | "invalid";

export default function Page() {
  const [email, setEmail] = useState("");
  const [waitlisted, setWaitlisted] = useState(false);

  const [showInvite, setShowInvite] = useState(false);
  const [creatorCode, setCreatorCode] = useState("");
  const [creatorState, setCreatorState] = useState<CreatorState>("idle");
  const [unlocked, setUnlocked] = useState(false);

  const inviteInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const waitlistRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (showInvite) inviteInputRef.current?.focus();
  }, [showInvite]);

  function scrollToWaitlist() {
    waitlistRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => emailInputRef.current?.focus(), 600);
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
    <main className="relative w-full overflow-x-hidden">
      {/* ambient lime field — low-opacity blooms anchored to hero, challenge and close */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute left-1/2 top-[-22%] h-[70vh] w-[130vw] max-w-[1500px] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse 55% 55% at 50% 40%, rgba(200,255,0,.16), rgba(200,255,0,.045) 46%, transparent 72%)",
          }}
        />
        <div
          className="absolute left-1/2 top-[45%] h-[60vh] w-[120vw] max-w-[1300px] -translate-x-1/2"
          style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(200,255,0,.055), transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-18%] left-1/2 h-[55vh] w-[120vw] max-w-[1300px] -translate-x-1/2"
          style={{ background: "radial-gradient(ellipse 50% 50% at 50% 55%, rgba(200,255,0,.07), transparent 70%)" }}
        />
      </div>
      <div aria-hidden className="bg-grain pointer-events-none fixed inset-0 z-0 opacity-[.03] mix-blend-overlay" />

      <div className="relative z-10">
        {/* ───────────── hero ───────────── */}
        <section className="px-5 pb-14 pt-12 sm:px-8">
          <div className="mx-auto flex max-w-[560px] flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-lime/20 bg-surface-warm shadow-[0_0_40px_-6px_rgba(204,255,0,.45),inset_0_1px_0_rgba(204,255,0,.10)]">
              <svg viewBox="0 0 200 200" fill="none" aria-hidden className="h-9 w-9">
                <path d="M18 22 L78 22 L100 96 L122 22 L182 22 L122 178 L100 130 L78 178 Z" fill="#CCFF00" />
                <path d="M108 78 L128 78 L108 122 L96 122 L104 96 L88 96 Z" fill="#14171A" />
              </svg>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-lime/25 bg-lime/[.06] px-3.5 py-1.5 backdrop-blur-md">
              <span className="h-[6px] w-[6px] rounded-full bg-lime shadow-[0_0_8px_rgba(204,255,0,.9)]" />
              <span className="font-display text-[10.5px] font-extrabold tracking-[.14em] text-lime-text">
                AI-JUDGED · 1V1 · RANKED
              </span>
            </div>

            <h1 className="mt-6 font-display text-[38px] font-black leading-[1.02] tracking-tight text-white sm:text-[46px]">
              Fitness is now
              <br />a competitive sport.
            </h1>
            <p className="mt-5 max-w-[38ch] text-[14.5px] font-medium leading-relaxed text-white/60">
              Go head-to-head with someone live. Your phone&rsquo;s camera watches both of you and
              counts only the reps that were actually clean — then the win moves you up a global
              ranked ladder. No self-reported scores. No honor system.
            </p>

            {/* 9:16 gameplay slot — empty until a real clip lands */}
            <div className="relative mt-9 flex aspect-[9/16] w-[80%] max-w-[290px] flex-col items-center justify-center gap-3 overflow-hidden rounded-[28px] border border-lime/[.14] bg-gradient-to-b from-surface-warm via-[#0b0f09] to-[#080b06] shadow-[0_50px_110px_-35px_rgba(0,0,0,0.9),0_0_60px_-25px_rgba(204,255,0,.35),inset_0_1px_0_rgba(204,255,0,.08)]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse 100% 55% at 50% 6%, rgba(200,255,0,.16), transparent 62%)",
                }}
              />
              <div
                aria-hidden
                className="relative flex h-14 w-14 items-center justify-center rounded-full border border-lime/25 bg-lime/[.07]"
              >
                <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-lime">
                  <path d="M6 4l14 8-14 8z" />
                </svg>
              </div>
              <span className="relative text-[11px] font-semibold tracking-wide text-white/35">
                Gameplay clip coming soon
              </span>
            </div>
          </div>
        </section>

        {/* ───────────── what VYRO is ───────────── */}
        <section className="band-raised px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-[560px]">
            <h2 className="font-display text-[27px] font-black leading-tight tracking-tight text-white">
              This isn&rsquo;t a workout app.
            </h2>
            <p className="mt-3 text-[14px] font-medium leading-relaxed text-white/55">
              It&rsquo;s a ranked sport, and your phone is the referee.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <Card>
                <CardTitle>The AI judges every rep</CardTitle>
                <CardBody>
                  Prop your phone up and go. Pose tracking watches your form in real time — full range
                  or it doesn&rsquo;t count. Nobody types in a score. There is nothing to lie about.
                </CardBody>
              </Card>
              <Card>
                <CardTitle>A ladder that means something</CardTitle>
                <CardBody>
                  Every battle moves your RP. Climb from Bronze to Master, check where you sit on the
                  global board or just among your friends, then defend it when the season resets.
                </CardBody>
              </Card>
              <Card>
                <CardTitle>Call somebody out</CardTitle>
                <CardBody>
                  Challenge a friend directly or get matched with a stranger who thinks they&rsquo;re
                  better. Share the result either way. Winner takes the RP, loser gets to explain.
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        {/* ───────────── launch week challenge (centerpiece) ───────────── */}
        <section className="relative px-5 py-20 sm:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[130%] max-w-[900px] -translate-x-1/2 -translate-y-1/2 blur-3xl"
            style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(200,255,0,.22), transparent 68%)" }}
          />
          <div className="relative mx-auto max-w-[560px]">
            <div className="overflow-hidden rounded-[32px] border border-lime/30 bg-gradient-to-b from-[#1a2010] via-surface-warm to-[#0b0f08] p-8 shadow-[0_40px_90px_-30px_rgba(0,0,0,.9),0_0_80px_-30px_rgba(204,255,0,.55),inset_0_1px_0_rgba(204,255,0,.16)] sm:p-10">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/40 bg-lime/10 px-3 py-1 font-display text-[9.5px] font-extrabold tracking-[.14em] text-lime">
                  <span className="h-[5px] w-[5px] animate-pulseDot rounded-full bg-lime" />
                  COMING SOON
                </span>
                <StopwatchIcon />
              </div>

              <h2 className="mt-6 font-display text-[24px] font-black leading-[1.1] tracking-tight text-white">
                Launch Week Challenge
              </h2>

              {/* prize figure — the one loud element on the page */}
              <div className="mt-5 flex items-end gap-3">
                <span className="font-display text-[68px] font-black leading-[.85] tracking-tighter text-lime [text-shadow:0_0_40px_rgba(204,255,0,.55),0_0_90px_rgba(204,255,0,.25)] sm:text-[80px]">
                  $500
                </span>
                <span className="pb-2 font-display text-[12px] font-extrabold uppercase leading-tight tracking-[.12em] text-lime-text/70">
                  cash
                  <br />
                  prize
                </span>
              </div>

              <div className="mt-7 h-px bg-gradient-to-r from-transparent via-lime/25 to-transparent" />

              {/* terms split into distinct rows rather than one dense paragraph */}
              <dl className="mt-6 flex flex-col gap-5">
                <TermRow icon={<ClockIcon />} label="The rule">
                  60 seconds. Most valid push-ups wins.
                </TermRow>
                <TermRow icon={<ShieldIcon />} label="Verified">
                  Judged by the same AI that referees your battles. Half reps get thrown out, and
                  scores can&rsquo;t be typed in.
                </TermRow>
                <TermRow icon={<TicketIcon />} label="To enter">
                  Runs all launch week, inside the app. You have to be on the list to be in the app.
                </TermRow>
              </dl>

              <button
                type="button"
                onClick={scrollToWaitlist}
                className="mt-8 w-full rounded-full bg-gradient-to-br from-lime-bright via-lime to-lime-deep py-[18px] font-display text-[15px] font-black tracking-tight text-lime-ink shadow-[0_0_0_1px_rgba(204,255,0,.45),0_18px_46px_-12px_rgba(204,255,0,.7),0_0_70px_-10px_rgba(204,255,0,.55),inset_0_1px_0_rgba(255,255,255,.5)] transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[.98]"
              >
                Claim your spot before launch week
              </button>
            </div>
          </div>
        </section>

        {/* ───────────── how it works ───────────── */}
        <section className="band-raised px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-[560px]">
            <h2 className="font-display text-[27px] font-black leading-tight tracking-tight text-white">
              How it works.
            </h2>
            <ol className="mt-7">
              <Step n={1}>Pick your exercise — push-ups or squats.</Step>
              <Step n={2}>Get matched, or call out a friend.</Step>
              <Step n={3}>Prop your phone up. The AI counts only clean reps.</Step>
              <Step n={4} last>
                Take the RP and climb the ladder.
              </Step>
            </ol>
          </div>
        </section>

        {/* ───────────── waitlist ───────────── */}
        <section ref={waitlistRef} className="scroll-mt-10 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-[560px]">
            <div className="rounded-[28px] border border-lime/[.16] bg-gradient-to-b from-surface-warm to-[#0b0f09] p-7 shadow-[0_30px_70px_-30px_rgba(0,0,0,.85),0_0_60px_-30px_rgba(204,255,0,.4),inset_0_1px_0_rgba(204,255,0,.10)] sm:p-8">
              <div className="font-display text-[10.5px] font-extrabold tracking-[.14em] text-lime">
                JOIN THE WAITLIST
              </div>
              <h2 className="mt-3 font-display text-[25px] font-black leading-tight tracking-tight text-white">
                Get in before the ladder fills up.
              </h2>
              <p className="mt-3 text-[13.5px] leading-relaxed text-white/55">
                Leave your email and we&rsquo;ll tell you the moment VYRO opens up — in time for
                launch week.
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
                    className="w-full rounded-2xl border border-lime/[.18] bg-[#080b06]/80 px-4 py-4 text-[14.5px] font-medium text-white placeholder:text-white/30 focus:border-lime focus:bg-lime/[.06] focus:outline-none"
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
            </div>

            {/* invite code — secondary path, deliberately outside and below the card */}
            <div className="mt-6 text-center">
              {unlocked ? (
                <div className="inline-flex items-center gap-2.5 rounded-full border border-lime/35 bg-lime/[.08] px-5 py-3">
                  <CheckIcon />
                  <span className="font-display text-[12.5px] font-bold text-lime">
                    Creator pass unlocked. You&rsquo;re skipping the line.
                  </span>
                </div>
              ) : creatorState === "granted" ? (
                <div className="inline-flex items-center gap-2.5 rounded-full border border-lime/35 bg-lime/[.08] px-5 py-3">
                  <CheckIcon />
                  <span className="font-display text-[12.5px] font-bold text-lime">
                    Access granted! Creator pass unlocked. Redirecting to app…
                  </span>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setShowInvite((v) => !v)}
                    className="text-[11.5px] font-semibold text-white/35 underline decoration-white/15 underline-offset-4 transition-colors hover:text-lime-text hover:decoration-lime/40"
                  >
                    {showInvite ? "Hide invite code" : "Creator or influencer with an invite code?"}
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-[400ms] ease-out ${
                      showInvite ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <form onSubmit={handleCreatorSubmit} className="mx-auto flex max-w-[380px] gap-2">
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
                          className="min-w-0 flex-1 rounded-xl border border-lime/[.16] bg-[#080b06]/80 px-3.5 py-3 text-[13px] font-bold uppercase tracking-wider text-white placeholder:text-white/30 placeholder:normal-case placeholder:tracking-normal focus:border-lime focus:bg-lime/[.06] focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={creatorState === "checking"}
                          className="flex-shrink-0 rounded-xl border border-lime/25 bg-lime/[.10] px-4 py-3 font-display text-[12.5px] font-extrabold text-lime-text transition-colors hover:bg-lime hover:text-lime-ink disabled:opacity-60"
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

            <p className="mt-14 text-center text-[11px] font-semibold text-white/25">
              VYRO — fitness is now a competitive sport.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ───────────── building blocks ───────────── */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-lime/[.12] bg-gradient-to-b from-white/[.035] to-transparent p-6 shadow-[inset_0_1px_0_rgba(204,255,0,.07)]">
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-[16px] font-extrabold tracking-tight text-white">{children}</h3>;
}

function CardBody({ children }: { children: React.ReactNode }) {
  return <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/55">{children}</p>;
}

function TermRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3.5">
      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-lime/25 bg-lime/[.08]">
        {icon}
      </div>
      <div className="min-w-0">
        <dt className="font-display text-[10px] font-extrabold uppercase tracking-[.14em] text-lime-text/75">
          {label}
        </dt>
        <dd className="mt-1 text-[13.5px] font-medium leading-relaxed text-white/70">{children}</dd>
      </div>
    </div>
  );
}

function Step({ n, children, last }: { n: number; children: React.ReactNode; last?: boolean }) {
  return (
    <li className="flex gap-4">
      {/* rail: the number plus the connector running down to the next step */}
      <div className="flex flex-col items-center">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-lime/35 bg-lime/[.10] font-display text-[13px] font-extrabold text-lime shadow-[0_0_20px_-6px_rgba(204,255,0,.6)]">
          {n}
        </span>
        {!last && <span aria-hidden className="my-1 w-px flex-1 bg-gradient-to-b from-lime/35 to-lime/[.06]" />}
      </div>
      <p className={`pt-2 text-[14px] font-medium leading-snug text-white/70 ${last ? "" : "pb-6"}`}>{children}</p>
    </li>
  );
}

/* ───────────── icons ───────────── */

function StopwatchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-10 w-10 stroke-lime/70" fill="none" strokeWidth="1.6">
      <path d="M9.5 2h5" strokeLinecap="round" />
      <path d="M12 5v2" strokeLinecap="round" />
      <circle cx="12" cy="14" r="7.5" />
      <path d="M12 14V10.5" strokeLinecap="round" />
      <path d="M12 14l2.6 2.2" strokeLinecap="round" />
      <path d="M18.6 7.6l1.3-1.3" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 stroke-lime" fill="none" strokeWidth="2">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 stroke-lime" fill="none" strokeWidth="2">
      <path d="M12 3l7 3v5.5c0 4.2-2.9 7.7-7 9-4.1-1.3-7-4.8-7-9V6z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 stroke-lime" fill="none" strokeWidth="2">
      <path d="M4 8a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 000-4z" />
      <path d="M14 6v12" strokeDasharray="2 2.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 flex-shrink-0 stroke-lime" fill="none" strokeWidth="2.4">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
