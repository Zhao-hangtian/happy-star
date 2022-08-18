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


const Counter = {
  kind: "Counter",
  setup(context) {
    const box = context.getBox();
    box.mountStyles(styles);

    const $content = document.createElement("div");
    $content.className = "app-idioms";
    box.mountContent($content);

    // add pixijs app
    // const app = new PIXI.Application();
    const app = new App()
    // console.log("123", app.app)
    $content.appendChild(app.app.view).className = "app-idioms-scene";
    // app.loader.add('bunny', 'src/bunny.png').load((loader, resources) => {

    //   // This creates a texture from a 'bunny.png' image.
    //   const bunny = new PIXI.Sprite(resources.bunny.texture);

    //   // Setup the position of the bunny
    //   bunny.x = app.renderer.width / 2;
    //   bunny.y = app.renderer.height / 2;

    //   // Rotate around the center
    //   bunny.anchor.x = 0.5;
    //   bunny.anchor.y = 0.5;

    //   bunny.interactive = true;
    //   // Shows hand cursor
    //   bunny.buttonMode = true;
    //   // Pointers normalize touch and mouse
    //   bunny.on('pointerdown', () => {
    //     bunny.scale.x *= 1.25;
    //     bunny.scale.y *= 1.25;
    //   });

      // Add the bunny to the scene we are building.
    //   app.stage.addChild(bunny);

    //   // Listen for frame updates
    //   app.ticker.add(() => {
    //     // each frame we spin the bunny around a bit
    //     bunny.rotation += 0.01;
    //   });
    // });

    // const $button = document.createElement("button");
    // $content.appendChild($button);

    // const storage = context.createStorage("counter", { count: 0 });
    // $button.onclick = ev => {
    //   storage.setState({ count: storage.state.count + (ev.shiftKey ? -1 : 1) });
    // };

    // function refresh() {
    //   $button.textContent = String(storage.state.count);
    // }

    // const dispose = storage.addStateChangedListener(refresh);
    // refresh();

    // context.emitter.on("destroy", () => {
    //   dispose();
    // });
  },
};

export default Counter;
