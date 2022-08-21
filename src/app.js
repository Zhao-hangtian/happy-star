import * as PIXI from 'pixi.js';
import * as config from './config'
import {_load_piece_state} from './scene'
import Scene from './scene'

import {
    throttle
} from 'throttle-debounce' // 节流（throttle）和去抖（debounce）

export default class App {

    constructor(context) {
        const app = new PIXI.Application({ backgroundAlpha: 0, width: 800, height: 1280 });
        this.app = app;
        this.app.context = context;
        this.app.resizeTo = undefined;
        this.viewRect = config.viewRect;
        PIXI.utils.EventEmitter.call(this);

        // 初始化游戏状态
        let storage = context.storage

        // 广播查看是否已经存在玩家，有则同步状态，否则开始新游戏


        // if (context.storage.state.token === undefined) {
            console.log("current state", storage.state)
            storage.ensureState({
                token: getRandomString(256, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
                randomInts: Array(256).fill(1).map(() => Math.random()),
                level: 1,
            });

        // }

        // if (storage.state.randomInts == undefined) storage.state.randomInts = Array(256).fill(1).map(() => Math.random())

        // this.app.token = storage.state.token;
        // this.app.randomInts = storage.state.randomInts;
        // this.app.level = storage.state.level;
        this.app.storage = storage;


        // function refresh() {
        //     app.token = storage.state.token;
        //     app.randomInts = storage.state.randomInts;
            // for (const piece of app.$scene.$idiom.$pieces.children) {
            //     let state = app.storage.state[piece.id];
            //     if (state !== undefined) {
            //         _load_piece_state(state, piece)
            //     }
            // }
        // }
        // refresh();
        

        // const dispose = storage.addStateChangedListener(refresh);
        // for(let i=0;i<256;i++){
        //     if (app.storage.state[i] !== undefined){
        //         delete app.storage.state[i];
        //     }
        // }

        // context.emitter.on("destroy", () => {
        //     // dispose();
        //     // eventJoinDisposer();
        //     clearTimeout(this.timer);
        // });

        console.log("new initialized, storage", this.app.storage.state)
        var resizeObserver = new ResizeObserver(

            throttle(100, (entries) => {
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

        for (const key in layers) {
            let layer = layers[key]
            app.stage.addChild(layer)
            layer.x = config.width / 2
            layer.y = config.height / 2
        }

        let scene = new Scene(app)
        layers.scene.addChild(scene)
        // scene.start()

        this.autoResize(this.viewRect)

        

        // const eventJoinDisposer = context.addMagixEventListener("eventJoin", msg => {
        //     console.log("eventJoin", msg);
        //     if (msg.payload.data == 'get'){

        //     }
        // });

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

export function getRandomString(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

// Object.assign(App.prototype, PIXI.utils.EventEmitter.prototype)

