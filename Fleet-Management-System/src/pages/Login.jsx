import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ThreeBackground from "../components/login/ThreeBackground";

const C = "#4f46e5";

function LogoMark({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <rect width="72" height="72" rx="20" fill={C} />
      <rect x="14" y="19" width="44" height="8" rx="4" fill="white" opacity="0.9" />
      <rect x="30" y="19" width="12" height="24" rx="4" fill="white" opacity="0.9" />
      <path d="M18 48 L36 55 L54 48" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" fill="none" />
    </svg>
  );
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0 1 12 4.9c1.8 0 3.42.66 4.68 1.74l3.49-3.49A11.8 11.8 0 0 0 12 .9C8.45.9 5.34 2.93 3.67 5.9l1.6 3.86z" />
    <path fill="#34A853" d="M16.04 18.01A7.07 7.07 0 0 1 12 19.1c-3.07 0-5.69-1.96-6.7-4.72l-3.63 2.8C3.48 21.12 7.43 23.1 12 23.1c2.97 0 5.79-1.07 7.91-2.99l-3.87-2.1z" />
    <path fill="#4285F4" d="M19.91 20.11C22.04 18.05 23.1 14.97 23.1 12c0-.77-.1-1.56-.27-2.32H12v4.64h6.25c-.28 1.46-1.06 2.7-2.21 3.59l3.87 2.2z" />
    <path fill="#FBBC05" d="M5.3 14.38A7.16 7.16 0 0 1 4.9 12c0-.84.14-1.65.37-2.41L3.67 5.9A11.85 11.85 0 0 0 .9 12c0 1.92.46 3.73 1.26 5.35l3.14-2.97z" />
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-2.05c-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 2.87-.39c.97 0 1.95.13 2.87.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.26 5.66.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.79.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z" />
  </svg>
);

const EyeIcon = ({ open }) => open
  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>;

function nameFromEmail(email) {
  if (!email) return "You";
  const local = email.split("@")[0];
  return local
    .replace(/[._-]/g, " ")
    .replace(/\d+/g, "")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") || email.split("@")[0];
}

function avatarColor(email) {
  const colors = ["#4285f4", "#34a853", "#ea4335", "#fbbc04", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"];
  let h = 0;
  for (let i = 0; i < email.length; i++) h = (h * 31 + email.charCodeAt(i)) & 0xffffffff;
  return colors[Math.abs(h) % colors.length];
}

function OAuthPopup({ provider, initialEmail, onComplete, onClose }) {
  const [step, setStep] = useState("account");
  const [progress, setProgress] = useState(0);
  const [activeEmail, setActiveEmail] = useState(initialEmail || "");
  const [switchEmail, setSwitchEmail] = useState("");
  const [switchError, setSwitchError] = useState("");

  const isGoogle = provider === "google";

  const cfg = isGoogle
    ? { name: "Google", bg: "#fff", textColor: "#202124", subColor: "#5f6368", borderColor: "#dadce0", accentBtn: "#1a73e8", accentHover: "#1765cc", progressBg: "#e8eaed" }
    : { name: "GitHub", bg: "#0d1117", textColor: "#f0f6fc", subColor: "#8b949e", borderColor: "#30363d", accentBtn: "#238636", accentHover: "#1a6e2e", progressBg: "#21262d" };

  const displayName = nameFromEmail(activeEmail);
  const avatarBg = activeEmail ? avatarColor(activeEmail) : "#4285f4";
  const initial = displayName.charAt(0).toUpperCase();

  const GoogleLogo = () => (
    <svg width="36" height="36" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );

  const GithubLogo = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill={cfg.textColor}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-2.05c-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 2.87-.39c.97 0 1.95.13 2.87.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.26 5.66.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.79.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z" />
    </svg>
  );

  useEffect(() => {
    if (step !== "authorizing") return;
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 14 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setTimeout(() => onComplete(activeEmail), 500);
      }
      setProgress(Math.min(p, 100));
    }, 100);
    return () => clearInterval(iv);
  }, [step, activeEmail]);

  const handleSwitchSubmit = (e) => {
    e.preventDefault();
    if (!switchEmail.includes("@")) { setSwitchError("Enter a valid email address."); return; }
    setActiveEmail(switchEmail.trim());
    setSwitchError("");
    setSwitchEmail("");
    setStep("account");
  };

  const inp = {
    width: "100%", padding: "10px 13px",
    background: isGoogle ? "#fff" : "#010409",
    border: `1px solid ${cfg.borderColor}`,
    borderRadius: 6, color: cfg.textColor,
    fontSize: "0.9rem", fontFamily: "inherit",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <style>{`
        @keyframes popupIn { from { opacity:0; transform:scale(.92) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes bounce { 0%,80%,100% { transform:scale(0) } 40% { transform:scale(1) } }
        .oauth-account-row:hover { background: ${isGoogle ? "#f8f9fa" : "#161b22"} !important; }
        .oauth-switch-link:hover { text-decoration: underline; }
      `}</style>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 400, borderRadius: 14, overflow: "hidden",
          background: cfg.bg,
          border: `1px solid ${cfg.borderColor}`,
          boxShadow: isGoogle
            ? "0 2px 10px rgba(0,0,0,0.12), 0 8px 40px rgba(0,0,0,0.15)"
            : "0 16px 60px rgba(0,0,0,0.6)",
          fontFamily: isGoogle
            ? "'Google Sans','Roboto',Arial,sans-serif"
            : "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif",
          animation: "popupIn .2s ease",
        }}
      >

        {step === "account" && (
          <div style={{ padding: "36px 40px 24px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              {isGoogle ? <GoogleLogo /> : <GithubLogo />}
            </div>

            <div style={{ textAlign: "center", marginBottom: 6 }}>
              <div style={{ fontSize: "1.4rem", fontWeight: isGoogle ? 400 : 700, color: cfg.textColor, marginBottom: 8 }}>
                Sign in with {cfg.name}
              </div>
              <div style={{ fontSize: "0.84rem", color: cfg.subColor }}>
                to continue to <strong style={{ color: cfg.textColor }}>Transvora Fleet</strong>
              </div>
            </div>

            <div style={{ marginTop: 24, marginBottom: 14 }}>
              {activeEmail ? (
                <div
                  className="oauth-account-row"
                  onClick={() => setStep("authorizing")}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "12px 14px", borderRadius: 8,
                    border: `1px solid ${isGoogle ? "#dadce0" : "#30363d"}`,
                    cursor: "pointer", transition: "background .14s",
                    marginBottom: 12,
                    background: isGoogle ? "#fff" : "#161b22",
                  }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: avatarBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 700, fontSize: "1.1rem",
                    flexShrink: 0,
                  }}>
                    {initial}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: cfg.textColor, fontSize: "0.9rem" }}>{displayName}</div>
                    <div style={{ fontSize: "0.78rem", color: cfg.subColor, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeEmail}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cfg.subColor} strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                </div>
              ) : (
                <div style={{ padding: "10px 14px", background: isGoogle ? "#f8f9fa" : "#161b22", borderRadius: 8, marginBottom: 12, fontSize: "0.84rem", color: cfg.subColor, textAlign: "center" }}>
                  No account connected. Click below to add one.
                </div>
              )}

              <button
                onClick={() => setStep("authorizing")}
                disabled={!activeEmail}
                style={{
                  width: "100%", padding: "11px",
                  background: activeEmail ? cfg.accentBtn : (isGoogle ? "#94a3b8" : "#21262d"),
                  border: "none", borderRadius: 6,
                  color: "#fff", fontWeight: 600, fontSize: "0.9rem",
                  fontFamily: "inherit", cursor: activeEmail ? "pointer" : "not-allowed",
                  transition: "background .15s", marginBottom: 12,
                }}
                onMouseEnter={e => { if (activeEmail) e.currentTarget.style.background = cfg.accentHover; }}
                onMouseLeave={e => { e.currentTarget.style.background = activeEmail ? cfg.accentBtn : (isGoogle ? "#94a3b8" : "#21262d"); }}
              >
                {activeEmail ? `Continue as ${displayName}` : "Select an account to continue"}
              </button>

              <div style={{ textAlign: "center" }}>
                <span
                  className="oauth-switch-link"
                  onClick={() => { setStep("switch"); setSwitchEmail(""); setSwitchError(""); }}
                  style={{ fontSize: "0.82rem", color: isGoogle ? "#1a73e8" : "#388bfd", cursor: "pointer" }}
                >
                  Use a different account
                </span>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${cfg.borderColor}`, marginTop: 16, paddingTop: 14, display: "flex", justifyContent: "center", gap: 20 }}>
              {["Privacy Policy", "Terms of Service"].map(t => (
                <span key={t} style={{ fontSize: "0.72rem", color: cfg.subColor, cursor: "pointer" }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {step === "switch" && (
          <div style={{ padding: "32px 40px" }}>
            <button onClick={() => setStep("account")} style={{ background: "none", border: "none", cursor: "pointer", color: cfg.subColor, display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", fontFamily: "inherit", marginBottom: 20, padding: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
              Back
            </button>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
              {isGoogle ? <GoogleLogo /> : <GithubLogo />}
            </div>

            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: "1.2rem", fontWeight: isGoogle ? 400 : 700, color: cfg.textColor, marginBottom: 6 }}>
                {isGoogle ? "Sign in" : "Sign in to GitHub"}
              </div>
              {isGoogle && <div style={{ fontSize: "0.84rem", color: cfg.subColor }}>Use your Google Account</div>}
            </div>

            <form onSubmit={handleSwitchSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <input
                  type="email"
                  placeholder={isGoogle ? "Email or phone" : "Username or email address"}
                  value={switchEmail}
                  onChange={e => { setSwitchEmail(e.target.value); setSwitchError(""); }}
                  style={inp}
                  autoFocus
                  onFocus={e => e.target.style.border = `2px solid ${isGoogle ? "#1a73e8" : "#388bfd"}`}
                  onBlur={e => e.target.style.border = `1px solid ${cfg.borderColor}`}
                />
                {switchError && <div style={{ fontSize: "0.76rem", color: "#ef4444", marginTop: 4 }}>{switchError}</div>}
              </div>

              {!isGoogle && (
                <input
                  type="password"
                  placeholder="Password"
                  style={inp}
                  onFocus={e => e.target.style.border = "2px solid #388bfd"}
                  onBlur={e => e.target.style.border = `1px solid ${cfg.borderColor}`}
                />
              )}

              {isGoogle && (
                <div style={{ fontSize: "0.8rem", color: "#1a73e8", cursor: "pointer" }}>Forgot email?</div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                {isGoogle ? (
                  <span style={{ fontSize: "0.82rem", color: "#1a73e8", cursor: "pointer" }}>Create account</span>
                ) : (
                  <span style={{ fontSize: "0.82rem", color: "#388bfd", cursor: "pointer" }}>Create an account</span>
                )}
                <button type="submit" style={{
                  padding: "9px 22px", borderRadius: 6, border: "none",
                  background: cfg.accentBtn, color: "#fff",
                  fontWeight: 600, fontSize: "0.88rem", fontFamily: "inherit",
                  cursor: "pointer",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = cfg.accentHover}
                  onMouseLeave={e => e.currentTarget.style.background = cfg.accentBtn}
                >
                  Next
                </button>
              </div>
            </form>

            <div style={{ borderTop: `1px solid ${cfg.borderColor}`, marginTop: 20, paddingTop: 14, display: "flex", justifyContent: "center", gap: 20 }}>
              {["Privacy Policy", "Terms of Service"].map(t => (
                <span key={t} style={{ fontSize: "0.72rem", color: cfg.subColor, cursor: "pointer" }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {step === "authorizing" && (
          <div style={{ padding: "48px 40px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              {isGoogle ? <GoogleLogo /> : <GithubLogo />}
            </div>
            <div style={{ fontSize: "0.95rem", color: cfg.textColor, marginBottom: 6 }}>
              Signing in as <strong>{displayName}</strong>
            </div>
            <div style={{ fontSize: "0.8rem", color: cfg.subColor, marginBottom: 20 }}>{activeEmail}</div>
            <div style={{ height: 3, background: cfg.progressBg, borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${progress}%`,
                background: cfg.accentBtn,
                borderRadius: 99, transition: "width .09s linear",
              }} />
            </div>
            <div style={{ marginTop: 12, fontSize: "0.76rem", color: cfg.subColor }}>
              {progress < 35 ? "Verifying identity…" : progress < 70 ? "Authorizing permissions…" : "Completing sign-in…"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [oauthProvider, setOauthProvider] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, socialLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.removeItem("fleet_remembered_email");
    } catch { }
  }, []);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoginError("");
    if (!email) { setLoginError("Please enter your email address."); return; }
    setIsLoading(true);
    try {
      if (remember) localStorage.setItem("fleet_remembered_email", email);
      else localStorage.removeItem("fleet_remembered_email");
      await login(email, password || "password123");
      navigate("/dashboard");
    } catch {
      setLoginError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialComplete = async (resolvedEmail) => {
    await socialLogin(oauthProvider, resolvedEmail);
    setOauthProvider(null);
    navigate("/dashboard");
  };

  const inp = {
    width: "100%", padding: "11px 14px",
    background: "var(--bg-secondary)", border: "1px solid var(--border)",
    borderRadius: 9, color: "var(--text-primary)", fontSize: "0.88rem",
    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
    transition: "border-color .15s",
  };


  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter',sans-serif", background: "var(--bg-primary)" }}>

      {oauthProvider && (
        <OAuthPopup
          provider={oauthProvider}
          initialEmail={email}
          onComplete={handleSocialComplete}
          onClose={() => setOauthProvider(null)}
        />
      )}

      <div className="login-left-panel" style={{
        flex: "0 0 46%", position: "relative",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 52px", overflow: "hidden",
        background: "var(--bg-secondary)", borderRight: "1px solid var(--border)",
      }}>

        <ThreeBackground />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, var(--bg-primary)cc 60%, transparent)", pointerEvents: "none", zIndex: 1 }} />


        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 44 }}>
            <LogoMark size={50} />
            <div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>Transvora</div>
              <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Fleet Intelligence Platform</div>
            </div>

          </div>

          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "2.5rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.15, marginBottom: 14, letterSpacing: "-0.04em" }}>
            Drive smarter,<br />
            <span style={{ color: C }}>fleet further.</span>
          </h2>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.93rem", lineHeight: 1.7, marginBottom: 36, maxWidth: 370 }}>
            A single pane of glass to track vehicles, manage drivers, and optimise every route — in real time.
          </p>


          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[
              "Real-time GPS fleet tracking",
              "Driver management & compliance",
              "Maintenance scheduling & alerts",
              "Revenue & performance analytics",
            ].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: C, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <span style={{ fontSize: "0.86rem", color: "var(--text-muted)" }}>{f}</span>

              </div>
            ))}

          </div>
        </div>
      </div>

      <div className="login-right-panel" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px", background: "var(--bg-primary)" }}>
        <div style={{ width: "100%", maxWidth: 390 }}>
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "1.65rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 6 }}>Welcome back</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.86rem" }}>Sign in to your Transvora account.</p>
          </div>


          <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 22 }}>
            {[
              { icon: <GoogleIcon />, label: "Continue with Google", provider: "google" },
              { icon: <GithubIcon />, label: "Continue with GitHub", provider: "github", dark: true },
            ].map(b => (
              <button
                key={b.label}
                onClick={() => setOauthProvider(b.provider)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "11px", width: "100%",
                  background: b.dark ? "#18181c" : "#131316",
                  border: "1px solid #25252d",
                  borderRadius: 10, color: "#888",
                  fontSize: "0.86rem", fontWeight: 500, fontFamily: "inherit",
                  cursor: "pointer", transition: "all .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-card-hover)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "var(--bg-secondary)"; }}
              >

                {b.icon}{b.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>or email</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>


          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</label>
              <input
                type="email" placeholder="example@gmail.com"
                value={email} onChange={e => setEmail(e.target.value)}
                style={inp}
                onFocus={e => e.target.style.borderColor = `${C}60`}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#444", textTransform: "uppercase", letterSpacing: "0.06em" }}>Password</label>
                <span style={{ fontSize: "0.75rem", color: C, cursor: "pointer" }}>Forgot?</span>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ ...inp, paddingRight: 40 }}
                  onFocus={e => e.target.style.borderColor = `${C}60`}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />

                <button type="button" onClick={() => setShowPwd(p => !p)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#444", cursor: "pointer", padding: 2,
                }}>
                  <EyeIcon open={showPwd} />
                </button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                type="button"
                onClick={() => setRemember(r => !r)}
                style={{
                  width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${remember ? C : "#333"}`,
                  background: remember ? C : "transparent", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all .15s",
                }}
              >
                {remember && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </button>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Remember me for 7 days</span>
            </div>


            {loginError && (
              <div style={{ padding: "9px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, fontSize: "0.8rem", color: "#ef4444" }}>
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "12px", width: "100%", marginTop: 4,
                background: isLoading ? "#2d2d3a" : C,
                border: "none", borderRadius: 9,
                color: isLoading ? "#555" : "#fff",
                fontSize: "0.9rem", fontWeight: 700,
                fontFamily: "'Space Grotesk',sans-serif",
                cursor: isLoading ? "not-allowed" : "pointer",
                boxShadow: isLoading ? "none" : `0 4px 16px ${C}40`,
                transition: "all .18s",
              }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = "#6366f1"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={e => { if (!isLoading) { e.currentTarget.style.background = C; e.currentTarget.style.transform = "none"; } }}
            >
              {isLoading ? "Signing in…" : "Sign In to Transvora →"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.76rem", color: "#333", marginTop: 20 }}>
            Don't have an account?{" "}
            <span style={{ color: C, cursor: "pointer", fontWeight: 600 }}>Request access</span>
          </p>

          <div style={{ marginTop: 24, padding: "9px 13px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 9, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Enterprise-grade security · SOC 2 Type II · TLS 1.3</span>
          </div>

        </div>
      </div>
    </div>
  );
}