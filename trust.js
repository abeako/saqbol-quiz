// Saqbol: «Кто мы и как нас проверить» под строкой с озвучкой.
// Живёт вне React-сборки, поэтому переживает пересборку квиза,
// если этот файл и подключение в index.html сохранить.
(function () {
  var TEXT = {
    ru: "Кто мы и как нас проверить →",
    kk: "Біз кімбіз және бізді қалай тексеруге болады →",
  };
  var ID = "saqbol-trust-link";

  function lang() {
    var l = (document.documentElement.lang || "ru").slice(0, 2);
    return l === "kk" ? "kk" : "ru";
  }

  function place() {
    var main = document.querySelector("#root main");
    var footer = main && main.querySelector(":scope > footer");
    var link = document.getElementById(ID);
    if (!footer) {
      if (link) link.remove();
      return;
    }
    if (!link) {
      link = document.createElement("a");
      link.id = ID;
      link.target = "_blank"; // новая вкладка: прогресс квиза не теряется
      link.rel = "opener"; // та же страница сайта: кнопка «назад» на about.html просто закроет вкладку
      link.style.cssText =
        "display:block;width:max-content;max-width:100%;margin:10px auto 0;padding:8px 14px;" +
        "font-size:13px;font-weight:700;text-align:center;text-decoration:underline;" +
        "text-underline-offset:3px;border-radius:999px;";
    }
    var l = lang();
    if (link.textContent !== TEXT[l]) link.textContent = TEXT[l];
    var href = "./about.html?lang=" + l;
    if (link.getAttribute("href") !== href) link.setAttribute("href", href);
    var color = getComputedStyle(footer).color;
    if (link.style.color !== color) link.style.color = color;
    if (footer.nextSibling !== link) footer.after(link);
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      place();
    });
  }

  function start() {
    var root = document.getElementById("root");
    if (!root) return;
    new MutationObserver(schedule).observe(root, { childList: true, subtree: true });
    new MutationObserver(schedule).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang", "data-theme"],
    });
    schedule();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
