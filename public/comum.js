// Código compartilhado pelas páginas da clínica.
const C = window.CONFIG;
const sb = window.supabase.createClient(C.supabaseUrl, C.supabaseChave);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ---------- Datas (sempre no fuso da Bahia) ----------
const pad = (n) => String(n).padStart(2, "0");
function hojeISO() {
  const d = new Date(Date.now() + parseInt(C.fuso) * 3600e3);
  return d.toISOString().slice(0, 10);
}
function somaDias(iso, n) {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function diaSemana(iso) { return new Date(iso + "T12:00:00Z").getUTCDay(); }
const NOMES_DIA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const NOMES_MES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
function dataBonita(iso) {
  const [a, m, d] = iso.split("-").map(Number);
  const rel = iso === hojeISO() ? "Hoje, " : iso === somaDias(hojeISO(), 1) ? "Amanhã, " : "";
  return `${rel}${NOMES_DIA[diaSemana(iso)]} ${d} ${NOMES_MES[m - 1]}${a !== new Date().getFullYear() ? " " + a : ""}`;
}
function dataCurta(iso) { const [a, m, d] = iso.split("-"); return `${d}/${m}/${a}`; }
function instante(iso, hhmm) { return `${iso}T${hhmm}:00${C.fuso}`; }
// Converte timestamp do banco para {data:"AAAA-MM-DD", hora:"HH:MM"} na Bahia
function local(ts) {
  const d = new Date(new Date(ts).getTime() + parseInt(C.fuso) * 3600e3);
  return { data: d.toISOString().slice(0, 10), hora: d.toISOString().slice(11, 16) };
}
function minutos(hhmm) { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; }
function hhmm(min) { return `${pad(Math.floor(min / 60))}:${pad(min % 60)}`; }

// Telefone só com números (sem o 55) e o "e-mail" interno que o cliente usa para entrar
function telDigitos(t) { let d = String(t || "").replace(/\D/g, ""); if (d.length > 11 && d.startsWith("55")) d = d.slice(2); return d; }
function emailPaciente(t) { return telDigitos(t) + "@paciente.clinica"; }
const NOMES_DIA_LONGO = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

// ---------- Login ----------
let EU = null; // { email, nome, papel }

async function exigirLogin() {
  const { data } = await sb.auth.getSession();
  if (!data.session) { location.href = "entrar.html?volta=" + encodeURIComponent(location.pathname.split("/").pop() + location.search); return null; }
  const email = data.session.user.email.toLowerCase();
  const { data: eq } = await sb.from("clinica_equipe").select("*").eq("email", email).maybeSingle();
  if (!eq) { await sb.auth.signOut(); alert("Este acesso não faz parte da equipe da clínica."); location.href = "entrar.html"; return null; }
  EU = eq;
  const quem = $("#quem");
  if (quem) quem.textContent = eq.nome;
  return eq;
}
async function sair(destino) { await sb.auth.signOut(); location.href = destino || "entrar.html"; }

// ---------- Dados ----------
let SERVICOS = [];
async function carregarServicos() {
  const { data, error } = await sb.from("clinica_servicos").select("*").eq("ativo", true).order("area").order("nome");
  if (error) throw error;
  SERVICOS = data;
  return data;
}
const servico = (id) => SERVICOS.find((s) => s.id === id) || { nome: "—", area: "", duracao_min: 30 };

async function marcacoesDoDia(iso) {
  const { data, error } = await sb
    .from("clinica_marcacoes")
    .select("*, paciente:clinica_pacientes(id,nome,telefone,em_tratamento)")
    .gte("inicio", instante(iso, "00:00"))
    .lt("inicio", instante(somaDias(iso, 1), "00:00"))
    .order("inicio");
  if (error) throw error;
  return data;
}

// Bloqueios (folgas, compromissos da Jimena) que tocam um dia, recortados ao dia
async function bloqueiosDoDia(iso) {
  const a = instante(iso, "00:00"), b = instante(somaDias(iso, 1), "00:00");
  const { data, error } = await sb.from("clinica_bloqueios").select("*").lt("inicio", b).gt("fim", a).order("inicio");
  if (error) return [];
  const ia = new Date(a).getTime(), ib = new Date(b).getTime();
  return data.map((x) => {
    const i = Math.max(new Date(x.inicio).getTime(), ia), f = Math.min(new Date(x.fim).getTime(), ib);
    const ini = minutos(local(new Date(i).toISOString()).hora);
    const fim = f >= ib ? 24 * 60 : minutos(local(new Date(f).toISOString()).hora);
    return { ...x, ini, fim, diaTodo: ini <= minutos(C.abre) && fim >= minutos(C.fecha) };
  });
}
function cartaoBloqueio(x) {
  const el = document.createElement("a");
  el.className = "marc bloqueio"; el.href = "ausencias.html";
  el.innerHTML = `
    <div class="hora">${x.diaTodo ? "Dia" : hhmm(Math.max(x.ini, minutos(C.abre)))}<small>${x.diaTodo ? "inteiro" : "até " + hhmm(Math.min(x.fim, minutos(C.fecha)))}</small></div>
    <div class="info"><b>🌙 Ausência</b><div class="srv">${esc(x.motivo || "Jimena ausente neste horário")}</div></div>`;
  return el;
}

// ---------- Aparência ----------
const STATUS = {
  marcado: { rotulo: "Marcado", cor: "azul" },
  confirmado: { rotulo: "Confirmado", cor: "verde" },
  atendido: { rotulo: "Atendido", cor: "cinza" },
  faltou: { rotulo: "Faltou", cor: "laranja" },
  cancelado: { rotulo: "Cancelado", cor: "vermelho" }
};
function selo(status) { const s = STATUS[status] || STATUS.marcado; return `<span class="selo ${s.cor}">${s.rotulo}</span>`; }
function seloArea(area) { return `<span class="area ${area === "Estética" ? "est" : "odo"}">${esc(area)}</span>`; }

function aviso(texto, tipo = "ok") {
  let box = $("#avisos");
  if (!box) { box = document.createElement("div"); box.id = "avisos"; document.body.appendChild(box); }
  const el = document.createElement("div");
  el.className = "aviso " + tipo;
  el.textContent = texto;
  box.appendChild(el);
  setTimeout(() => el.classList.add("some"), 4500);
  setTimeout(() => el.remove(), 5200);
}

function bip() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [880, 1320].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = f; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.18);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + i * 0.18 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.18 + 0.16);
      o.start(ctx.currentTime + i * 0.18); o.stop(ctx.currentTime + i * 0.18 + 0.2);
    });
  } catch (e) {}
}

function rodape() {
  const v = document.createElement("div");
  v.className = "versao";
  v.textContent = "Versão " + C.versao;
  document.body.appendChild(v);
}
document.addEventListener("DOMContentLoaded", () => {
  rodape();
  $$("[data-clinica]").forEach((e) => (e.textContent = C.clinica));
  $$("[data-subtitulo]").forEach((e) => (e.textContent = C.subtitulo));
});
