import { useState } from "react";
 
// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  primary:      "#2563eb",
  primaryDark:  "#1e3a8a",
  primaryMid:   "#3b82f6",
  primaryLight: "#eff6ff",
  accent:       "#f59e0b",
  bg:           "#f8fafc",
  white:        "#ffffff",
  text:         "#0f172a",
  muted:        "#64748b",
  light:        "#94a3b8",
  border:       "#e2e8f0",
  success:      "#16a34a",
  danger:       "#dc2626",
};
 
const F = { body: "'Inter','Segoe UI',sans-serif" };
 
// ─── DATA ─────────────────────────────────────────────────────────────────────
const TUTORS = [
  {
    id: 1, nombre: "Ing. Armando Molina", materia: "Backend & Cloud",
    nivel: "Universidad", precio: 25000, rating: 4.9, sesiones: 42,
    disponible: true, badge: "Top Tutor", avatar: "AM", color: "#185FA5",
    bio: "Ing. de Sistemas. APIs REST con FastAPI, despliegue en AWS, NoSQL (DynamoDB).",
    modalidades: ["Virtual"], tags: ["FastAPI", "AWS", "DynamoDB", "Python"],
  },
  {
    id: 2, nombre: "Doc. Camila Lugo", materia: "Data Analytics",
    nivel: "Universidad", precio: 22000, rating: 5.0, sesiones: 19,
    disponible: true, badge: "Demanda", avatar: "CL", color: "#0f766e",
    bio: "Doctora en Ciencias de Datos. Pandas, Matplotlib y SQL avanzado.",
    modalidades: ["Virtual", "Presencial"], tags: ["Pandas", "Matplotlib", "SQL", "Python"],
  },
  {
    id: 3, nombre: "Prof. Yeinner Ortega", materia: "Cybersecurity & Networking",
    nivel: "Universidad", precio: 28000, rating: 4.8, sesiones: 31,
    disponible: false, badge: null, avatar: "YO", color: "#7c3aed",
    bio: "Especialista en seguridad perimetral, VLAN, IDS y arquitecturas de red.",
    modalidades: ["Virtual", "Presencial"], tags: ["VLAN", "Firewall", "IDS", "Redes"],
  },
  {
    id: 4, nombre: "Prof. Luis Ramírez", materia: "Cálculo & Álgebra",
    nivel: "Bachillerato / Universidad", precio: 20000, rating: 4.7, sesiones: 58,
    disponible: true, badge: null, avatar: "LR", color: "#b45309",
    bio: "Lic. Matemáticas. Especialista en preparación ICFES y universitaria.",
    modalidades: ["Virtual", "Presencial"], tags: ["Cálculo", "Álgebra", "ICFES", "Estadística"],
  },
];
 
const RESERVAS = [
  { id: 1, tutor: "Ing. Armando Molina", materia: "Backend & Cloud", fecha: "Hoy, 4:00 PM",      estado: "confirmada", avatar: "AM", color: "#185FA5" },
  { id: 2, tutor: "Doc. Camila Lugo",    materia: "Data Analytics",  fecha: "Mañana, 10:00 AM",  estado: "pendiente",  avatar: "CL", color: "#0f766e" },
  { id: 3, tutor: "Prof. Yeinner Ortega",materia: "Cybersecurity",   fecha: "Vie 30/05, 2:00 PM",estado: "confirmada", avatar: "YO", color: "#7c3aed" },
];
 
// ─── SHARED PRIMITIVES ────────────────────────────────────────────────────────
const Avatar = ({ initials, color, size = 48 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%", flexShrink: 0,
    background: color + "22", border: `2px solid ${color}44`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: F.body, fontWeight: 700, fontSize: size * 0.32, color,
  }}>{initials}</div>
);
 
const Badge = ({ text, type = "blue" }) => {
  const styles = {
    blue:  { bg: "#dbeafe", color: "#1e3a8a" },
    amber: { bg: "#fef3c7", color: "#92400e" },
    green: { bg: "#dcfce7", color: "#166534" },
    red:   { bg: "#fee2e2", color: "#991b1b" },
  };
  const s = styles[type] || styles.blue;
  return (
    <span style={{
      background: s.bg, color: s.color, fontFamily: F.body,
      fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20,
    }}>{text}</span>
  );
};
 
const Tag = ({ text }) => (
  <span style={{
    background: C.bg, color: C.muted, fontFamily: F.body,
    fontSize: 11, padding: "3px 9px", borderRadius: 20,
    border: `1px solid ${C.border}`,
  }}>{text}</span>
);
 
const BtnPrimary = ({ children, onClick, disabled, style = {} }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: disabled ? C.border : C.primary, color: disabled ? C.muted : "#fff",
    border: "none", borderRadius: 12, padding: "14px", fontSize: 15,
    fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    width: "100%", fontFamily: F.body, ...style,
  }}>{children}</button>
);
 
const BtnOutline = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    background: "none", border: `1px solid ${C.border}`, borderRadius: 12,
    padding: "12px", fontSize: 14, color: C.muted, cursor: "pointer",
    width: "100%", fontFamily: F.body,
  }}>{children}</button>
);
 
const TopBar = ({ title, subtitle, back, onBack }) => (
  <div style={{
    background: C.white, borderBottom: `1px solid ${C.border}`,
    padding: "14px 20px 12px", display: "flex", alignItems: "center", gap: 12,
  }}>
    {back && (
      <button onClick={onBack} style={{
        background: C.bg, border: "none", borderRadius: 10,
        width: 34, height: 34, cursor: "pointer", fontSize: 17,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>←</button>
    )}
    <div style={{ flex: 1 }}>
      <h1 style={{ fontFamily: F.body, fontSize: 19, color: C.text, margin: 0, fontWeight: 700 }}>{title}</h1>
      {subtitle && <p style={{ fontFamily: F.body, fontSize: 13, color: C.muted, margin: "2px 0 0" }}>{subtitle}</p>}
    </div>
  </div>
);
 
const BottomNav = ({ screen, setScreen }) => {
  const tabs = [
    { id: "home",     icon: "🏠", label: "Inicio"  },
    { id: "search",   icon: "🔍", label: "Buscar"  },
    { id: "bookings", icon: "📅", label: "Reservas"},
    { id: "profile",  icon: "👤", label: "Perfil"  },
  ];
  return (
    <div style={{
      background: C.white, borderTop: `1px solid ${C.border}`,
      display: "flex", padding: "8px 0 12px",
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setScreen(t.id)} style={{
          flex: 1, background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 0",
        }}>
          <span style={{ fontSize: 18 }}>{t.icon}</span>
          <span style={{
            fontFamily: F.body, fontSize: 11,
            color: screen === t.id ? C.primary : C.light,
            fontWeight: screen === t.id ? 700 : 400,
          }}>{t.label}</span>
          {screen === t.id && (
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.primary }} />
          )}
        </button>
      ))}
    </div>
  );
};
 
// ─── SCREENS ──────────────────────────────────────────────────────────────────
 
function LoginScreen({ setScreen }) {
  const [role, setRole] = useState("Estudiante");
  const roles = [
    { id: "Estudiante", icon: "🎓" },
    { id: "Tutor",      icon: "👨‍🏫" },
    { id: "Admin",      icon: "⚙️"  },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>
      <div style={{
        background: `linear-gradient(135deg, ${C.primaryDark} 0%, ${C.primary} 100%)`,
        padding: "40px 24px 32px", textAlign: "center",
      }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🎓</div>
        <div style={{ fontFamily: F.body, fontSize: 22, fontWeight: 700, color: "#fff" }}>
          TutoresOn-Line
        </div>
        <div style={{ fontFamily: F.body, fontSize: 13, color: "#93c5fd", marginTop: 4 }}>
          Gestión Tecnológica & Aprendizaje
        </div>
      </div>
      <div style={{ padding: "24px 20px" }}>
        <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20 }}>
          <h2 style={{ fontFamily: F.body, fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>
            Iniciar Sesión
          </h2>
          <p style={{ fontFamily: F.body, fontSize: 13, color: C.muted, margin: "0 0 20px" }}>
            Introduce tus credenciales para acceder a la plataforma.
          </p>
          <p style={{ fontFamily: F.body, fontSize: 13, fontWeight: 600, color: C.text, margin: "0 0 10px" }}>
            Selecciona tu Rol
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {roles.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)} style={{
                flex: 1, background: role === r.id ? "#eff6ff" : C.bg,
                border: `1.5px solid ${role === r.id ? C.primary : C.border}`,
                borderRadius: 12, padding: "12px 8px", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                fontSize: 13, color: role === r.id ? C.primaryDark : C.text,
                fontWeight: role === r.id ? 600 : 400, fontFamily: F.body,
              }}>
                <span style={{ fontSize: 22 }}>{r.icon}</span>{r.id}
              </button>
            ))}
          </div>
          <label style={{ fontFamily: F.body, fontSize: 13, color: C.muted, display: "block", marginBottom: 6 }}>
            Correo Electrónico
          </label>
          <input
            defaultValue={role === "Tutor" ? "armandomolina030@gmail.com" : ""}
            placeholder="correo@ejemplo.com" type="email"
            style={{
              border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px",
              fontSize: 14, color: C.text, background: C.bg, width: "100%",
              outline: "none", fontFamily: F.body, marginBottom: 14, boxSizing: "border-box",
            }}
          />
          <label style={{ fontFamily: F.body, fontSize: 13, color: C.muted, display: "block", marginBottom: 6 }}>
            Contraseña
          </label>
          <input
            placeholder="••••••••••" type="password"
            style={{
              border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px",
              fontSize: 14, color: C.text, background: C.bg, width: "100%",
              outline: "none", fontFamily: F.body, marginBottom: 20, boxSizing: "border-box",
            }}
          />
          <BtnPrimary onClick={() => setScreen("home")}>Ingresar al Sistema</BtnPrimary>
          <p style={{ textAlign: "center", fontFamily: F.body, fontSize: 13, color: C.muted, marginTop: 14 }}>
            ¿No tienes una cuenta?{" "}
            <span
              onClick={() => setScreen("register")}
              style={{ color: C.primary, cursor: "pointer", fontWeight: 600 }}
            >Regístrate aquí</span>
          </p>
        </div>
      </div>
    </div>
  );
}
 
function RegisterScreen({ setScreen }) {
  const [role, setRole] = useState("Estudiante");
  const roles = [
    { id: "Estudiante", icon: "🎓" },
    { id: "Tutor",      icon: "👨‍🏫" },
    { id: "Admin",      icon: "⚙️"  },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>
      <div style={{
        background: `linear-gradient(135deg, ${C.primaryDark} 0%, ${C.primary} 100%)`,
        padding: "32px 24px 24px", textAlign: "center",
      }}>
        <div style={{ fontFamily: F.body, fontSize: 20, fontWeight: 700, color: "#fff" }}>TutoresOn-Line</div>
        <div style={{ fontFamily: F.body, fontSize: 12, color: "#93c5fd", marginTop: 3 }}>Crear una cuenta</div>
      </div>
      <div style={{ padding: "20px" }}>
        <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20 }}>
          <h2 style={{ fontFamily: F.body, fontSize: 17, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Crear Cuenta</h2>
          <p style={{ fontFamily: F.body, fontSize: 13, color: C.muted, margin: "0 0 18px" }}>
            Únete a nuestra comunidad y comienza a expandir tu conocimiento.
          </p>
          <p style={{ fontFamily: F.body, fontSize: 13, fontWeight: 600, color: C.text, margin: "0 0 10px" }}>Selecciona tu Rol</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {roles.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)} style={{
                flex: 1, background: role === r.id ? "#eff6ff" : C.bg,
                border: `1.5px solid ${role === r.id ? C.primary : C.border}`,
                borderRadius: 12, padding: "12px 8px", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                fontSize: 13, color: role === r.id ? C.primaryDark : C.text,
                fontWeight: role === r.id ? 600 : 400, fontFamily: F.body,
              }}>
                <span style={{ fontSize: 22 }}>{r.icon}</span>{r.id}
              </button>
            ))}
          </div>
          {[
            { label: "Nombre Completo",    type: "text",     ph: "John Doe" },
            { label: "Correo Electrónico", type: "email",    ph: "correo@ejemplo.com" },
            { label: "Contraseña",         type: "password", ph: "••••••••••" },
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontFamily: F.body, fontSize: 13, color: C.muted, display: "block", marginBottom: 6 }}>
                {f.label}
              </label>
              <input placeholder={f.ph} type={f.type} style={{
                border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px",
                fontSize: 14, color: C.text, background: C.bg, width: "100%",
                outline: "none", fontFamily: F.body, marginBottom: 14, boxSizing: "border-box",
              }} />
            </div>
          ))}
          <BtnPrimary onClick={() => setScreen("home")}>Registrarse</BtnPrimary>
          <p style={{ textAlign: "center", fontFamily: F.body, fontSize: 13, color: C.muted, marginTop: 14 }}>
            ¿Ya tienes cuenta?{" "}
            <span onClick={() => setScreen("login")} style={{ color: C.primary, cursor: "pointer", fontWeight: 600 }}>
              Inicia sesión aquí
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
 
function HomeScreen({ setScreen, setSelectedTutor }) {
  const available = TUTORS.filter(t => t.disponible);
  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${C.primaryDark} 0%, ${C.primary} 100%)`,
        padding: "28px 20px 32px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <p style={{ fontFamily: F.body, fontSize: 14, color: "rgba(255,255,255,0.75)", margin: "0 0 4px" }}>
          Buenos días, Santiago 👋
        </p>
        <h2 style={{ fontFamily: F.body, fontSize: 24, color: "#fff", fontWeight: 700, margin: "0 0 18px", lineHeight: 1.25 }}>
          Lleva tu rendimiento académico al{" "}
          <span style={{ color: "#93c5fd" }}>siguiente nivel</span>
        </h2>
        <div style={{
          background: C.white, borderRadius: 14,
          display: "flex", alignItems: "center", padding: "0 14px", gap: 10, height: 46,
        }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <input
            placeholder="¿Qué materia deseas aprender hoy?"
            onFocus={() => setScreen("search")}
            style={{ border: "none", outline: "none", flex: 1, fontFamily: F.body, fontSize: 13, color: C.text, background: "transparent" }}
          />
          <div
            onClick={() => setScreen("search")}
            style={{ background: C.primary, borderRadius: 10, padding: "6px 12px", cursor: "pointer" }}
          >
            <span style={{ fontFamily: F.body, fontSize: 12, color: "#fff", fontWeight: 600 }}>Buscar Tutor</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
          <span style={{ fontFamily: F.body, fontSize: 12, color: "rgba(255,255,255,0.85)" }}>✅ Tutores Verificados</span>
          <span style={{ fontFamily: F.body, fontSize: 12, color: "rgba(255,255,255,0.85)" }}>⭐ Clases 100% Calificadas</span>
        </div>
      </div>
 
      {/* Stats */}
      <div style={{ display: "flex", background: C.white, borderBottom: `1px solid ${C.border}` }}>
        {[{ v: "1,240+", l: "Tutores" }, { v: "98%", l: "Satisfacción" }, { v: "4.8★", l: "Promedio" }].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "12px 0", textAlign: "center", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ fontFamily: F.body, fontSize: 16, color: C.primary, fontWeight: 700 }}>{s.v}</div>
            <div style={{ fontFamily: F.body, fontSize: 11, color: C.muted, marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
 
      <div style={{ padding: "20px 20px 0" }}>
        {/* Demand CTA */}
        <div style={{
          background: `linear-gradient(120deg, #1e40af, ${C.primary})`,
          borderRadius: 16, padding: "16px 18px", marginBottom: 22,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <span style={{ fontSize: 34 }}>⚡</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F.body, fontSize: 15, color: "#fff", fontWeight: 700 }}>Tutoría Inmediata</div>
            <div style={{ fontFamily: F.body, fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>Tutores listos ahora mismo</div>
          </div>
          <button onClick={() => setScreen("demanda")} style={{
            background: C.white, border: "none", borderRadius: 10,
            padding: "8px 14px", cursor: "pointer",
            fontFamily: F.body, fontSize: 13, fontWeight: 700, color: C.primary,
          }}>Solicitar</button>
        </div>
 
        <h3 style={{ fontFamily: F.body, fontSize: 15, fontWeight: 700, color: C.text, margin: "0 0 12px" }}>
          Tutores disponibles ahora
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 24 }}>
          {available.map(t => (
            <div
              key={t.id}
              onClick={() => { setSelectedTutor(t); setScreen("tutor"); }}
              style={{
                background: C.white, borderRadius: 16, border: `1px solid ${C.border}`,
                padding: 14, cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start",
              }}
            >
              <div style={{ position: "relative" }}>
                <Avatar initials={t.avatar} color={t.color} size={50} />
                <div style={{ position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: "50%", background: C.success, border: "2px solid #fff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.text }}>{t.nombre}</div>
                    <div style={{ fontFamily: F.body, fontSize: 12, color: C.primary, fontWeight: 500, marginTop: 1 }}>{t.materia}</div>
                  </div>
                  {t.badge && <Badge text={t.badge} type={t.badge === "Top Tutor" ? "blue" : "amber"} />}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <span style={{ color: C.accent, fontSize: 12 }}>★★★★★ <span style={{ color: C.muted }}>{t.rating}</span></span>
                  <span style={{ fontFamily: F.body, fontSize: 14, fontWeight: 700, color: C.primary }}>
                    ${t.precio.toLocaleString("es-CO")}/h
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 
function SearchScreen({ setScreen, setSelectedTutor }) {
  const [query, setQuery] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const filtros = ["Todos", "Virtual", "Presencial", "Disponibles"];
  const filtered = TUTORS.filter(t => {
    const q = query.toLowerCase();
    const mQ = !q || t.nombre.toLowerCase().includes(q) || t.materia.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q));
    const mF = filtro === "Todos"
      || (filtro === "Virtual"      && t.modalidades.includes("Virtual"))
      || (filtro === "Presencial"   && t.modalidades.includes("Presencial"))
      || (filtro === "Disponibles"  && t.disponible);
    return mQ && mF;
  });
  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>
      <TopBar title="Buscar Tutores" />
      <div style={{ padding: "14px 16px", background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div style={{
          background: C.bg, borderRadius: 12, display: "flex", alignItems: "center",
          padding: "0 12px", gap: 10, height: 42, border: `1px solid ${C.border}`, marginBottom: 10,
        }}>
          <span>🔍</span>
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Materia, tutor, tema..."
            style={{ border: "none", outline: "none", flex: 1, fontFamily: F.body, fontSize: 14, background: "transparent", color: C.text }}
          />
          {query && <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 18 }}>✕</button>}
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
          {filtros.map(f => (
            <button key={f} onClick={() => setFiltro(f)} style={{
              background: filtro === f ? C.primary : C.bg,
              color: filtro === f ? "#fff" : C.muted,
              border: `1px solid ${filtro === f ? C.primary : C.border}`,
              borderRadius: 20, padding: "6px 14px", cursor: "pointer",
              fontFamily: F.body, fontSize: 12, fontWeight: filtro === f ? 600 : 400,
              whiteSpace: "nowrap", flexShrink: 0,
            }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ fontFamily: F.body, fontSize: 13, color: C.muted, margin: "0 0 4px" }}>
          {filtered.length} tutores encontrados
        </p>
        {filtered.map(t => (
          <div
            key={t.id}
            onClick={() => { setSelectedTutor(t); setScreen("tutor"); }}
            style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: 14, cursor: "pointer" }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ position: "relative" }}>
                <Avatar initials={t.avatar} color={t.color} size={52} />
                {t.disponible && (
                  <div style={{ position: "absolute", bottom: 1, right: 1, width: 13, height: 13, borderRadius: "50%", background: C.success, border: "2px solid #fff" }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.text }}>{t.nombre}</div>
                  {t.badge && <Badge text={t.badge} type={t.badge === "Top Tutor" ? "blue" : "amber"} />}
                </div>
                <div style={{ fontFamily: F.body, fontSize: 13, color: C.primary, fontWeight: 500 }}>{t.materia}</div>
                <div style={{ fontFamily: F.body, fontSize: 12, color: C.muted, marginTop: 2 }}>{t.nivel}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                  <span style={{ color: C.accent, fontSize: 12 }}>★★★★★ <span style={{ color: C.muted }}>{t.rating}</span></span>
                  <span style={{ fontFamily: F.body, fontSize: 14, fontWeight: 700, color: C.primary }}>${t.precio.toLocaleString("es-CO")}/h</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {t.tags.slice(0, 3).map(tag => <Tag key={tag} text={tag} />)}
              {t.modalidades.map(m => (
                <span key={m} style={{ background: "#eff6ff", color: C.primaryDark, fontFamily: F.body, fontSize: 11, padding: "3px 9px", borderRadius: 20, fontWeight: 600 }}>{m}</span>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontFamily: F.body, fontSize: 15, color: C.muted }}>No encontramos tutores<br />para esa búsqueda</div>
          </div>
        )}
      </div>
    </div>
  );
}
 
function TutorScreen({ tutor, setScreen }) {
  const [tab, setTab] = useState("info");
  const [reserved, setReserved] = useState(false);
  if (!tutor) return null;
  const reseñas = [
    { user: "Mariana P.", texto: "Excelente explicando, muy paciente y detallado.", stars: 5 },
    { user: "Diego R.",   texto: "Llegó puntual a la sesión virtual, muy claro.",   stars: 5 },
    { user: "Luisa T.",   texto: "Muy buena metodología para exámenes parciales.",  stars: 4 },
  ];
  const fases = [
    ["Fase 1: Introducción y Contextualización",    "Descarga de lecturas y análisis del problema base."],
    ["Fase 2: Arquitectura y Modelamiento",         "Diagramas de secuencia y flujos alternativos."],
    ["Fase 3: Implementación Práctica y Backend",   "Endpoints funcionales, pruebas y despliegue cloud."],
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>
      <div style={{ background: C.white }}>
        <TopBar title="Perfil del Tutor" back onBack={() => setScreen("search")} />
        <div style={{ padding: "20px 20px 0", display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Avatar initials={tutor.avatar} color={tutor.color} size={72} />
            {tutor.disponible && (
              <div style={{ position: "absolute", bottom: 3, right: 3, width: 16, height: 16, borderRadius: "50%", background: C.success, border: "3px solid #fff" }} />
            )}
          </div>
          <div>
            <h2 style={{ fontFamily: F.body, fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>{tutor.nombre}</h2>
            <div style={{ fontFamily: F.body, fontSize: 14, color: C.primary, fontWeight: 600 }}>{tutor.materia}</div>
            <div style={{ fontFamily: F.body, fontSize: 12, color: C.muted, marginTop: 2 }}>{tutor.nivel}</div>
            {tutor.badge && <div style={{ marginTop: 6 }}><Badge text={tutor.badge} type={tutor.badge === "Top Tutor" ? "blue" : "amber"} /></div>}
          </div>
        </div>
        <div style={{ display: "flex", padding: "14px 20px" }}>
          {[{ v: tutor.rating + "★", l: "Rating" }, { v: tutor.sesiones, l: "Clases" }, { v: "$" + (tutor.precio / 1000).toFixed(0) + "k/h", l: "Precio" }].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontFamily: F.body, fontSize: 17, color: C.primary, fontWeight: 700 }}>{s.v}</div>
              <div style={{ fontFamily: F.body, fontSize: 12, color: C.muted }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", borderTop: `1px solid ${C.border}` }}>
          {["Info", "Reseñas", "Agendar"].map(t => (
            <button key={t} onClick={() => setTab(t.toLowerCase())} style={{
              flex: 1, padding: "12px 0", background: "none", border: "none", cursor: "pointer",
              fontFamily: F.body, fontSize: 13, fontWeight: tab === t.toLowerCase() ? 700 : 400,
              color: tab === t.toLowerCase() ? C.primary : C.muted,
              borderBottom: tab === t.toLowerCase() ? `2px solid ${C.primary}` : "2px solid transparent",
            }}>{t}</button>
          ))}
        </div>
      </div>
 
      <div style={{ padding: 16 }}>
        {tab === "info" && (
          <>
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 16, marginBottom: 12 }}>
              <h4 style={{ fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.text, margin: "0 0 8px" }}>Sobre mí</h4>
              <p style={{ fontFamily: F.body, fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>{tutor.bio}</p>
            </div>
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 16, marginBottom: 12 }}>
              <h4 style={{ fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.text, margin: "0 0 10px" }}>Plan de Estudio</h4>
              {fases.map(([title, desc]) => (
                <div key={title} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                  <input type="checkbox" style={{ accentColor: C.primary, width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: F.body, fontSize: 13, fontWeight: 600, color: C.text }}>{title}</div>
                    <div style={{ fontFamily: F.body, fontSize: 11, color: C.muted, marginTop: 2 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 16, marginBottom: 12 }}>
              <h4 style={{ fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.text, margin: "0 0 10px" }}>Temas que domina</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {tutor.tags.map(tag => <Tag key={tag} text={tag} />)}
              </div>
            </div>
            <BtnPrimary onClick={() => setTab("agendar")} style={{ marginBottom: 10 }}>📅 Contratar Tutoría</BtnPrimary>
            <BtnOutline onClick={() => setScreen("demanda")}>⚡ Tutoría Inmediata</BtnOutline>
          </>
        )}
 
        {tab === "reseñas" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {reseñas.map((r, i) => (
              <div key={i} style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.text }}>{r.user}</span>
                  <span style={{ color: C.accent, fontSize: 12 }}>{"★".repeat(r.stars)}</span>
                </div>
                <p style={{ fontFamily: F.body, fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.5 }}>{r.texto}</p>
              </div>
            ))}
          </div>
        )}
 
        {tab === "agendar" && (
          <div>
            <h4 style={{ fontFamily: F.body, fontSize: 15, fontWeight: 700, color: C.text, margin: "0 0 14px" }}>Selecciona fecha y hora</h4>
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 16, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontFamily: F.body, fontSize: 15, fontWeight: 600, color: C.text }}>Mayo 2026</span>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ cursor: "pointer", color: C.muted }}>‹</span>
                  <span style={{ cursor: "pointer", color: C.muted }}>›</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center" }}>
                {["L", "M", "X", "J", "V", "S", "D"].map(d => (
                  <div key={d} style={{ fontFamily: F.body, fontSize: 11, color: C.muted, padding: "4px 0" }}>{d}</div>
                ))}
                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  const active = [28, 29, 30].includes(day);
                  const today = day === 27;
                  return (
                    <div key={i} style={{
                      borderRadius: 8, padding: "6px 0",
                      background: active ? C.primary : today ? C.primaryLight : "transparent",
                      color: active ? "#fff" : today ? C.primary : C.text,
                      fontFamily: F.body, fontSize: 13, cursor: active ? "pointer" : "default",
                      fontWeight: active || today ? 600 : 400,
                    }}>{day}</div>
                  );
                })}
              </div>
            </div>
            <h4 style={{ fontFamily: F.body, fontSize: 15, fontWeight: 700, color: C.text, margin: "0 0 12px" }}>Horarios disponibles</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              {["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"].map((h, i) => (
                <button key={h} style={{
                  background: i === 1 ? C.primary : C.white,
                  color: i === 1 ? "#fff" : C.text,
                  border: `1px solid ${i === 1 ? C.primary : C.border}`,
                  borderRadius: 10, padding: "10px 0", cursor: "pointer",
                  fontFamily: F.body, fontSize: 14, fontWeight: i === 1 ? 600 : 400,
                }}>{h}</button>
              ))}
            </div>
            <BtnPrimary onClick={() => setReserved(true)} style={{ background: reserved ? C.success : C.primary }}>
              {reserved ? "✓ Reserva Confirmada" : "Confirmar Reserva"}
            </BtnPrimary>
            {reserved && (
              <div style={{ marginTop: 12, background: "#dcfce7", borderRadius: 12, padding: 14, fontFamily: F.body, fontSize: 14, color: C.success, textAlign: "center" }}>
                🎉 ¡Reserva exitosa! Recibirás una confirmación.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
 
function BookingsScreen({ setScreen, setSelectedTutor }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>
      <TopBar title="Mis Reservas" subtitle={`${RESERVAS.length} tutorías programadas`} />
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {RESERVAS.map(r => (
          <div key={r.id} style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: 16, cursor: "pointer" }}
            onClick={() => { const t = TUTORS.find(t2 => t2.nombre === r.tutor); if (t) { setSelectedTutor(t); setScreen("tutor"); } }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Avatar initials={r.avatar} color={r.color} size={48} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.text }}>{r.tutor}</div>
                  <Badge text={r.estado} type={r.estado === "confirmada" ? "green" : "amber"} />
                </div>
                <div style={{ fontFamily: F.body, fontSize: 13, color: C.primary, fontWeight: 500 }}>{r.materia}</div>
                <div style={{ fontFamily: F.body, fontSize: 12, color: C.muted, marginTop: 2 }}>📅 {r.fecha}</div>
              </div>
            </div>
            {r.estado === "confirmada" && (
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button onClick={(e) => { e.stopPropagation(); setScreen("aula"); }} style={{
                  flex: 1, background: "#eff6ff", border: "none", borderRadius: 10,
                  padding: "9px 0", cursor: "pointer", fontFamily: F.body, fontSize: 12,
                  color: C.primary, fontWeight: 600,
                }}>💻 Entrar al Aula</button>
                <button style={{
                  flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10,
                  padding: "9px 0", cursor: "pointer", fontFamily: F.body, fontSize: 12, color: C.muted,
                }}>Reagendar</button>
              </div>
            )}
          </div>
        ))}
        <h3 style={{ fontFamily: F.body, fontSize: 14, fontWeight: 700, color: C.text, margin: "8px 0 4px" }}>Historial</h3>
        {[
          { t: "Doc. Camila Lugo",     m: "SQL Avanzado",  f: "15 Mayo 2026", a: "CL", c: "#0f766e" },
          { t: "Prof. Yeinner Ortega", m: "Redes VLAN",    f: "10 Mayo 2026", a: "YO", c: "#7c3aed" },
        ].map((r, i) => (
          <div key={i} style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 12, display: "flex", gap: 12, alignItems: "center", opacity: 0.7 }}>
            <Avatar initials={r.a} color={r.c} size={42} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.text }}>{r.t}</div>
              <div style={{ fontFamily: F.body, fontSize: 12, color: C.muted }}>{r.m} · {r.f}</div>
            </div>
            <span style={{ fontSize: 18 }}>✅</span>
          </div>
        ))}
      </div>
    </div>
  );
}
 
function DemandScreen({ setScreen }) {
  const [step, setStep] = useState(0);
  const [materia, setMateria] = useState("");
  const [searching, setSearching] = useState(false);
  const handleSolicitar = () => {
    if (!materia) return;
    setSearching(true); setStep(1);
    setTimeout(() => { setSearching(false); setStep(2); }, 2400);
  };
  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>
      <TopBar title="Tutoría Inmediata ⚡" back onBack={() => setScreen("home")} />
      <div style={{ padding: 20 }}>
        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
          {["Solicitud", "Buscando", "¡Listo!"].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: step >= i ? C.primary : C.border,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: F.body, fontSize: 12, fontWeight: 700,
                color: step >= i ? "#fff" : C.muted, flexShrink: 0,
              }}>{i + 1}</div>
              <span style={{ fontFamily: F.body, fontSize: 11, color: step >= i ? C.primary : C.muted, margin: "0 8px 0 4px" }}>{s}</span>
              {i < 2 && <div style={{ flex: 1, height: 1, background: step > i ? C.primary : C.border }} />}
            </div>
          ))}
        </div>
 
        {step === 0 && (
          <>
            <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, marginBottom: 16 }}>
              <h3 style={{ fontFamily: F.body, fontSize: 15, fontWeight: 700, color: C.text, margin: "0 0 14px" }}>¿Qué necesitas aprender?</h3>
              <label style={{ fontFamily: F.body, fontSize: 13, color: C.muted, display: "block", marginBottom: 6 }}>Materia o tema</label>
              <input
                value={materia} onChange={e => setMateria(e.target.value)}
                placeholder="Ej: APIs REST, SQL avanzado, Redes VLAN..."
                style={{
                  border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px",
                  fontSize: 14, color: C.text, background: C.bg, width: "100%",
                  outline: "none", fontFamily: F.body, marginBottom: 14, boxSizing: "border-box",
                }}
              />
              <label style={{ fontFamily: F.body, fontSize: 13, color: C.muted, display: "block", marginBottom: 6 }}>Modalidad</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["Virtual 💻", "Presencial 📍"].map((m, i) => (
                  <button key={m} style={{
                    flex: 1, background: i === 0 ? "#eff6ff" : C.bg,
                    color: i === 0 ? C.primaryDark : C.muted,
                    border: `1px solid ${i === 0 ? C.primary : C.border}`,
                    borderRadius: 10, padding: "10px 0", cursor: "pointer",
                    fontFamily: F.body, fontSize: 13, fontWeight: i === 0 ? 600 : 400,
                  }}>{m}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <p style={{ fontFamily: F.body, fontSize: 13, color: C.muted, margin: "0 0 10px" }}>Solicitudes frecuentes</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["FastAPI", "Data Analytics", "Ciberseguridad", "Cálculo diferencial", "Python"].map(s => (
                  <button key={s} onClick={() => setMateria(s)} style={{
                    background: C.white, border: `1px solid ${C.border}`,
                    borderRadius: 20, padding: "6px 14px", cursor: "pointer",
                    fontFamily: F.body, fontSize: 12, color: C.text,
                  }}>{s}</button>
                ))}
              </div>
            </div>
            <BtnPrimary onClick={handleSolicitar} disabled={!materia}>⚡ Solicitar tutor ahora</BtnPrimary>
          </>
        )}
 
        {step === 1 && searching && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto 18px" }}>📡</div>
            <h3 style={{ fontFamily: F.body, fontSize: 19, fontWeight: 700, color: C.text, margin: "0 0 8px" }}>Buscando tutor...</h3>
            <p style={{ fontFamily: F.body, fontSize: 13, color: C.muted }}>
              Conectando con tutores disponibles<br />para <strong>{materia}</strong>
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: C.primary, opacity: 0.3 + i * 0.35 }} />)}
            </div>
          </div>
        )}
 
        {step === 2 && (
          <div>
            <div style={{ textAlign: "center", padding: "20px 0 24px" }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🎉</div>
              <h3 style={{ fontFamily: F.body, fontSize: 20, fontWeight: 700, color: C.success, margin: "0 0 6px" }}>¡Tutor asignado!</h3>
              <p style={{ fontFamily: F.body, fontSize: 13, color: C.muted }}>La sesión comenzará en breve</p>
            </div>
            <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
                <div style={{ position: "relative" }}>
                  <Avatar initials="AM" color="#185FA5" size={58} />
                  <div style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: C.success, border: "2px solid #fff" }} />
                </div>
                <div>
                  <div style={{ fontFamily: F.body, fontSize: 15, fontWeight: 700, color: C.text }}>Ing. Armando Molina</div>
                  <span style={{ color: C.accent, fontSize: 12 }}>★★★★★ 4.9</span>
                  <div style={{ fontFamily: F.body, fontSize: 12, color: C.muted }}>Ing. Sistemas · Backend & Cloud</div>
                </div>
              </div>
              <div style={{ background: C.bg, borderRadius: 10, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: F.body, fontSize: 13, color: C.muted }}>Materia</span>
                  <span style={{ fontFamily: F.body, fontSize: 13, color: C.text, fontWeight: 600 }}>{materia}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: F.body, fontSize: 13, color: C.muted }}>Modalidad</span>
                  <span style={{ fontFamily: F.body, fontSize: 13, color: C.text, fontWeight: 600 }}>Virtual 💻</span>
                </div>
              </div>
            </div>
            <BtnPrimary onClick={() => setScreen("aula")} style={{ marginBottom: 10 }}>💻 Entrar al Aula Virtual</BtnPrimary>
            <BtnOutline onClick={() => { setStep(0); setMateria(""); }}>Cancelar sesión</BtnOutline>
          </div>
        )}
      </div>
    </div>
  );
}
 
function AulaScreen({ setScreen }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ background: C.primaryDark, padding: "14px 20px 12px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setScreen("bookings")} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, width: 34, height: 34, cursor: "pointer", fontSize: 17, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
        <h1 style={{ fontFamily: F.body, fontSize: 16, fontWeight: 700, color: "#fff", margin: 0, flex: 1 }}>Aula Virtual de Aprendizaje</h1>
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "6px 12px", cursor: "pointer" }} onClick={() => setScreen("bookings")}>
          <span style={{ fontFamily: F.body, fontSize: 12, color: "#fff", fontWeight: 600 }}>📚 Mis Clases</span>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 80, background: C.white, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "16px 0", alignItems: "center", gap: 4 }}>
          {[
            { icon: "📚", label: "Mis Clases", active: true, action: null },
            { icon: "📅", label: "Horarios",   active: false, action: null },
            { icon: "💳", label: "Pagos",      active: false, action: null },
          ].map(item => (
            <div key={item.label} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              padding: "10px 8px", borderRadius: 10, cursor: "pointer", width: 72,
              background: item.active ? "#eff6ff" : "transparent",
            }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontFamily: F.body, fontSize: 10, color: item.active ? C.primary : C.muted, fontWeight: item.active ? 700 : 400, textAlign: "center" }}>{item.label}</span>
            </div>
          ))}
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 8px", cursor: "pointer" }} onClick={() => setScreen("login")}>
            <span style={{ fontSize: 18 }}>🚪</span>
            <span style={{ fontFamily: F.body, fontSize: 10, color: C.danger, textAlign: "center" }}>Cerrar Sesión</span>
          </div>
        </div>
        {/* Main content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
          <div style={{ background: C.white, borderRadius: 10, border: `1px solid ${C.border}`, padding: 14, marginBottom: 12, display: "flex", gap: 12, alignItems: "center" }}>
            <Avatar initials="AM" color="#185FA5" size={50} />
            <div>
              <div style={{ fontFamily: F.body, fontSize: 14, fontWeight: 700, color: C.text }}>Armando Luis Molina Salina</div>
              <div style={{ fontFamily: F.body, fontSize: 12, color: C.success, fontWeight: 600 }}>✅ Acceso Autorizado</div>
            </div>
          </div>
          <div style={{ background: "#eff6ff", borderRadius: 10, padding: 14, marginBottom: 12 }}>
            <div style={{ fontFamily: F.body, fontSize: 12, color: C.primary, fontWeight: 700, marginBottom: 6 }}>● CONTENIDO DESBLOQUEADO</div>
            <div style={{ fontFamily: F.body, fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8 }}>Plan General de Tutorías Académicas</div>
            <p style={{ fontFamily: F.body, fontSize: 12, color: C.muted, marginBottom: 12 }}>Módulos del Plan de Estudio Contratado:</p>
            {[
              ["Fase 1: Introducción Teórica y Contextualización", "Descarga de lecturas científicas fundamentales y análisis del problema base del sistema."],
              ["Fase 2: Arquitectura y Modelamiento Lógico", "Diseño detallado de diagramas de secuencia, flujos alternativos e ingeniería de requisitos."],
              ["Fase 3: Implementación Práctica y Backend", "Despliegue de endpoints funcionales, pruebas automatizadas y conexión de servicios en la nube."],
            ].map(([t, d]) => (
              <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <input type="checkbox" style={{ accentColor: C.primary, width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: F.body, fontSize: 13, fontWeight: 600, color: C.text }}>{t}</div>
                  <div style={{ fontFamily: F.body, fontSize: 11, color: C.muted, marginTop: 2 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
          <BtnPrimary onClick={() => {}}>💻 Entrar a la Sala de Google Meet (Tutoría en Vivo)</BtnPrimary>
        </div>
      </div>
    </div>
  );
}
 
function ProfileScreen({ setScreen }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>
      <div style={{ background: `linear-gradient(120deg, ${C.primaryDark}, ${C.primary})`, height: 90, position: "relative" }}>
        <div style={{
          position: "absolute", bottom: -36, left: 20,
          width: 70, height: 70, borderRadius: "50%",
          background: C.white, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: F.body, fontSize: 24, fontWeight: 700, color: C.primary,
          border: `3px solid ${C.white}`,
        }}>SG</div>
      </div>
      <div style={{ padding: "44px 20px 18px", background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <h2 style={{ fontFamily: F.body, fontSize: 19, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>Santiago García</h2>
        <p style={{ fontFamily: F.body, fontSize: 13, color: C.muted }}>Estudiante · Ingeniería de Sistemas</p>
        <p style={{ fontFamily: F.body, fontSize: 12, color: C.muted, marginTop: 3 }}>Universidad Nacional · Bogotá</p>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 10, padding: "8px 18px", cursor: "pointer", fontFamily: F.body, fontSize: 13, fontWeight: 600 }}>Editar perfil</button>
          <button style={{ background: C.bg, color: C.text, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 18px", cursor: "pointer", fontFamily: F.body, fontSize: 13 }}>Compartir</button>
        </div>
      </div>
      <div style={{ display: "flex", background: C.white, borderBottom: `1px solid ${C.border}`, marginBottom: 14 }}>
        {[{ v: "14", l: "Sesiones" }, { v: "4", l: "Tutores" }, { v: "COP 560k", l: "Invertido" }].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "14px 0", textAlign: "center", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ fontFamily: F.body, fontSize: 17, color: C.primary, fontWeight: 700 }}>{s.v}</div>
            <div style={{ fontFamily: F.body, fontSize: 11, color: C.muted }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          ["💳", "Métodos de pago",        "Visa •••• 4242",        false],
          ["🔔", "Notificaciones",          "Activadas",             false],
          ["🔒", "Seguridad",               "Contraseña y acceso",   false],
          ["⭐", "Mis calificaciones",      "14 reseñas dadas",      false],
          ["🎓", "Convertirme en tutor",    "Gana dinero enseñando", false],
          ["❓", "Ayuda y soporte",         "",                      false],
          ["🚪", "Cerrar sesión",           "",                      true ],
        ].map(([ic, lb, sub, d]) => (
          <div
            key={lb}
            onClick={() => d && setScreen("login")}
            style={{ background: C.white, borderRadius: 12, padding: 14, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", border: `1px solid ${C.border}` }}
          >
            <span style={{ fontSize: 18 }}>{ic}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F.body, fontSize: 14, color: d ? C.danger : C.text, fontWeight: 500 }}>{lb}</div>
              {sub && <div style={{ fontFamily: F.body, fontSize: 12, color: C.muted }}>{sub}</div>}
            </div>
            <span style={{ color: C.light, fontSize: 15 }}>›</span>
          </div>
        ))}
        <p style={{ textAlign: "center", fontFamily: F.body, fontSize: 12, color: C.light, padding: "16px 0" }}>
          TutoresOn-Line v2.0.0 · © 2026
        </p>
      </div>
    </div>
  );
}
 
// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login");
  const [selectedTutor, setSelectedTutor] = useState(null);
 
  const noNav   = ["login", "register", "tutor", "demanda", "aula"].includes(screen);
  const darkTop = ["login", "register", "home"].includes(screen);
 
  const renderScreen = () => {
    switch (screen) {
      case "login":    return <LoginScreen    setScreen={setScreen} />;
      case "register": return <RegisterScreen setScreen={setScreen} />;
      case "home":     return <HomeScreen     setScreen={setScreen} setSelectedTutor={setSelectedTutor} />;
      case "search":   return <SearchScreen   setScreen={setScreen} setSelectedTutor={setSelectedTutor} />;
      case "tutor":    return <TutorScreen    tutor={selectedTutor} setScreen={setScreen} />;
      case "bookings": return <BookingsScreen setScreen={setScreen} setSelectedTutor={setSelectedTutor} />;
      case "demanda":  return <DemandScreen   setScreen={setScreen} />;
      case "aula":     return <AulaScreen     setScreen={setScreen} />;
      case "profile":  return <ProfileScreen  setScreen={setScreen} />;
      default:         return <LoginScreen    setScreen={setScreen} />;
    }
  };
 
  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "flex-start",
      minHeight: "100vh", background: "#dde8f7",
      padding: "24px 16px", fontFamily: F.body,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      {/* Phone frame */}
      <div style={{
        width: 390, minHeight: 844, background: C.bg,
        borderRadius: 44, overflow: "hidden",
        boxShadow: "0 40px 80px rgba(0,0,0,0.25), 0 0 0 10px #0f172a, 0 0 0 12px #1e3a5f",
        display: "flex", flexDirection: "column",
      }}>
        {/* Status bar */}
        <div style={{
          background: darkTop ? C.primaryDark : C.white,
          padding: "12px 28px 8px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontFamily: F.body, fontSize: 13, fontWeight: 700, color: darkTop ? "#fff" : C.text }}>9:41</span>
          <div style={{ display: "flex", gap: 4, alignItems: "center", fontSize: 12, color: darkTop ? "#fff" : C.text }}>
            <span>●●●</span><span>WiFi</span><span>🔋</span>
          </div>
        </div>
 
        {/* Screen */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {renderScreen()}
        </div>
 
        {/* Bottom nav */}
        {!noNav && (
          <BottomNav
            screen={screen}
            setScreen={setScreen}
          />
        )}
 
        {/* Home indicator */}
        <div style={{ background: C.white, padding: "8px 0 12px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: 120, height: 4, background: C.border, borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}
 
