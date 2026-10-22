/**
 * Removes DOM attributes injected by browser extensions before React hydrates.
 *
 * Adblockers, translators, and VPN tools add markers such as
 * `bis_skin_checked` or `__processed_<uuid>__` to every element. React then
 * compares the server HTML against a DOM it did not render and reports a
 * hydration mismatch for the whole tree, even though the app markup is
 * identical.
 *
 * This must run as a plain inline script, not a `useEffect`: effects run after
 * hydration, which is too late. A MutationObserver keeps stripping markers
 * that the extension injects later, and disconnects itself after a short
 * window so it does not sit in the page forever.
 */
export default function HydrationGuard() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){
  try {
    var ATTRS = ["bis_skin_checked", "bis_register"];
    var strip = function(root) {
      var nodes = (root || document).querySelectorAll("*");
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        for (var a = 0; a < ATTRS.length; a++) {
          if (el.hasAttribute(ATTRS[a])) el.removeAttribute(ATTRS[a]);
        }
        if (el.attributes) {
          for (var j = el.attributes.length - 1; j >= 0; j--) {
            var name = el.attributes[j].name;
            if (name.indexOf("__processed_") === 0) el.removeAttribute(name);
          }
        }
      }
    };
    strip(document);
    var obs = new MutationObserver(function(muts){
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === "attributes" && m.attributeName) {
          var n = m.attributeName;
          if (ATTRS.indexOf(n) !== -1 || n.indexOf("__processed_") === 0) {
            m.target.removeAttribute(n);
          }
        } else if (m.addedNodes && m.addedNodes.length) {
          for (var k = 0; k < m.addedNodes.length; k++) {
            var node = m.addedNodes[k];
            if (node.nodeType === 1) strip(node.parentNode || node);
          }
        }
      }
    });
    obs.observe(document.documentElement, {
      subtree: true, childList: true, attributes: true
    });
    setTimeout(function(){ obs.disconnect(); }, 6000);
  } catch (e) {}
})();`,
      }}
    />
  );
}
