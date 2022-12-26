import ShadowsIntoLight from "../assets/fonts/Shadows Into Light.woff2";
import Montserrat from "../assets/fonts/Montserrat.woff2";
import RubikGemstones from "../assets/fonts/Rubik Gemstones.woff2";
import Sevillana from "../assets/fonts/Sevillana.woff2";
import Rubik80sFade from "../assets/fonts/Rubik 80s Fade.woff2";
import RubikPuddles from "../assets/fonts/Rubik Puddles.woff2";

export function loadFonts() {
  var fontA = new FontFace("Shadows Into Light", `url('${ShadowsIntoLight}')`);
  var fontB = new FontFace("Montserrat", `url('${Montserrat}')`);
  var fontC = new FontFace("Rubik Gemstones", `url('${RubikGemstones}')`);
  var fontD = new FontFace("Sevillana", `url('${Sevillana}')`);
  var fontE = new FontFace("Rubik 80s Fade", `url('${Rubik80sFade}')`);
  var fontF = new FontFace("Rubik Puddles", `url('${RubikPuddles}')`);

  Promise.all([
    fontA.load(),
    fontB.load(),
    fontC.load(),
    fontD.load(),
    fontE.load(),
    fontF.load(),
  ]).then(function () {
    document.fonts.add(fontA);
    document.fonts.add(fontB);
    document.fonts.add(fontC);
    document.fonts.add(fontD);
    document.fonts.add(fontE);
    document.fonts.add(fontF);
  });
}
