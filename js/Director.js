import { DataStore } from "./base/DataStore.js";
import { UpPencil } from "./runtime/UpPencil.js";
import { DownPencil } from "./runtime/DownPencil.js";

// 导演类，控制游戏的逻辑
export class Director {

    static getInstance() {
        if (!Director.instance) {
            Director.instance = new Director();
        }
        return Director.instance;
    }

    constructor() {
        this.dataStore = DataStore.getInstance();
        this.moveSpeed = 2;
    }

    creatPencil() {
        // 上铅笔的top
        const minTop = window.innerHeight / 8;
        const maxTop = window.innerHeight / 2;
        const top = minTop + Math.random() * (maxTop - minTop);
        this.dataStore.get('pencils').push(new UpPencil(top));
        this.dataStore.get('pencils').push(new DownPencil(top));
    }

    birdsEvent() {
        for (let i = 0; i <= 2; i++) {
            this.dataStore.get('birds').y[i] = this.dataStore.get('birds').birdsY[i];
        }
        this.dataStore.get('birds').time = 0;
    }

    // 判断小鸟是否撞击铅笔
    static isStrike(bird, pencil) {
        let safe = false;
        // 小鸟完全的情况
        if (bird.top > pencil.bottom || 
            bird.bottom < pencil.top || 
            bird.right < pencil.left || 
            bird.left > pencil.right) {
                safe = true;
        }
        return !safe;
    }

    // 判断小鸟是否撞击地板或铅笔
    check() {
        const birds = this.dataStore.get('birds');
        const land = this.dataStore.get('land');
        const pencils = this.dataStore.get('pencils');
        const score = this.dataStore.get('score');

        // 地板的撞击判断
        if (birds.birdsY[0] + birds.birdsHeight[0] >= land.y) {
            this.isGameOver = true;
            return;
        }

        // 小鸟的边框模型
        const birdBorder = {
            top: birds.y[0],
            bottom: birds.birdsY[0] + birds.birdsHeight[0],
            left: birds.birdsX[0],
            right: birds.birdsX[0] + birds.birdsWidth[0]
        };

        const length = pencils.length;
        for (let i = 0; i < length; i++) {
            const pencil = pencils[i];
            const pencilBorder = {
                top: pencil.y,
                bottom: pencil.y + pencil.height,
                left: pencil.x,
                right: pencil.x + pencil.width
            };

            // 判断需在循环里进行，要判断小鸟跟每一支铅笔的情况
            if (Director.isStrike(birdBorder, pencilBorder)) {
                console.log('撞到铅笔了');
                this.isGameOver = true;
                return;
            }
        }

        // 加分逻辑
        if (birds.birdsX[0] > pencils[0].x + pencils[0].width && score.isScore) {
            score.isScore = false;
            score.scoreNumber++;
        }
    }

    run() {
        this.check();
        if (!this.isGameOver) {
            this.dataStore.get('background').draw();

            const pencils = this.dataStore.get('pencils');
            // 当铅笔的右侧超过了canvas左边界和有两组铅笔，推出这两组铅笔(销毁越界铅笔)
            if (pencils[0].x + pencils[0].width <= 0 && pencils.length === 4) {
                pencils.shift();
                pencils.shift();
                // 当前一组铅笔被回收后可以开启计分器
                this.dataStore.get('score').isScore = true;
            }

            // 当第一组铅笔运动到canvas中间位置且只有一组铅笔，创建新一组铅笔
            // 取(window.innerWidth - pencils[0].width) / 2是为了让每一组铅笔都等距
            if (pencils[0].x <= (window.innerWidth - pencils[0].width) / 2 && pencils.length === 2) {
                this.creatPencil();
            }

            this.dataStore.get('pencils').forEach(function (value) {
                value.draw();
            });
            this.dataStore.get('land').draw();
            
            this.dataStore.get('score').draw();

            this.dataStore.get('birds').draw();

            let timer = requestAnimationFrame(() => this.run());
            this.dataStore.put('timer', timer);
        } else {
            this.dataStore.get('startButton').draw();
            cancelAnimationFrame(this.dataStore.get('timer'));
            this.dataStore.destroy();
        }
    }
}