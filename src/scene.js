import { Container, filters, Texture, Graphics, Sprite, Text, TextStyle, BaseTexture } from 'pixi.js'
import sound from 'pixi-sound'

import { backendAddress } from "./config";
import Swal from 'sweetalert2'
import Idiom from './idioms'

const STYLE_TIMER = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 46,
    fontWeight: 'bold',
    fill: '#0051ff',
})

//time limit
const TOTAL_TIME = 999 //second

const WINNER_WORDS = ["百伶百俐", "百龙之智", "辨日炎凉", "别具慧眼", "冰雪聪明", "聪慧绝伦", "聪明出众", "聪明绝顶", "聪明绝世", "聪明伶俐", "聪明睿达", "聪明睿知", "福慧双修", "福至性灵", "慧心灵性", "慧心巧思", "锦心绣肠", "精明能干", "精明强干", "绝顶聪明", "兰质蕙心", "敏而好学", "目达耳通", "七窍玲珑", "七行俱下", "剔透玲珑", "胸中之颖", "秀外惠中", "秀外慧中", "颖悟绝伦", "颖悟绝人", "至知不谋", "卓荦强识", "足智多谋"]
const ANS_WORDS = ["我晓得啦", "俺知道了", "朕知道了", "朕懂了", "原来如此", "知了", "OK", "我知道了"]
const WINNER_CONFIRM_WORDS = ["十拿九稳", "踌躇满志", "信而有征", "雄心万丈", "得心应手", "胜券在握", "人定胜天", "稳操胜券", "志在必得", "满怀信心", "从容不迫", "手到擒来", "胸有成竹", "坚持不懈", "成竹在胸", "气定神闲"]

const BUTTON_TOPS = { height: 60, width: 115 }
const SOUND_POS = { x: -400, y: -630 }
const SUMMIT_POS = { x: -300, y: -630 }
const RESET_POS = { x: -150, y: -630 }
const ANS_POS = { x: 0, y: -630 }

//time countdown
let _countdown = TOTAL_TIME

/**
 * scene of the game
 */
export default class Scene extends Container {

    constructor(app) {
        super()
        this.app = app

        //countdown text
        this.$time = new Text(_countdown + '″', STYLE_TIMER)
        this.$time.anchor.set(0.5)
        this.$time.x = 300
        this.$time.y = -600
        this.stop = false;
        this.addChild(this.$time)



        // 静音/取消静音按键
        // const sound_image = ;
        // const mute_image = document.getElementById("mute-img");
        const sound_image = new Texture(new BaseTexture(document.getElementById("sound-img")));
        const mute_image = new Texture(new BaseTexture(document.getElementById("mute-img")));
        this.$sound_mute_button = new Sprite(mute_image);
        this.$sound_mute_button.x = SOUND_POS.x;
        this.$sound_mute_button.y = SOUND_POS.y;
        this.$sound_mute_button.width = 64;
        this.$sound_mute_button.height = 64;
        this.$sound_mute_button.interactive = true;
        this.$sound_mute_button.buttonMode = true;
        this.$sound_mute_button.on('pointerdown', () => {
            sound.volumeAll = 1 - sound.volumeAll;
            if (sound.volumeAll > 0) {
                this.$sound_mute_button.texture = sound_image;
            } else {
                this.$sound_mute_button.texture = mute_image;
            }
        })
        this.addChild(this.$sound_mute_button)

        // 提交按键
        this.$summit_rect = this.getButton("提交", SUMMIT_POS.x, SUMMIT_POS.y);
        this.$summit_rect.on('pointerdown', () => {
            console.log(this.$idiom.$pieces.children)

            let answer = [];
            this.$idiom.$pieces.children.forEach((piece) => {
                if (piece.children[0].children[0] != null) {
                    answer.push({
                        'char': piece.children[0].children[0]._text,
                        'x': piece.col,
                        'y': piece.row
                    })
                }
            })

            console.log("提交结果...", answer)
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "answer": answer,
                    "x0": this.$idiom.x0,
                    "y0": this.$idiom.y0,
                    "token": this.$idiom.token
                }),
                redirect: 'follow',
                mode: 'cors'
            };

            // console.log(raw)

            fetch(`https://${backendAddress}/idioms/CheckIdioms`, requestOptions)
                .then(response => {
                    console.log(response)
                    return response.json()
                })
                .then((data) => {
                    console.log(data)
                    if (data["code"] === 0 && data["data"] === true) {
                        Swal.fire({
                            title: 'Success!',
                            html: '恭喜通关!在下真是<b>' + WINNER_WORDS[Math.random() * WINNER_WORDS.length | 0] + '</b>',
                            icon: 'success',
                            confirmButtonText: WINNER_CONFIRM_WORDS[Math.random() * WINNER_CONFIRM_WORDS.length | 0],

                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload();
                            }
                        })
                        clearInterval(this.timer)
                        app.sound.stop('sound_bg')
                        app.sound.play('sound_win')

                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oh...就差一点点！',
                            text: '让我们再试一试!',
                            showConfirmButton: false,
                            timer: 800
                        })
                    }
                    // this._createPieces(data['data']['table'], data['data']['candidates'])
                })
                .catch((error) => {
                    console.log(error)
                })

        })
            .on('pointerup', () => {
            })
            .on('pointerupoutside', () => {
            })
            .on('pointerover', () => {
                this.$summit_rect.texture = this.$summit_rect.over_texture;
            })
            .on('pointerout', () => {
                this.$summit_rect.texture = this.$summit_rect.normal_texture;
            });
        this.addChild(this.$summit_rect)

        // 重置
        this.$reset_botton = this.getButton("重置", RESET_POS.x, RESET_POS.y);
        this.$reset_botton.on('pointerdown', () => {
            Swal.fire({
                icon: 'success',
                title: '重置完成',
                showConfirmButton: false,
                timer: 800,
            })
            this.$idiom.reset()
        })
            .on('pointerover', () => {
                this.$reset_botton.texture = this.$reset_botton.over_texture;
            })
            .on('pointerout', () => {
                this.$reset_botton.texture = this.$reset_botton.normal_texture;
            });
        this.addChild(this.$reset_botton)


        // 答案
        this.$answer_botton = this.getButton("答案", ANS_POS.x, ANS_POS.y);
        this.$answer_botton.on('pointerdown', () => {
            console.log("获取正确答案")

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "token": this.$idiom.token
                }),
                redirect: 'follow',
                mode: 'cors'
            };

            // console.log(raw)

            fetch(`https://${backendAddress}/idioms/getAnswer`, requestOptions)
                .then(response => {
                    console.log(response)
                    return response.json()
                })
                .then((data) => {
                    console.log(data)
                    let answers = data["data"]
                    let text = "";
                    for (let key in answers) {
                        text += "<h3>" + key + "</h3>" + "(" + answers[key]["Pinyin"] + ")</p>【解释】" + answers[key]["Explanation"] + "</p>【出处】" +
                            answers[key]["Derivation"] + "</p>【例子】" + answers[key]["Example"] + "</p>"
                    }
                    this.stop = true;
                    Swal.fire({
                        title: '答案解析',
                        html: text,
                        // width: 800,
                        scrollbarPadding: false,
                        showCloseButton: true,
                        confirmButtonText: ANS_WORDS[Math.random() * ANS_WORDS.length | 0],
                    }).then((result) => {
                        this.stop = false;
                    })

                })
                .catch((error) => {
                    console.log(error)
                })

        })
            .on('pointerover', () => {
                this.$answer_botton.texture = this.$answer_botton.over_texture;
            })
            .on('pointerout', () => {
                this.$answer_botton.texture = this.$answer_botton.normal_texture;
            });
        this.addChild(this.$answer_botton)

        this.$answerView = new Text("")



        this.$answerView.x = -398;
        this.$answerView.y = -600;
        this.$answerView.on('pointerdown', () => {
            console.log("close answer")
            this.$answerView.visible = false
        })
        this.$answerView.visible = false


        // 渲染
        this.$idiom = new Idiom(app)
        this.addChild(this.$idiom)

        console.log(this.$idiom.$pieces)

        const dispose = this.app.storage.addStateChangedListener(() => {
            console.log("this.app.storage", this.app.storage.state)
            for (const piece of this.$idiom.$pieces.children) {
                let state = this.app.storage.state[piece.id];
                if (state !== undefined) {
                    console.log(piece)
                    this._load_piece_state(state, piece)
                }
            }
        });




        this.addChild(this.$answerView)

    }

    _load_piece_state(state, piece) {
        // storage.setState({[piece.id] : {x:piece.x, y:piece.y, col: piece.col, row: piece.row, currentIndex: piece.currentIndex}})
        piece.x = state.x
        piece.y = state.y
        piece.col = state.col
        piece.row = state.row
        // piece.currentIndex = state.currentIndex
    }



    strInsert(originStr, disNum, insertStr) {
        return originStr.replace(new RegExp("(.{" + disNum + "})", "g"), "$1" + insertStr);
    }

    getButton(text, x, y) {
        const button_over = new Graphics();
        button_over.lineStyle(8, 0xff0000, 0.5);
        button_over.beginFill(0xFFFFFF, 0.5);
        button_over.drawRoundedRect(0, 0, BUTTON_TOPS.width, BUTTON_TOPS.height, 16);
        button_over.endFill();

        const button_normal = new Graphics();
        button_normal.lineStyle(8, 0x2273e6, 0.5);
        button_normal.beginFill(0xFFFFFF, 0.5);
        button_normal.drawRoundedRect(0, 0, BUTTON_TOPS.width, BUTTON_TOPS.height, 16);
        button_normal.endFill();
        let normal_texture = this.app.renderer.generateTexture(button_normal)
        let button_sprite = Sprite.from(normal_texture);
        const button_text = new Text(text, { fontFamily: 'Arial', fontSize: 48, fill: 0x000000, align: 'center' });
        button_text.x = button_sprite.x + 0.1 * button_sprite.height;
        button_text.y = button_sprite.y + 0.1 * button_sprite.height;
        button_text.height = 0.8 * button_sprite.height;
        button_text.width = 0.8 * button_sprite.width;
        button_sprite.x = x
        button_sprite.y = y
        button_sprite.addChild(button_text)
        button_sprite.interactive = true
        button_sprite.buttonMode = true
        button_sprite.over_texture = this.app.renderer.generateTexture(button_over);
        button_sprite.normal_texture = normal_texture;
        return button_sprite
    }

    /**
     * start the game
     */
    start() {
        // 播放bgm
        // this.app.sound.play('sound_bg', true)
        this.timer = setInterval(() => {


            if (this.stop == false) {
                _countdown--
            }
            this.$time.text = _countdown + '″'
            if (_countdown === 0) {
                clearInterval(this.timer)
                // this.app.sound.stop('sound_bg')
                // this.app.sound.play('sound_fail')
                Swal.fire({
                    title: '时间到!',
                    html: '就差一点点啦！下次更好！',
                    icon: 'error',
                    confirmButtonText: '没问题',

                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload();
                    }
                })
            }
            // }
        }, 1000)
    }
}