import LoginForm from "./LoginForm";

export const metadata = { title: "ადმინისტრატორი", robots: { index: false } };

export default function LoginPage() {
  return (
    <div className="login">
      <div className="admin-card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.svg" alt="" width={40} height={40} style={{ background: "var(--ink)", borderRadius: 8 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>მერცხალი</div>
            <div className="muted" style={{ fontSize: 13 }}>ადმინ პანელი</div>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
