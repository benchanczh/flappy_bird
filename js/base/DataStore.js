// 变量缓存器， 方便我们在不同的类中访问和修改变量
// 需要长期保存的放到DataStore类中，随时销毁的放到map中
export class DataStore {

    static getInstance() {
        if (!DataStore.instance) {
            DataStore.instance = new DataStore();
        }
        return DataStore.instance;
    }

    constructor() {
        this.map = new Map();
    }

    put(key, value) {
        if (typeof value === 'function') {
            value = new value()
        }
        this.map.set(key, value);
        return this;
    }

    get(key) {
        return this.map.get(key);
    }

    destroy() {
        for (let value of this.map.values()) {
            value = null;
        }
    }
}