const ThemeScript = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(){try{var t=localStorage.getItem("theme");var m=window.matchMedia("(prefers-color-scheme: dark)").matches;if(t==="dark"||(!t&&m)){document.documentElement.setAttribute("data-theme","dark")}}catch(e){}})();`,
    }}
  />
);

export default ThemeScript;
