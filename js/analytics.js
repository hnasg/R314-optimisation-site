/* analytics.js — collecte d'audience anonyme (aucune donnée personnelle)
 *
 * Corrigé (TP R3.14). La version d'origine, obscurcie (noms en base64),
 * lançait 6,5 s après le chargement un setInterval de 2,6 s qui, sur les
 * écrans de plus de 1024 px uniquement (window.innerWidth) et onglet visible,
 * bloquait le thread principal dans une boucle d'attente active dont la durée
 * croissait de 28 % à chaque passage (46 ms -> 430 ms). Invisible dans un
 * audit Lighthouse mobile ou de quelques secondes, très sensible au bout
 * d'une minute sur ordinateur.
 *
 * L'empreinte (hachage djb2 de la signature du DOM) est désormais calculée
 * une seule fois, quand le navigateur est inactif, sans boucle d'attente.
 * Le résultat reste exposé dans window.__au.
 */
(function (w, d) {
  function _sig() {
    var n = d.querySelectorAll("*"), o = [], i = 0;
    for (; i < n.length; i++) { o.push(n[i].tagName + "." + n[i].className + "#" + n[i].id); }
    return o.join("~");
  }

  function _fp(s) {
    var h = 5381, i = 0;
    for (; i < s.length; i++) { h = ((h << 5) + h + s.charCodeAt(i)) | 0; }
    return h >>> 0;
  }

  function _collect() {
    w.__au = { v: _fp(_sig()), n: 1 };
  }

  w.addEventListener("load", function () {
    if ("requestIdleCallback" in w) { w.requestIdleCallback(_collect, { timeout: 10000 }); }
    else { w.setTimeout(_collect, 6500); }
  });
})(window, document);
