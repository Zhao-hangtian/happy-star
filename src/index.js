/// <reference types="vite/client" />

import styles from "./style.css?inline";
import App from "./app.js";

/**
 * Register it before joining room:
 * ```js
 * WindowManager.register({
 *   kind: "Counter",
 *   src: Counter
 * })
 * ```
 * Then you can use it in your room:
 * ```js
 * manager.addApp({ kind: 'Counter' })
 * ```
 * Read more about how to make a netless app here:
 * https://github.com/netless-io/window-manager/blob/master/docs/develop-app.md
 *
 * @type {import("@netless/window-manager").NetlessApp}
 */

const ChineseIdiomsPuzzle = {
  kind: "成语解谜",
  setup(context) {
    const box = context.getBox();
    box.mountStyles(styles);

    const $content = document.createElement("div");
    $content.className = "app-idioms";
    $content.style = "position: relative;";
    box.mountContent($content);

    const app = new App(context);
    $content.appendChild(app.app.view).className = "app-idioms-scene";
  },
};

export default ChineseIdiomsPuzzle;
