// Modo escuro compartilhado por todas as páginas (carregado no <head> para não piscar)
(function () {
  var r = document.documentElement, saved = null;
  try { saved = localStorage.getItem("tema"); } catch (e) { }
  var mq = matchMedia("(prefers-color-scheme: dark)");
  function aplicar(t) {
    r.dataset.theme = t;
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = t === "dark" ? "#0D1A2B" : "#F4F7FA";
    var b = document.getElementById("tema");
    if (b) b.textContent = t === "dark" ? "☀️" : "🌙";
  }
  aplicar(saved || (mq.matches ? "dark" : "light"));
  mq.addEventListener && mq.addEventListener("change", function (e) { if (!saved) aplicar(e.matches ? "dark" : "light"); });
  document.addEventListener("DOMContentLoaded", function () {
    aplicar(r.dataset.theme);
    var b = document.getElementById("tema");
    if (b) b.onclick = function () {
      var n = r.dataset.theme === "dark" ? "light" : "dark";
      saved = n; aplicar(n);
      try { localStorage.setItem("tema", n); } catch (e) { }
    };
  });
})();
