import * as PIXI from 'pixi.js';
import * as config from './config'

import {
    throttle
} from 'throttle-debounce' // 节流（throttle）和去抖（debounce）

export default class App {

    constructor(options) {
        const app = new PIXI.Application(options);
        this.app = app;
        this.viewRect = config.viewRect;
        PIXI.utils.EventEmitter.call(this);

        var resizeObserver = new ResizeObserver(

            throttle(300, (entries) => {
                for (let entry of entries) {
                    const cr = entry.contentRect;
                    // console.log(`Element size: ${cr.width}px & ${cr.height}px`);
                    this.autoResize(cr.width, cr.height);
                }
            })
        );

        // 观察一个或多个元素
        resizeObserver.observe(document.querySelector('.telebox-content-wrap'));


        //layers of the game
        const layers = {
            back: new PIXI.Container(),
            scene: new PIXI.Container(),
            ui: new PIXI.Container()
        }

        app.loader.add('bunny', 'src/bunny.png').load((loader, resources) => {
            // This creates a texture from a 'bunny.png' image
            

            const container = new PIXI.Container();
            app.stage.addChild(container);

            for (let i = 0; i < 25; i++) {
                const bunny = new PIXI.Sprite(resources.bunny.texture);
                bunny.anchor.set(0.5);
                bunny.x = (i % 5) * 40;
                bunny.y = Math.floor(i / 5) * 40;
                container.addChild(bunny);
            }

            container.x = app.screen.width / 2;
            container.y = app.screen.height / 2;

            // Center bunny sprite in local container coordinates
            container.pivot.x = container.width / 2;
            container.pivot.y = container.height / 2;

            // Listen for animate update
            app.ticker.add((delta) => {
                // rotate the container!
                // use delta to create frame-independent transform
                container.rotation -= 0.01 * delta;
            });
        });

        this.autoResize(this.viewRect)
    }

    autoResize(width, height) {
        console.log("window size changed: width:", width, "height:", height)

        let viewRect = Object.assign({
            x: 0,
            y: 0,
            width: width,
            height: height
        }, this.viewRect)

        const defaultRatio = this.app.view.width / this.app.view.height
        const windowRatio = viewRect.width / viewRect.height

        let newWidth
        let newHeight

        //autofit by width or height
        if (windowRatio < defaultRatio) {
            newWidth = viewRect.width
            newHeight = viewRect.width / defaultRatio
        } else {
            newHeight = viewRect.height
            newWidth = viewRect.height * defaultRatio
        }

        newHeight = newWidth > newHeight ? newHeight - 10 : newHeight;

        let x = viewRect.x + (viewRect.width - newWidth) / 2
        let y = viewRect.y + (viewRect.height - newHeight) / 2

        // console.log(`app-idioms size: ${newWidth}px & ${newHeight}px`);

        document.querySelectorAll('.app-idioms-scene').forEach(item => {
            item.style.marginLeft = `${x}px`
            item.style.marginTop = `${y}px`
            item.style.width = `${newWidth}px`
            item.style.height = `${newHeight}px`
            console.log("item style", item.style.left, item.style.top, item.style.width, item.style.height)
        })

    }
}