import { Container, Graphics, Sprite, Text } from "pixi.js";

import { backendAddress } from "./config";
import Swal from "sweetalert2";
import Idiom from "./idioms";
import { getRandomString } from "./app.js";

const WINNER_WORDS = [
  "百伶百俐",
  "百龙之智",
  "辨日炎凉",
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
  "学富五车",
  "知识渊博",
  "才高八斗",
  "多才多艺",
  "博古通今",
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
  "",
];

const BUTTON_TOPS = { HEIGHT: 60, WIDTH: 150 };
const SUMMIT_POS = { X: -350, Y: -630 };
const RESET_POS = { X: -150, Y: -630 };
const ANS_POS = { X: 50, Y: -630 };

/**
 * scene of the game
 */
export default class Scene extends Container {
  constructor(app) {
    super();
    this.app = app;
    this.app.$scene = this;
    this.customTarget = "#" + this.app.appId
    console.log("customTarget", this.customTarget)

    this.$submitButton = this.getNewButton("提交", SUMMIT_POS.X, SUMMIT_POS.Y);
    this.$submitButton
      .on("pointertap", () => {
        const answer = this.$idiom.$pieces.children
          .filter((piece) => piece.children[0].children[0] != null)
          .map((piece) => ({
            char: piece.children[0].children[0]._text,
            x: piece.col,
            y: piece.row,
          }));

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

        if (this.app.storage.state.submitLock === true) {
          this._submitError("其他玩家正在提交");
          return;
        }
        this.app.storage.setState({
          submitLock: true,
        });
        fetch(`https://${backendAddress}/idioms/CheckIdioms`, requestOptions)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
            // 通关
            if (data["code"] === 0 && data["data"] === true) {
              let newToken = getRandomString();
              // 周知进入下一关
              this.app.context.dispatchMagixEvent("eventOp", {
                trigger: "win",
                newToken: newToken,
              });
            } else {
              this._wrong();
            }
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            this.app.storage.setState({
              submitLock: false,
            });
          });
      })
      .on("pointerup", () => {})
      .on("pointerupoutside", () => {})
      .on("pointerover", () => {
        this.$submitButton.texture = this.$submitButton.overTexture;
      })
      .on("pointerout", () => {
        this.$submitButton.texture = this.$submitButton.normalTexture;
      });
    this.addChild(this.$submitButton);

    // 重置
    this.$resetBotton = this.getNewButton("重置", RESET_POS.X, RESET_POS.Y);
    this.$resetBotton
      .on("pointertap", () => {
        this.app.context.dispatchMagixEvent("eventOp", { trigger: "reset" });
      })
      .on("pointerover", () => {
        this.$resetBotton.texture = this.$resetBotton.overTexture;
      })
      .on("pointerout", () => {
        this.$resetBotton.texture = this.$resetBotton.normalTexture;
      });
    this.addChild(this.$resetBotton);

    // 答案
    this.$answer_botton = this.getNewButton("答案", ANS_POS.X, ANS_POS.Y);
    this.$answer_botton
      .on("pointertap", () => {
        console.log("获取正确答案");
        this.ans();
      })
      .on("pointerdown", () => {
        console.log("DOWN!")
        this.$answer_botton.texture.tint = 0x666666;
      })
      .on("pointerup", () => {
        console.log("UP!")
        this.$answer_botton.texture.tint = 0x000000;
      })
      .on("pointerover", () => {
        this.$answer_botton.texture = this.$answer_botton.overTexture;
      })
      .on("pointerout", () => {
        this.$answer_botton.texture = this.$answer_botton.normalTexture;
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

    const eventOpDisposer = this.app.context.addMagixEventListener(
      "eventOp",
      (msg) => {
        console.log("eventOp", msg);
        if (msg.payload.trigger === "win") {
          this.win(msg.payload.newToken);
        }
        if (msg.payload.trigger === "reset") {
          this.reset();
        }
      }
    );

    const dispose = this.app.storage.addStateChangedListener(() => {
      for (const piece of this.$idiom.$pieces.children) {
        let state = this.app.storage.state[piece.id];
        if (state !== undefined) {
          load_piece_state(state, piece);
        }
      }
    });

    this.app.context.emitter.on("destroy", () => {
      eventOpDisposer();
      dispose();
    });

    this.addChild(this.$answerView);
  }

  reset() {
    Swal.fire({
      icon: "success",
      title: "重置完成",
      target: this.customTarget,
      customClass: {
        container: "position-absolute",
      },
      toast: true,
      showConfirmButton: false,
      timer: 800,
    });
    this.$idiom.reset();
  }

  _submitError(text) {
    Swal.fire({
      icon: "error",
      title: "提交失败",
      text: text,
      target: this.customTarget,
      customClass: {
        container: "position-absolute",
      },
      toast: true,
      showConfirmButton: false,
      timer: 800,
    });
  }

  _wrong() {
    Swal.fire({
      icon: "error",
      title: "Oh...就差一点点！",
      text: "让我们再试一试!",
      target: this.customTarget,
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
      target: this.customTarget,
      customClass: {
        container: "position-absolute",
      },
      toast: true,
      html:
        "在下真是<b>" +
        randomChoice(WINNER_WORDS)
        +"</b>"+ randomChoice(MODAL_PARTICLE)+"<p>(即将进入下一关<t></t>ms)",
      confirmButtonText:
        randomChoice(WINNER_CONFIRM_WORDS) + randomChoice(MODAL_PARTICLE),
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        const b = Swal.getHtmlContainer().querySelector("t");
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft();
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        // console.log("closed by the timer");
      }
      this.app.storage.setState({
        token: newToken,
        level: this.app.storage.state.level + 1,
      });
  
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
      this.ansText = undefined;
    });
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
        // console.log("aa", randomChoice(ANS_WORDS));
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

  getNewButton(text, x, y) {
    const buttonOver = new Graphics();
    buttonOver.lineStyle(8, 0xff0000, 0.5);
    buttonOver.beginFill(0xAABBCC, 0.8);
    buttonOver.drawRoundedRect(0, 0, BUTTON_TOPS.WIDTH, BUTTON_TOPS.HEIGHT, 16);
    buttonOver.endFill();

    const buttonNormal = new Graphics();
    buttonNormal.lineStyle(8, 0x2273e6, 0.5);
    buttonNormal.beginFill(0xffffff, 0.5);
    buttonNormal.drawRoundedRect(
      0,
      0,
      BUTTON_TOPS.WIDTH,
      BUTTON_TOPS.HEIGHT,
      16
    );
    buttonNormal.endFill();
    let normalTexture = this.app.renderer.generateTexture(buttonNormal);
    let buttonSprite = Sprite.from(normalTexture);
    const buttonText = new Text(text, {
      fontFamily: "Arial",
      fontSize: 48,
      fill: 0x000000,
      align: "center",
    });
    buttonText.x = buttonSprite.x + (buttonSprite.width - buttonText.width)*0.5 ;
    buttonText.y = buttonSprite.y + 0.1 * buttonSprite.height;
    buttonText.height = 0.8 * buttonSprite.height;
    buttonSprite.x = x;
    buttonSprite.y = y;
    buttonSprite.addChild(buttonText);
    buttonSprite.interactive = true;
    buttonSprite.buttonMode = true;
    buttonSprite.overTexture = this.app.renderer.generateTexture(buttonOver);
    buttonSprite.normalTexture = normalTexture;
    return buttonSprite;
  }
}

export function load_piece_state(state, piece) {
  piece.x = state.x;
  piece.y = state.y;
  piece.col = state.col;
  piece.row = state.row;
  piece.interactive = state.interactive;
  piece.alpha = state.alpha;
}

export function save_piece_state(storage, piece) {
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
