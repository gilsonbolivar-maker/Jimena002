// Configurações da clínica — troque aqui sem mexer no resto do código.
window.CONFIG = {
  versao: "1.4.0",
  clinica: "Jimena Andrade",
  subtitulo: "Harmonização Orofacial",

  // Informações da página pública. O que ficar vazio ("") não aparece no site.
  sobre: "Contra os efeitos do tempo. A favor da sua beleza. Botox, preenchimentos e bioestimuladores de colágeno. Dúvidas e agendamentos pelo WhatsApp ou aqui pelo site.",
  registro: "",     // ex.: "CRO-BA 00000"
  whatsapp: "77998000177",     // só números, com DDD. ex.: "77999990000"
  endereco: "Avenida Santana, 328",     // ex.: "Rua Tal, 123 — Centro"
  cidade: "Caetité — BA",       // ex.: "Caetité — BA"
  instagram: "jimennandrade",    // ex.: "jimenaandrade" (sem @)

  // Remarcação pelo site: só com esta antecedência (em horas). O banco também confere.
  antecedenciaRemarcarHoras: 72,

  // Banco de dados (Supabase). A chave abaixo é pública por natureza;
  // quem protege os dados são as regras de acesso do banco (só a equipe entra).
  supabaseUrl: "https://meprwchojnjtoottbqry.supabase.co",
  supabaseChave: "sb_publishable_04yVgvpeZRCqHk7XimGl5A_hLnmoWxs",

  // Horário de atendimento
  abre: "08:00",
  fecha: "18:00",
  intervaloMin: 30,          // de quanto em quanto tempo aparecem os horários
  diasAtendimento: [1, 2, 3, 4, 5, 6], // 0=domingo … 6=sábado
  fuso: "-03:00"             // Bahia
};
