// Janela de detalhe de uma marcação (usada pela assistente e pela Jimena).
function prepararJanela() {
  if ($("#janela")) return;
  const f = document.createElement("div");
  f.className = "fundo-janela"; f.id = "janela";
  f.innerHTML = `<div class="janela" role="dialog"></div>`;
  f.addEventListener("click", (e) => { if (e.target === f) fecharJanela(); });
  document.body.appendChild(f);
}
function fecharJanela() { $("#janela").classList.remove("aberta"); }

function linkWhats(tel, texto) {
  let n = String(tel || "").replace(/\D/g, "");
  if (!n) return null;
  if (n.length <= 11) n = "55" + n;
  return `https://wa.me/${n}?text=${encodeURIComponent(texto)}`;
}

function abrirMarcacao(m, aoMudar) {
  prepararJanela();
  const s = servico(m.servico_id);
  const ini = local(m.inicio), fim = local(m.fim);
  const p = m.paciente || {};
  const msg = `Olá, ${p.nome?.split(" ")[0] || ""}! Aqui é da clínica ${C.clinica}. Confirmando seu horário: ${dataBonita(ini.data)} às ${ini.hora} — ${s.nome}. Podemos confirmar?`;
  const wa = linkWhats(p.telefone, msg);
  const dentista = EU?.papel === "dentista";

  const box = $("#janela .janela");
  box.innerHTML = `
    <h3>${esc(p.nome)}</h3>
    <div>${seloArea(s.area)} ${selo(m.status)} ${p.em_tratamento ? '<span class="trat">Em tratamento</span>' : ""}</div>
    <p style="margin:12px 0 4px"><b>${esc(s.nome)}</b></p>
    <p style="margin:0;color:var(--suave)">${dataBonita(ini.data)} · ${ini.hora} às ${fim.hora}</p>
    ${m.origem === "site" ? `<p style="margin:6px 0 0"><span class="site">Marcado pelo cliente no site</span>${m.remarcada_em ? ' <span class="site">Remarcado pelo cliente</span>' : ""}</p>` : ""}
    ${p.telefone ? `<p style="margin:6px 0 0;color:var(--suave)">📞 ${esc(p.telefone)}</p>` : ""}
    ${m.observacao ? `<div style="background:#faf7f3;border-radius:10px;padding:10px;margin-top:10px">📝 ${esc(m.observacao)}</div>` : ""}

    ${dentista && m.status !== "cancelado" ? `
      <label class="tit" style="display:block;font-weight:600;margin-top:14px">Anotação do atendimento</label>
      <textarea id="anot" placeholder="O que foi feito, próximos passos…">${esc(m.anotacao_atendimento || "")}</textarea>
      <button class="btn sec peq" id="salvarAnot" style="margin-top:6px">Salvar anotação</button>` : ""}

    <div class="grade">
      ${m.status === "marcado" ? `<button class="btn peq" data-st="confirmado">✓ Confirmar</button>` : ""}
      ${dentista && ["marcado", "confirmado"].includes(m.status) ? `<button class="btn peq" data-st="atendido">Atendido</button><button class="btn sec peq" data-st="faltou">Faltou</button>` : ""}
      ${["marcado", "confirmado"].includes(m.status) ? `<button class="btn perigo peq" data-st="cancelado">Cancelar</button>` : ""}
      ${m.status === "cancelado" ? `<button class="btn sec peq" data-st="marcado">Reativar</button>` : ""}
    </div>
    <div class="grade">
      <a class="btn sec peq" href="paciente.html?id=${p.id}">📋 Histórico do paciente</a>
      ${wa && !dentista ? `<a class="btn sec peq" href="${wa}" target="_blank" rel="noopener">WhatsApp p/ confirmar</a>` : ""}
      <button class="btn sec peq" id="fechar">Fechar</button>
    </div>`;

  $("#fechar", box).onclick = fecharJanela;
  $$("[data-st]", box).forEach((b) => (b.onclick = async () => {
    if (b.dataset.st === "cancelado" && !confirm("Cancelar esta marcação?")) return;
    const { error } = await sb.from("clinica_marcacoes").update({ status: b.dataset.st }).eq("id", m.id);
    if (error) { aviso(error.code === "23P01" ? "Esse horário já foi ocupado por outra marcação." : /ausente/.test(error.message) ? error.message : "Não consegui salvar: " + error.message, "erro"); return; }
    aviso("Marcação: " + STATUS[b.dataset.st].rotulo);
    fecharJanela(); aoMudar && aoMudar();
  }));
  const sa = $("#salvarAnot", box);
  if (sa) sa.onclick = async () => {
    const { error } = await sb.from("clinica_marcacoes").update({ anotacao_atendimento: $("#anot").value.trim() || null }).eq("id", m.id);
    if (error) { aviso("Não consegui salvar a anotação.", "erro"); return; }
    aviso("Anotação salva no histórico");
    m.anotacao_atendimento = $("#anot").value.trim();
    aoMudar && aoMudar();
  };
  $("#janela").classList.add("aberta");
}

function cartaoMarcacao(m) {
  const s = servico(m.servico_id);
  const ini = local(m.inicio), fim = local(m.fim);
  const el = document.createElement("div");
  el.className = `marc ${s.area === "Estética" ? "est" : ""} ${m.status}`;
  el.dataset.id = m.id;
  el.innerHTML = `
    <div class="hora">${ini.hora}<small>até ${fim.hora}</small></div>
    <div class="info">
      <b>${esc(m.paciente?.nome)} ${m.paciente?.em_tratamento ? '<span class="trat">Em tratamento</span>' : ""}</b>
      <div class="srv">${esc(s.nome)}</div>
      ${m.observacao ? `<div class="obs">📝 ${esc(m.observacao)}</div>` : ""}
    </div>
    <div class="lado">${selo(m.status)}${seloArea(s.area)}${m.origem === "site" ? '<span class="site">Pelo site</span>' : ""}</div>`;
  return el;
}
