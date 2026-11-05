// Configuração: altere só aqui
const CONFIG = {
  NOME: "Perfil Avaliado", // nome do serviço (TROCAR)
  WHATSAPP: "5551989406950", // DDI + DDD + número, só dígitos (TROCAR)
  EMAIL: "contato@paulojr.dev.br", // TROCAR
  API_URL: "" // endpoint do backend (POST {texto,nota,tom} -> {resposta,aprovacao,motivo}); vazio = modo exemplos
};
const $ = s => document.querySelector(s);
const wa = t => `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(t)}`;

document.querySelectorAll("[data-nome]").forEach(e => e.textContent = CONFIG.NOME);
document.querySelectorAll("[data-wa]").forEach(a => { a.href = wa(`Olá! Vi o site do ${CONFIG.NOME} e quero saber mais.`); a.target = "_blank"; a.rel = "noopener"; });
document.querySelectorAll("[data-email]").forEach(a => a.href = `mailto:${CONFIG.EMAIL}`);
$("#email-txt").textContent = CONFIG.EMAIL;

$("#copiar").onclick = async e => { try { await navigator.clipboard.writeText(CONFIG.EMAIL); e.target.textContent = "E-mail copiado"; } catch (_) { e.target.textContent = CONFIG.EMAIL; } };
$("#contato-form").onsubmit = e => {
  e.preventDefault();
  wa_open(`Olá! Meu nome é ${$("#c-nome").value}${$("#c-neg").value ? ", do negócio " + $("#c-neg").value : ""}. Meu WhatsApp: ${$("#c-zap").value}. Quero saber mais sobre as respostas às avaliações.`);
};
const wa_open = t => window.open(wa(t), "_blank", "noopener");

// Demonstração
const EX = [
  { n: "Elogio", nota: 5, t: "Atendimento excelente, fui muito bem recebida e o resultado ficou ótimo!" },
  { n: "Reclamação", nota: 2, t: "Esperei mais de uma hora e ninguém me avisou do atraso." },
  { n: "Só estrelas", nota: 5, t: "" },
  { n: "Assunto sensível", nota: 4, t: "Gostei, mas tive uma reação alérgica depois do serviço." }
];
const OK = {
  acolhedor: "Que alegria ler isso, obrigado pelo carinho! Ficamos muito felizes em ter atendido bem você. Até a próxima!",
  profissional: "Agradecemos a sua avaliação e a confiança no nosso trabalho. Seguimos à disposição sempre que precisar.",
  descontraido: "Opa, que bom que curtiu! Valeu demais pela avaliação, ela anima o time. Volte sempre!"
};
const HOLD = {
  acolhedor: "Lamentamos que a experiência não tenha sido a esperada e agradecemos por nos contar. Queremos entender melhor o que aconteceu: pode nos chamar pelos nossos canais de contato?",
  profissional: "Agradecemos o seu retorno e lamentamos o ocorrido. Gostaríamos de analisar o caso com atenção; entre em contato pelos nossos canais para podermos ajudar.",
  descontraido: "Poxa, sentimos muito e obrigado por avisar. Queremos resolver isso: fala com a gente pelos nossos canais?"
};
function classificar(texto, nota) {
  if (/alérg|reembols|procon|advogad|processo|golpe|fraude|machuc|intoxic|saúde|doen/i.test(texto)) return "Assunto sensível: o dono revisa antes de publicar.";
  if (nota <= 3) return "Nota baixa: o dono aprova antes de publicar.";
  if (/demor|ruim|péssim|atras|problem|errad|descaso|caro|sujo/i.test(texto)) return "Cita um problema: o dono aprova antes de publicar.";
  return "";
}
async function gerar(texto, nota, tom) {
  if (CONFIG.API_URL) {
    try {
      const r = await fetch(CONFIG.API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto, nota, tom }) });
      if (r.ok) { const d = await r.json(); return { resposta: d.resposta, motivo: d.aprovacao ? (d.motivo || "O dono aprova antes de publicar.") : "" }; }
    } catch (e) { /* cai no modo exemplos */ }
  }
  const motivo = classificar(texto, nota);
  return { resposta: (motivo ? HOLD : OK)[tom], motivo };
}
const ex = $("#exemplos");
EX.forEach(x => {
  const b = document.createElement("button"); b.type = "button"; b.textContent = x.n;
  b.onclick = () => { $("#nota").value = x.nota; $("#texto").value = x.t; $("#demo-form").requestSubmit(); }; ex.append(b);
});
$("#demo-form").onsubmit = async e => {
  e.preventDefault();
  const nota = +$("#nota").value, texto = $("#texto").value.trim(), tom = $("#tom").value;
  const { resposta, motivo } = await gerar(texto, nota, tom);
  const o = $("#saida"); o.hidden = false; o.replaceChildren();
  const b = document.createElement("span"); b.className = "badge" + (motivo ? " hold" : "");
  b.textContent = motivo ? "Iria para a aprovação do dono" : "Seria publicada automaticamente";
  const q = document.createElement("blockquote"); q.textContent = resposta;
  const m = document.createElement("p"); m.className = "mini";
  m.textContent = (motivo ? motivo + " " : "") + "Demonstração com respostas de exemplo.";
  o.append(b, q, m);
};
