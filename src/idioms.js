import { Container, Graphics, Rectangle, Sprite, Text, } from 'pixi.js'
import Piece from './piece'
import * as config from './config'
import { _load_piece_state, _save_piece_state} from './scene'
import Scene from './scene'

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


        for (let i = 0; i < candidates.length; i++) {
            let row = 12;
            this._addPiece(row + Math.floor(i / maxBlockNumRoot), i % maxBlockNumRoot, 0xFFFFFF,
                candidates[i], blockSize, blockSizePadding, offset_x, true)
        }

        let colors = {};
        table.forEach((item) => {
            let row = parseInt(item['pos']['y']) + this.y0;
            let col = parseInt(item['pos']['x']) + this.x0;
            let id = (1 << col | 1 << row)

            if (item["char"] !== "_") {
                colors[id] = parseInt(this.app.storage.state.randomInts[parseInt(item['seq'])] * 0xFFFFFF);
            } else {
                colors[id] = parseInt(this.app.storage.state.randomInts[64] * 0xFFFFFF);
            }
        })

        table.forEach((item) => {
            let row = parseInt(item['pos']['y']) + this.y0;
            let col = parseInt(item['pos']['x']) + this.x0;
            let id = (1 << col | 1 << row)
            this._addPiece(row, col, colors[id], item['char'], blockSize, blockSizePadding, offset_x, false)
        })
    }

    reset() {
        this.init_table.forEach((item) => {
            item['piece'].x = item['originalX']
            item['piece'].y = item['originalY']
            item['piece'].col = item['originalCol']
            item['piece'].row = item['originalRow']
            _save_piece_state(this.app.storage, item['piece'])
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

        let piece = new Piece(rect, row, col, this.app)
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

        // 有线上数据则拉取覆盖，否则初始化线上  _save_piece_state(this.app.storage, picked)
        const cacheState = this.app.storage.state[piece.id];
        if (cacheState !== undefined) {
            _load_piece_state(cacheState, piece)
        } else {
            _save_piece_state(this.app.storage, piece)
        }

        this.init_table.push({
            'piece': piece, 'x': piece.x, 'y': piece.y, 'col': piece.col, 'row': piece.row,
            'originalX': piece.x, 'originalY': piece.y, 'originalCol': piece.col, 'originalRow': piece.row,
        })

        // console.log("x", piece.x, "y", piece.y, "text", item['char'], typeof piece.x)

        piece
            .on('dragstart', (picked) => {
                //put the selected（drag and move） piece on top of the others pieces.
                this.$pieces.removeChild(picked)
                this.$select.addChild(picked)
                // picked.fromX = picked.x
                // picked.fromY = picked.y
                _save_piece_state(this.app.storage, picked)
                // this.app.storage.setState({[picked.id] : {x:picked.x, y:picked.y}})
            })
            .on('dragmove', (picked) => {
                _save_piece_state(this.app.storage, picked)
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
                _save_piece_state(this.app.storage, target)
                _save_piece_state(this.app.storage, picked)
            })

        // const dispose = this.app.storage.addStateChangedListener(refresh);

        this.$pieces.addChild(piece)
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

        if (picked.type === 0 && target.type === 2) {
            console.log("swap picked")
            // picked.interactive = false;
            // picked.alpha = 0;
            this.app.storage.setState({[picked.id] : {interactive: false, alpha: 0}})
        }
        _save_piece_state(this.app.storage, picked)
        

        // picked.currentIndex = target.currentIndex

        target.x = picked.origin_x
        target.y = picked.origin_y
        target.col = picked.origin_col
        target.row = picked.origin_row
        // target.currentIndex = pickedIndex

        
        if (picked.type === 2 && target.type === 0) {
            console.log("swap target")
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