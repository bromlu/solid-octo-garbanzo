export default class Vector {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    get position(){
        return this
    }
    setPosition(x,y){
        this.x = x;
        this.y = y;
    }

    static normalize(v) {
        let hyp = Math.sqrt(v.x*v.x + v.y*v.y)
        if (hyp == 0) return new Vector(0,0)
        return new Vector(v.x/hyp, v.y/hyp)
    }
}