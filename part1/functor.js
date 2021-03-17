/*
 * @Description: 
 * @Version: 1.0
 * @Autor: c-jack.qian
 * @Date: 2021-03-17 17:46:41
 * @LastEditors: c-jack.qian
 * @LastEditTime: 2021-03-17 19:55:31
 */
 const fp = require('lodash/fp')
// import fp from 'ladash/fp'
// 实现一个functor函子
class Contianer {
    static of(value) {
        return new Contianer(value);
    }
    constructor(value) {
        this._value = value;
    }
    map(fn) {
        return Contianer.of(fn(this._value));
    }
}

Contianer.of("a").map((value) => {
    return value.toUpperCase();
});

// mayBe 函子 用来处理输入空值的情况
class mayBe {
    constructor(value) {
        this._value = value;
    }
    static of(initialValue) {
        return new mayBe(initialValue);
    }
    // 执行一个函数对值进行处理，来映射另一个函子
    map(fn) {
        return this.isNothing() ? mayBe.of(null) : mayBe.of(fn(this._value));
    }
    isNothing() {
        return this._value === null || this._value === undefined;
    }
}

mayBe.of(null).map((value) => {
    return value.toUpperCase();
});

// Either函子 用来处理异常
class Right {
    constructor(value) {
        this._value = value;
    }
    static of(initialValue) {
        return new Right(initialValue);
    }
    map(fn) {
        return Right.of(fn(this._value));
    }
}
class Left {
    constructor(value) {
        this._value = value;
    }
    static of(initialValue) {
        return new Left(initialValue);
    }
    map(fn) {
        return this;
    }
}

const parseJsonFn = (data) => {
    try {
        const pareredData = JSON.parse(data);
        Right.of(pareredData)
    } catch (error) {
        Right.of(error)
    }
};
const json = '{ "data" : "jack"} ';
parseJsonFn(json);


// IO函子 把不纯的操作交给调用者管理
class IO {
    constructor(fn) {
        this._value = fn
    }
    static of(value){
        return new IO(function(){
            return value
        })
    }
    map(fn){
        return new IO(fp.flowRight(fn,this._value))
    }
}

const r = IO.of(process).map((p) => p.execPath)
console.log(r._value());
