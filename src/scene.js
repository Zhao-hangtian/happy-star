import {
  Container,
  filters,
  Texture,
  Graphics,
  Sprite,
  Text,
  TextStyle,
  BaseTexture,
} from "pixi.js";

import { backendAddress } from "./config";
import Swal from "sweetalert2";
import Idiom from "./idioms";
import { getRandomString } from "./app.js";

const WINNER_WORDS = [
  "百伶百俐",
  "百龙之智",
  "辨日炎凉",
  "别具慧眼",
  "冰雪聪明",
  "聪慧绝伦",
  "聪明出众",
  "聪明绝顶",
  "聪明绝世",
  "聪明伶俐",
  "聪明睿达",
  "聪明睿知",
  "福慧双修",
  "福至性灵",
  "慧心灵性",
  "慧心巧思",
  "锦心绣肠",
  "精明能干",
  "精明强干",
  "绝顶聪明",
  "兰质蕙心",
  "敏而好学",
  "目达耳通",
  "七窍玲珑",
  "七行俱下",
  "剔透玲珑",
  "胸中之颖",
  "秀外惠中",
  "秀外慧中",
  "颖悟绝伦",
  "颖悟绝人",
  "至知不谋",
  "卓荦强识",
  "足智多谋",
];
const ANS_WORDS = [
  "我晓得",
  "俺知道",
  "朕知道",
  "朕懂",
  "原来如此",
  "了解",
  "懂",
  "知",
  "OK",
  "我知道",
];
const WINNER_CONFIRM_WORDS = [
  "十拿九稳",
  "踌躇满志",
  "信而有征",
  "雄心万丈",
  "得心应手",
  "胜券在握",
  "人定胜天",
  "稳操胜券",
  "志在必得",
  "满怀信心",
  "从容不迫",
  "手到擒来",
  "胸有成竹",
  "坚持不懈",
  "成竹在胸",
  "气定神闲",
];

const MODAL_PARTICLE = [
  "啦",
  "了",
  "呢",
  "嘛",
  "的",
  "也",
  "矣",
  "乎",
  "然",
  "焉",
  "耳",
  "尔",
];

const BUTTON_TOPS = { height: 60, width: 115 };
const SUMMIT_POS = { x: -300, y: -630 };
const RESET_POS = { x: -150, y: -630 };
const ANS_POS = { x: 0, y: -630 };

/**
 * scene of the game
 */
export default class Scene extends Container {
  constructor(app) {
    super();
    this.app = app;
    this.app.$scene = this;

    // 提交按键
    this.$summit_rect = this.getButton("提交", SUMMIT_POS.x, SUMMIT_POS.y);
    this.$summit_rect
      .on("pointerdown", () => {
        console.log(this.$idiom.$pieces.children);

        let answer = [];
        this.$idiom.$pieces.children.forEach((piece) => {
          if (piece.children[0].children[0] != null) {
            answer.push({
              char: piece.children[0].children[0]._text,
              x: piece.col,
              y: piece.row,
            });
          }
        });

        console.log("提交答案内容", answer);
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answer: answer,
            x0: this.$idiom.x0,
            y0: this.$idiom.y0,
            token: this.app.storage.state.token,
          }),
          redirect: "follow",
          mode: "cors",
        };

        // console.log(raw)

        fetch(`https://${backendAddress}/idioms/CheckIdioms`, requestOptions)
          .then((response) => {
            console.log(response);
            return response.json();
          })
          .then((data) => {
            console.log(data);
            // 通关
            if (data["code"] === 0 && data["data"] === true) {
              let newToken = getRandomString(
                256,
                "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
              );
              this.app.context.dispatchMagixEvent("event1", {
                trigger: "win",
                newToken: newToken,
              });
            } else {
              this._wrong();
            }
            // this._createPieces(data['data']['table'], data['data']['candidates'])
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .on("pointerup", () => {})
      .on("pointerupoutside", () => {})
      .on("pointerover", () => {
        this.$summit_rect.texture = this.$summit_rect.over_texture;
      })
      .on("pointerout", () => {
        this.$summit_rect.texture = this.$summit_rect.normal_texture;
      });
    this.addChild(this.$summit_rect);

    // 重置
    this.$reset_botton = this.getButton("重置", RESET_POS.x, RESET_POS.y);
    this.$reset_botton
      .on("pointerdown", () => {
        this.app.context.dispatchMagixEvent("event1", { trigger: "reset" });
      })
      .on("pointerover", () => {
        this.$reset_botton.texture = this.$reset_botton.over_texture;
      })
      .on("pointerout", () => {
        this.$reset_botton.texture = this.$reset_botton.normal_texture;
      });
    this.addChild(this.$reset_botton);

    // 答案
    this.$answer_botton = this.getButton("答案", ANS_POS.x, ANS_POS.y);
    this.$answer_botton
      .on("pointerdown", () => {
        console.log("获取正确答案");
        this.ans();
      })
      .on("pointerover", () => {
        this.$answer_botton.texture = this.$answer_botton.over_texture;
      })
      .on("pointerout", () => {
        this.$answer_botton.texture = this.$answer_botton.normal_texture;
      });
    this.addChild(this.$answer_botton);

    this.$answerView = new Text("");

    this.$answerView.x = -398;
    this.$answerView.y = -600;
    this.$answerView.on("pointerdown", () => {
      console.log("close answer");
      this.$answerView.visible = false;
    });
    this.$answerView.visible = false;

    // 渲染
    this.$idiom = new Idiom(app);
    this.addChild(this.$idiom);

    const event1Disposer = this.app.context.addMagixEventListener(
      "event1",
      (msg) => {
        console.log("event1", msg);
        if (msg.payload.trigger === "win") {
          this.win(msg.payload.newToken);
        }
        if (msg.payload.trigger === "reset") {
          this.reset();
        }
      }
    );

    console.log(this.$idiom.$pieces);

    const dispose = this.app.storage.addStateChangedListener(() => {
      for (const piece of this.$idiom.$pieces.children) {
        let state = this.app.storage.state[piece.id];
        if (state !== undefined) {
          // console.log("piece changed", piece)
          _load_piece_state(state, piece);
        }
      }
    });

    // console.log("this.app.storage", this.app.storage.state)
    this.app.context.emitter.on("destroy", () => {
      dispose();
    });

    this.addChild(this.$answerView);
  }

  reset() {
    Swal.fire({
      icon: "success",
      title: "重置完成",
      target: "#custom-target",
      customClass: {
        container: "position-absolute",
      },
      toast: true,
      showConfirmButton: false,
      timer: 800,
    });
    this.$idiom.reset();
  }

  _wrong() {
    Swal.fire({
      icon: "error",
      title: "Oh...就差一点点！",
      text: "让我们再试一试!",
      target: "#custom-target",
      customClass: {
        container: "position-absolute",
      },
      toast: true,
      showConfirmButton: false,
      timer: 800,
    });
  }

  win(newToken) {
    let timerInterval;
    Swal.fire({
      icon: "success",
      title: "通关!",
      target: "#custom-target",
      customClass: {
        container: "position-absolute",
      },
      toast: true,
      html:
        "在下真是<b>" +
        randomChoice(WINNER_WORDS) +
        "</b><p>(即将进入下一关<t></t>ms)",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        // Swal.showLoading();
        const b = Swal.getHtmlContainer().querySelector("t");
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft();
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });

    // this.app.storage.state.token = newToken
    // this.app.storage.state.level += 1
    this.app.storage.setState({
      token: newToken,
      level: this.app.storage.state.level + 1,
    });
    // this.app.token = this.app.storage.state.token

    this.$idiom.destroy({ children: true, texture: true, baseTexture: true });
    this.$idiom = new Idiom(this.app);
    this.addChild(this.$idiom);
    // 清空共享缓存
    for (let i = 0; i < 256; i++) {
      if (this.app.storage.state[i] !== undefined) {
        delete this.app.storage.state[i];
      }
    }

    this.$idiom.reset();
    console.log("new game", this.app.storage.state);
    console.log("开始新一局", this);
  }

  ans() {
    // 优先使用本地缓存，减少接口请求
    if (this.ansText !== undefined) {
      Swal.fire({
        title: "答案解析",
        html: this.ansText,
        // width: 800,
        scrollbarPadding: false,
        showCloseButton: true,
        confirmButtonText:
          randomChoice(ANS_WORDS) + randomChoice(MODAL_PARTICLE),
      });
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: this.app.storage.state.token,
      }),
      redirect: "follow",
      mode: "cors",
    };

    // console.log(raw)

    fetch(`https://${backendAddress}/idioms/getAnswer`, requestOptions)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        let answers = data["data"];
        let text = "";
        for (let key in answers) {
          text +=
            "<h3>" +
            key +
            "</h3>" +
            "(" +
            answers[key]["Pinyin"] +
            ")</p>【解释】" +
            answers[key]["Explanation"] +
            "</p>【出处】" +
            answers[key]["Derivation"] +
            "</p>【例子】" +
            answers[key]["Example"] +
            "</p>";
        }
        console.log("aa", randomChoice(ANS_WORDS));
        Swal.fire({
          title: "答案解析",
          html: text,
          // width: 800,
          scrollbarPadding: false,
          showCloseButton: true,
          confirmButtonText:
            randomChoice(ANS_WORDS) + randomChoice(MODAL_PARTICLE),
        }).then(() => {
          this.ansText = text;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  strInsert(originStr, disNum, insertStr) {
    return originStr.replace(
      new RegExp("(.{" + disNum + "})", "g"),
      "$1" + insertStr
    );
  }

  getButton(text, x, y) {
    const button_over = new Graphics();
    button_over.lineStyle(8, 0xff0000, 0.5);
    button_over.beginFill(0xffffff, 0.5);
    button_over.drawRoundedRect(
      0,
      0,
      BUTTON_TOPS.width,
      BUTTON_TOPS.height,
      16
    );
    button_over.endFill();

    const button_normal = new Graphics();
    button_normal.lineStyle(8, 0x2273e6, 0.5);
    button_normal.beginFill(0xffffff, 0.5);
    button_normal.drawRoundedRect(
      0,
      0,
      BUTTON_TOPS.width,
      BUTTON_TOPS.height,
      16
    );
    button_normal.endFill();
    let normal_texture = this.app.renderer.generateTexture(button_normal);
    let button_sprite = Sprite.from(normal_texture);
    const button_text = new Text(text, {
      fontFamily: "Arial",
      fontSize: 48,
      fill: 0x000000,
      align: "center",
    });
    button_text.x = button_sprite.x + 0.1 * button_sprite.height;
    button_text.y = button_sprite.y + 0.1 * button_sprite.height;
    button_text.height = 0.8 * button_sprite.height;
    button_text.width = 0.8 * button_sprite.width;
    button_sprite.x = x;
    button_sprite.y = y;
    button_sprite.addChild(button_text);
    button_sprite.interactive = true;
    button_sprite.buttonMode = true;
    button_sprite.over_texture = this.app.renderer.generateTexture(button_over);
    button_sprite.normal_texture = normal_texture;
    return button_sprite;
  }
}

export function _load_piece_state(state, piece) {
  piece.x = state.x;
  piece.y = state.y;
  piece.col = state.col;
  piece.row = state.row;
  piece.interactive = state.interactive;
  piece.alpha = state.alpha;
}

export function _save_piece_state(storage, piece) {
  storage.setState({
    [piece.id]: {
      x: piece.x,
      y: piece.y,
      col: piece.col,
      row: piece.row,
      interactive: piece.interactive,
      alpha: piece.alpha,
    },
  });
}

export function randomChoice(array) {
  return array[(Math.random() * array.length) | 0];
}
