import { Container, Graphics, Rectangle, Sprite, Text, } from 'pixi.js'
import Piece from './piece'
import * as config from './config'

//gap between the piece
const GAP_SIZE = 2

/**
 * cut the picture into level * level pieces.
 * caculate the position of the piece, manage interacton of a piece, check the game is ended.
 */
export default class Idiom extends Container {
    constructor(app) {
        super()
        this.app = app
        this.renderer = app.renderer
        //how many step have you moved
        this.pieceId = 0
        this.moveCount = 0

        //layer of the pieces
        this.$pieces = new Container()
        this.$pieces.y = 128
        this.$pieces.x = -4
        this.addChild(this.$pieces)

        //front layer, selected piece will on top of other pieces
        this.$select = new Container()
        this.$select.y = 128
        this.$select.x = -4
        this.addChild(this.$select)

        this.init_table = []
        this._setTable()
    }

    /**
     * check is win the game
     */
    // success() {
    //
    //     //if all pieces is in the right position
    //     // let success = this.$pieces.children.every(piece => piece.currentIndex == piece.targetIndex) && this.$pieces.children.length > 0
    //
    //     // if (success) {
    //         console.log('success', this.moveCount)
    //     // }
    //     clearInterval(timer)
    //         app.sound.stop('sound_bg')
    //         app.sound.play('sound_win')
    //         result.win()
    //
    //     // return success
    // }

    // _randomString(length, chars) {
    //     let result = '';
    //     for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    //     return result;
    // }

    /**
     * shuffle, random create the pieces index
     * index of piece（level=3 3*3 etc.）
     * 0  1  2
     * 3  4  5
     * 6  7  8
     *
     * suffle will return [3,8,6,2,5,1,4,0,7] etc.
     */
    // _shuffle() {

    //     let index = -1
    //     let length = this.level * this.level
    //     const lastIndex = length - 1

    //     const result = Array.from({
    //         length
    //     }, (v, i) => i)

    //     while (++index < length) {
    //         const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))
    //         const value = result[rand]
    //         result[rand] = result[index]
    //         result[index] = value
    //     }
    //     return result
    // }

    _setTable() {
        let headers = new Headers();
        headers.append("Content-Type", "text/plain");

        const raw = `{\"token\": \"${this.app.storage.state.token}\"}`;

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow',
            mode: 'cors'
        };

        fetch(`https://${config.backendAddress}/idioms/getStatus`, requestOptions)
            .then(response => {
                return response.json()
            })
            .then((data) => {
                console.log(data)
                this._createPieces(data['data']['table'], data['data']['candidates'])
            })
            .catch((error) => {
                console.log(error)
            })
        // console.log(response)
        // if (response.get('code')===1){
        //   return response.get('data')
        // }else{
        //   return null
        // }
    }

    /**
     * create pieces
     */
    _createPieces(table, candidates) {
        let maxBlockNumRoot = 10
        // console.log(candidates)
        // 计算偏移量，使得游戏整体居中
        let xMin = maxBlockNumRoot
        let yMin = maxBlockNumRoot
        let xMax = 0
        let yMax = 0
        table.forEach((item) => {
            let x = parseInt(item['pos']['x']);
            let y = parseInt(item['pos']['y']);
            if (x < xMin) {
                xMin = x
            }
            if (y < yMin) {
                yMin = y
            }
            if (x > xMax) {
                xMax = x
            }
            if (y > yMax) {
                yMax = y
            }
        })
        this.x0 = -xMin
        this.y0 = -yMin
        console.log("offset:", this.x0, this.y0)

        let blockSizePadding = config.width / maxBlockNumRoot
        let blockSize = blockSizePadding * 0.9
        let offset_x = (blockSizePadding - blockSize)

        // candidates
        for (let i = 0; i < candidates.length; i++) {
            let row = 12;
            this._addPiece(row + Math.floor(i / maxBlockNumRoot), i % maxBlockNumRoot, 0xFFFFFF,
                candidates[i], blockSize, blockSizePadding, offset_x, true)
        }

        let colors = {};
        table.forEach((item) => {
            let row = parseInt(item['pos']['y']) + this.y0;
            let col = parseInt(item['pos']['x']) + this.x0;
            let id = (1<<col | 1<< row)

            if (item["char"] !== "_"){
                colors[id] = parseInt(this.app.storage.state.randomInts[parseInt(item['seq'])] * 0xFFFFFF);
            }else{
                colors[id] = parseInt(this.app.storage.state.randomInts[64] * 0xFFFFFF);
            }
            // let id = (1<<col | 1<< row)
            //     if (colors[id] === undefined){
            //         colors[id] = parseInt(this.app.randomInts[parseInt(item['seq'])] * 0xFFFFFF);
            //     }else{
            //         colors[id] = this.colorMixUp(colors[id], this.app.randomInts[parseInt(item['seq'])] * 0xFFFFFF);
            //     }
        })

        table.forEach((item) => {
            let row = parseInt(item['pos']['y']) + this.y0;
            let col = parseInt(item['pos']['x']) + this.x0;
            let id = (1<<col | 1<< row)
            this._addPiece(row, col, colors[id], item['char'], blockSize, blockSizePadding, offset_x, false)

        })





    }

    // preZeroFill(num, size) {
    //     if (num >= Math.pow(10, size)) { //如果num本身位数不小于size位
    //         return num.toString();
    //     } else {
    //         var _str = Array(size + 1).join('0') + num;
    //         return _str.slice(_str.length - size);
    //     }
    // }

    // colorMixUp(color_1, color_2, weight) {
    //     color_1 = this.preZeroFill(color_1.toString(16), 6)
    //     color_2 = this.preZeroFill(color_2.toString(16), 6)

    //     function d2h(d) { return d.toString(16); }  // convert a decimal value to hex
    //     function h2d(h) { return parseInt(h, 16); } // convert a hex value to decimal 
      
    //     weight = (typeof(weight) !== 'undefined') ? weight : 50; // set the weight to 50%, if that argument is omitted
      
    //     var color = "";
      
    //     for(var i = 0; i <= 5; i += 2) { // loop through each of the 3 hex pairs—red, green, and blue
    //       var v1 = h2d(color_1.substr(i, 2)), // extract the current pairs
    //           v2 = h2d(color_2.substr(i, 2)),
              
    //           // combine the current pairs from each source color, according to the specified weight
    //           val = d2h(Math.floor(v2 + (v1 - v2) * (weight / 100.0))); 
      
    //       while(val.length < 2) { val = '0' + val; } // prepend a '0' if val results in a single digit
          
    //       color += val; // concatenate val to our new color string
    //     }
          
    //     console.log("output", color)
    //     return parseInt(color); // PROFIT!
    //   };

    reset() {
        this.init_table.forEach((item) => {
            item['piece'].x = item['x']
            item['piece'].y = item['y']
            item['piece'].col = item['col']
            item['piece'].row = item['row']
            this._save_piece_state(this.app.storage, item['piece'])
        })

    }

    _addPiece(row, col, backGroundColor, char, blockSize, blockSizePadding, offset_x, isCandidate) {
        let graphics = new Graphics();
        // console.log("char:", char, char === '_')
        // graphics.lineStyle(8, 0x2273e6, char === '_' ? 0 : 0.5);
        // graphics.beginFill(Math.random() * 0xFFFFFF, char === '_' ? 0 : 0.25);
        // graphics.beginFill(backGroundColor, char === '_' ? 0 : 0.25);
        graphics.beginFill(backGroundColor, 0.25);
        graphics.drawRoundedRect(0, 0, blockSize * 0.99, blockSize * 0.99, 16);
        graphics.endFill();

        // use container
        let texture = this.renderer.generateTexture(graphics);
        const rect = Sprite.from(texture);

        if (char !== '_') {
            const text = new Text(char, { fontFamily: 'Arial', fontSize: 48, fill: 0x000000, align: 'center' });
            text.x = rect.x + 0.1 * rect.height;
            text.y = rect.y + 0.1 * rect.height;
            text.height = 0.8 * rect.height;
            text.width = 0.8 * rect.width;
            rect.addChild(text)
        }

        let piece = new Piece(rect, row, col)
        // piece.id = (1 << row) | (1 << col)  // bitmap
        piece.id = this.pieceId++

        // this.app.$pieces.

        if (isCandidate) {
            piece.type = 2
        } else {
            piece.type = char === '_' ? 0 : 1
        }
        piece.char = char

        //add the piece to ui
        piece.x = col * blockSizePadding - config.width / 2 + offset_x
        piece.y = row * blockSizePadding - config.height / 2
        piece.col = col
        piece.row = row

        // 有线上数据则拉取覆盖，否则初始化线上  this._save_piece_state(this.app.storage, picked)
        const cacheState = this.app.storage.state[piece.id];
        if (cacheState !== undefined){
            this._load_piece_state(cacheState, piece)
        }else{
            this._save_piece_state(this.app.storage, piece)
        }

        this.init_table.push({ 'piece': piece, 'x': piece.x, 'y': piece.y, 'col': piece.col, 'row': piece.row })

        // console.log("x", piece.x, "y", piece.y, "text", item['char'], typeof piece.x)

        piece
            .on('dragstart', (picked) => {
                //put the selected（drag and move） piece on top of the others pieces.
                this.$pieces.removeChild(picked)
                this.$select.addChild(picked)
                // picked.fromX = picked.x
                // picked.fromY = picked.y
                this._save_piece_state(this.app.storage, picked)
                // this.app.storage.setState({[picked.id] : {x:picked.x, y:picked.y}})
            })
            .on('dragmove', (picked) => {
                this._save_piece_state(this.app.storage, picked)
                // console.log(this.app.storage.state[piece.id])
                //check if hover on the other piece
                this._checkHover(picked)
                // this.app.storage.setState({[picked.id] : {x:picked.x, y:picked.y}})
            })
            .on('dragend', (picked) => {
                // console.log(this.app.storage.state)
                //restore the piece layer
                this.$select.removeChild(picked)
                this.$pieces.addChild(picked)

                //check if you can swap the piece
                let target = this._checkHover(picked)
                if (target) {
                    this.moveCount++
                    this._swap(picked, target)
                    target.tint = 0xFFFFFF
                } else {
                    picked.x = picked.origin_x
                    picked.y = picked.origin_y
                }
                this._save_piece_state(this.app.storage, target)
                this._save_piece_state(this.app.storage, picked)
            })

        // const dispose = this.app.storage.addStateChangedListener(refresh);

        this.$pieces.addChild(piece)
    }

    _save_piece_state(storage, piece) {
        storage.setState({ [piece.id]: { x: piece.x, y: piece.y, col: piece.col, row: piece.row , interactive: piece.interactive, alpha: piece.alpha} })
    }

    _load_piece_state(state, piece) {
        // storage.setState({[piece.id] : {x:piece.x, y:piece.y, col: piece.col, row: piece.row, currentIndex: piece.currentIndex}})
        piece.x = state.x
        piece.y = state.y
        piece.col = state.col
        piece.row = state.row
        piece.interactive = state.interactive
        piece.alpha = state.alpha
    }

    /**
     * swap two pieces
     * @param {*} picked the picked one
     * @param {*} target the one under the picked
     */
    _swap(picked, target) {
        // let pickedIndex = picked.currentIndex
        picked.x = target.x
        picked.y = target.y
        picked.col = target.col
        picked.row = target.row
        this._save_piece_state(this.app.storage, picked)
        // picked.currentIndex = target.currentIndex

        target.x = picked.origin_x
        target.y = picked.origin_y
        target.col = picked.origin_col
        target.row = picked.origin_row
        // target.currentIndex = pickedIndex

        if (picked.type === 2 && target.type === 0) {
            target.interactive = false;
            target.alpha = 0;
        }
    }

    /**
     * is the picked piece hover on the other piece
     * @param {*} picked
     */
    _checkHover(picked) {

        let overlap = this.$pieces.children.find(piece => {
            //the center position of the piece is in the other pieces boundry
            let rect = new Rectangle(piece.x, piece.y, piece.width, piece.height)
            return rect.contains(picked.center.x, picked.center.y)
        })

        this.$pieces.children.forEach(piece => piece.tint = 0xFFFFFF)

        //change tint color when picked piece is on me
        if (overlap) {
            overlap.tint = 0x00ffff
        }

        return overlap
    }

    // createBack() {
    //   const graphics = new Graphics()
    //   this.$pieces.children.forEach(piece => {
    //     graphics.lineStyle(2, 0xFEEB77, 1)
    //     graphics.beginFill(0x650a5A)
    //     graphics.drawRect(piece.x, piece.y, piece.width, piece.height)
    //     graphics.endFill()
    //     this.back.addChild(graphics)
    //   })
    // }
}