import { Sprite } from "../base/Sprite.js";
import { Director } from "../Director.js";

// 铅笔的基类
export class Pencil extends Sprite {

    constructor(image, top) {
        super(
            image,
            0,
            0,
            image.width,
            image.height,
            window.innerWidth, //铅笔的左侧刚好在canvas的右侧，刚好看不见
            0, //初始为0，子类里覆盖
            image.width,
            image.height
        );
        this.top = top;
    }

    draw() {
        this.x -= Director.getInstance().moveSpeed; //跟landspeed统一
        super.draw(
            this.img,
            0,
            0,
            this.img.width,
            this.img.height,
            this.x,
            this.y,
            this.img.width,
            this.img.height
        )

    }
}