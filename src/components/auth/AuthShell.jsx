import MotionReveal from "../ui/MotionReveal";

export default function AuthShell({
  title,
  subtitle,
  tag,
  sideTitle,
  sideText,
  children,
}) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-100 py-10 sm:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-40px] top-16 h-40 w-40 rounded-full bg-primary/15 blur-2xl" />
        <div className="absolute right-[-30px] top-40 h-36 w-36 rounded-full bg-accent/20 blur-2xl" />
        <div className="absolute bottom-10 left-1/3 h-28 w-28 rounded-full bg-primary-light/20 blur-2xl" />
      </div>

      <div className="content-container relative z-10">
        <div className="grid items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <MotionReveal y={18}>
            <section className="rounded-card border border-primary/10 bg-white/85 p-6 shadow-soft backdrop-blur sm:p-8">
              <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-small font-semibold text-primary">
                {tag}
              </p>
              <h2 className="mt-4">{title}</h2>
              <p className="section-subtitle">{subtitle}</p>
              <div className="mt-6">{children}</div>
            </section>
          </MotionReveal>

          <MotionReveal delay={100} y={18}>
            <aside className="shine rounded-card border border-primary/10 bg-gradient-to-br from-primary to-primary-light p-6 text-white shadow-soft sm:p-8">
              <h3 className="text-white">{sideTitle}</h3>
              <p className="mt-3 text-small text-slate-100">{sideText}</p>
              <div className="mt-8 space-y-3">
                <div className="rounded-card border border-white/20 bg-white/10 p-3">
                  <p className="text-small font-semibold text-white">
                    Secure Authentication
                  </p>
                  <p className="mt-1 text-small text-slate-100">
                    Powered by Firebase Auth with persistent sessions.
                  </p>
                </div>
                <div className="rounded-card border border-white/20 bg-white/10 p-3">
                  <p className="text-small font-semibold text-white">
                    Role-aware Routing
                  </p>
                  <p className="mt-1 text-small text-slate-100">
                    Automatic redirect for student, mentor, and admin roles.
                  </p>
                </div>
                <div className="rounded-card border border-white/20 bg-white/10 p-3">
                  <p className="text-small font-semibold text-white">
                    Professional UX
                  </p>
                  <p className="mt-1 text-small text-slate-100">
                    Instant validation, animated transitions, and clear error
                    messages.
                  </p>
                </div>
              </div>
            </aside>
          </MotionReveal>
        </div>
      </div>
    </div>
  );
}
