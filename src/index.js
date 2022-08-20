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
    // $content.style.cssText = "width: 100%; height: 100%; padding: 0; margin: 0; overflow: hidden; background: #e9dfc4; background: -moz-linear-gradient(left, #e9dfc4 0%, #e9dfc4 1%, #ede3c8 2%, #ede3c8 24%, #ebddc3 25%, #e9dfc4 48%, #ebddc3 49%, #e6d8bd 52%, #e6d8bd 53%, #e9dbc0 54%, #e6d8bd 55%, #e6d8bd 56%, #e9dbc0 57%, #e6d8bd 58%, #e6d8bd 73%, #e9dbc0 74%, #e9dbc0 98%, #ebddc3 100%); background: -webkit-gradient(linear, left top, right top, color-stop(0%, #e9dfc4), color-stop(1%, #e9dfc4), color-stop(2%, #ede3c8), color-stop(24%, #ede3c8), color-stop(25%, #ebddc3), color-stop(48%, #e9dfc4), color-stop(49%, #ebddc3), color-stop(52%, #e6d8bd), color-stop(53%, #e6d8bd), color-stop(54%, #e9dbc0), color-stop(55%, #e6d8bd), color-stop(56%, #e6d8bd), color-stop(57%, #e9dbc0), color-stop(58%, #e6d8bd), color-stop(73%, #e6d8bd), color-stop(74%, #e9dbc0), color-stop(98%, #e9dbc0), color-stop(100%, #ebddc3)); background: -webkit-linear-gradient(left, #e9dfc4 0%, #e9dfc4 1%, #ede3c8 2%, #ede3c8 24%, #ebddc3 25%, #e9dfc4 48%, #ebddc3 49%, #e6d8bd 52%, #e6d8bd 53%, #e9dbc0 54%, #e6d8bd 55%, #e6d8bd 56%, #e9dbc0 57%, #e6d8bd 58%, #e6d8bd 73%, #e9dbc0 74%, #e9dbc0 98%, #ebddc3 100%); background: -o-linear-gradient(left, #e9dfc4 0%, #e9dfc4 1%, #ede3c8 2%, #ede3c8 24%, #ebddc3 25%, #e9dfc4 48%, #ebddc3 49%, #e6d8bd 52%, #e6d8bd 53%, #e9dbc0 54%, #e6d8bd 55%, #e6d8bd 56%, #e9dbc0 57%, #e6d8bd 58%, #e6d8bd 73%, #e9dbc0 74%, #e9dbc0 98%, #ebddc3 100%); background: -ms-linear-gradient(left, #e9dfc4 0%, #e9dfc4 1%, #ede3c8 2%, #ede3c8 24%, #ebddc3 25%, #e9dfc4 48%, #ebddc3 49%, #e6d8bd 52%, #e6d8bd 53%, #e9dbc0 54%, #e6d8bd 55%, #e6d8bd 56%, #e9dbc0 57%, #e6d8bd 58%, #e6d8bd 73%, #e9dbc0 74%, #e9dbc0 98%, #ebddc3 100%); background: linear-gradient(to right, #e9dfc4 0%, #e9dfc4 1%, #ede3c8 2%, #ede3c8 24%, #ebddc3 25%, #e9dfc4 48%, #ebddc3 49%, #e6d8bd 52%, #e6d8bd 53%, #e9dbc0 54%, #e6d8bd 55%, #e6d8bd 56%, #e9dbc0 57%, #e6d8bd 58%, #e6d8bd 73%, #e9dbc0 74%, #e9dbc0 98%, #ebddc3 100%); /* background-size: 120px; */ background-repeat: repeat;";
    box.mountContent($content);

    // add pixijs app
    // const app = new PIXI.Application();
    
    let soundImg = document.createElement("img");
    soundImg.src = "data:image/png;base64,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"
    soundImg.style = "display:none;"
    $content.appendChild(soundImg)

    let muteImg = document.createElement("img");
    muteImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAFP0lEQVR4nO2dTWhdRRiGH2NJFG1jVNCFFSKIYm1FF0YtKIKYlehOKC4EK91YNxWbVe1CF7UiClpxJ7hxY1FBtPiDWBVEECEK/hSLiErR+hOtpsY0Li5Hw8k5551zzsw3k5t5YDZ37nzznnnvN3N+5t4LmUwmk8lkMplMJpMx5fQebWeABeA7T1oyLdgLLAG/AtdF1rLmKAa/KNkEQ8qDb23CXoM+kqVu8K1MKPpfk8zQPPjLTZgK0P9y81NgD3CnZYfXAMdxN8FnJpQzLzaFnr+BacuOY5hQNe3FpKznBHC9pYApBoNrMR3VrTmxqNNzDJi0FGKRCU0LfgzUCchHwKiloJCZcKuIZ819Qk9RHrcWFjITHmmIZc1FwDcNeopyCrjDWlzITNhfEycGm3D7sB0HLrAWZ21CLLYC8xV6yuW5GOIsp6OY7EQf3yngphjirEyIzYvo45sF1sUQZzEdhWIbbqeS5wBH0ce3I4xMTehMCEFxnn8Qt4dU0+hj+5pIWQC2V8x9KV9k7Xds9zL62O7yLbYNq8GEuivcbQ5tJ4E/a9oX5VPgNO+qW5CyCU23F+aASxxi7GuIUZTbfAtvyxTwF2mZoO7tLAGHgRER50L0sR30L78dLgfbZ2HuwtOOWu5xiHVAxDgJnOtXvjttB98qE9YBrzro+BEYF7EmgX9EnHu9H4EDXQffyoT1wBEHHQ85xHpDxHjHs3ZJ38G3MuEG9Kf3F2CDiHO3iLEITPiXX42vwbcy4TEHDTtFjA3oU9LbuwrcDDzJ4Jz2DwexIUpIEyaAn0X/nznEeUnEaP3AZozBCr8oAg+DCS7bbi4XMe4X7T9uI2gMeNtB1LCYMIGeQnaLGFtE+0X0GdV/PCOCDaMJz4t+3xftR4CfRIxrXYRsJp1px9IEtRlgEThfxHhNxFhxc67qUnt7zespMQ4cwu8V87sMbivUMcJgmmniK1F/aVXQMreIIKkwDryOv0yYR08zV4j6L0X9ZeUXqgzYKIKkRJEJvkxQZyp9Dbi4/EKVAetFkNTwacLnol4Z8IOoXzG2qc/1rvgy4YioV4vw76J+aA0APwvznKgfE/XKgLPLLwyTAfD/wtzVhBOi/gxRv6YzoKDP2dGSqD9T1KvnvyvGezUa8JvDe7quCepWwYKoVycw8+UXVqMB04QzQX3Cvxf1rQ2oIvZtBlUg7OavhxtivSLaXiW0fOEiYE4EiV0KQm55ebQmzrOindoxd7jcoGoK+raF0Jh8SLjp6EGqd8gdFe1W3Gooccyl8yeI/yl3yYACy63xN4r3q+0u+1w6vRL9oDolA8BmV/Y8epF+U/Ttss8IcN+4lIoBEN6E98R7XB7IbHXtcBR4SwRLzQAIa8LVDvVN/S0AZ7Xoj1HgKdKbjhSxNgQ/IPr6pGvgTQy2VMwyuNeRugEQxwT1OPKAhz6c2C2EWBgAtr9tMY7eVWH6HeKQJrTByoQdIvYCLbak+CKUCW2xMOEDEfdQh5he8L1PtIsBEHZN2Mjgu8FNMbd31O0F3yZ0JaQJTV9VOgmc10O3F3xOR32I8QMjL/TU7A1fJvTF2oSbPWj2ho/pyAdWt7Jnifw11Sr6ZoIvLDIh6he1m+iTCT4JmQm7iPhTBS50zQTfxPxJzuh0MSEE2YQWJRTZBMcSkmyCQwlNNkEUC7IJDcWKbEJNsSSbUFGsySYQ1wDIJkQ3ANa4Can8hUmbe0czkTQGo8iE2LhkgsuPPK1KUvkbq6ZMSEXj0FOVCUP7yU+V5SbkwY/EFEO44GYymUwmk8lkMpnM0PIv4hjfvxTmy2kAAAAASUVORK5CYII="
    muteImg.style = "display:none;"
    $content.appendChild(muteImg)



    const app = new App(context)
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

    
  },
};

export default ChineseIdiomsPuzzle;
