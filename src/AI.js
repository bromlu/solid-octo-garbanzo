import {TAU} from "./globals";

const actions = {
    forward: 0,
    left: 1,
    right: 2,
    nothing: 3
}
export class RandomMovementAI {
    constructor(actionDuration) {
        this.actionDurationMax = actionDuration
        this.actionDuration = Math.random() * this.actionDurationMax
        this.actionStart = Date.now()
        this.action = Math.floor(Math.random() * 4)
    }

    goForward() { return this.action === actions.forward; }
    goLeft() { return this.action === actions.left }
    goRight() { return this.action === actions.right }
    useShot() { return false }
    update(body) {
        if (Date.now() - this.actionStart > this.actionDuration) {
            this.action = Math.floor(Math.random() * 4)
            this.actionStart = Date.now();
            this.actionDuration = Math.random() * this.actionDurationMax
        }
    }
}

export class PatrolAI {
    constructor(patrolDuration) {
        this.patrolDuration = patrolDuration
        this.patrolStart = Date.now()
        this.rotationTarget = Math.PI;
        this.precision = 0.1;
    }
    
    goForward(body) {
        if (Date.now() - this.patrolStart < this.patrolDuration) {
            return true;
        }
    }

    goLeft(body) {
        if (Date.now() - this.patrolStart > this.patrolDuration) {
            if(body.theta > this.rotationTarget) {
                return true
            } else if (Math.abs(body.theta - this.rotationTarget) <= this.precision) {
                this.patrolStart = Date.now()
                this.rotationTarget = body.theta + Math.PI
            }
        } 
        return false;
    }

    goRight(body) {
        if (Date.now() - this.patrolStart > this.patrolDuration) {
            if(body.theta < this.rotationTarget) {
                return true
            } else if (Math.abs(body.theta - this.rotationTarget) <= this.precision) {
                this.patrolStart = Date.now()
                this.rotationTarget = body.theta + Math.PI
            }
        }
        return false;
    }
    useShot() { return false; }
}

const states = {
    tracking: 0,
    targetting: 1,
}
export class TargettingAI {
    constructor(target) {
        this.target = target;
        this.xOffset = Math.floor(Math.random() * 100) - 50; 
        this.yOffset = Math.floor(Math.random() * 100) - 50; 
        this.forward = false;
        this.left = false;
        this.right = false;
        this.state = states.tracking;
        this.shotDistance = 300;
        this.useRightSide = false;
        this.shoot = false;
    }
    goForward() { return this.forward; }
    goLeft() { return this.left }
    goRight() { return this.right }
    useShot() { return this.shoot }
    update(body) {
        let dx = body.x - this.target.x
        let dy = body.y - this.target.y
        this.left = false;
        this.right = false;
        this.shoot = false;
        this.forward = false;
        if (this.state == states.tracking) {
            //turn to target
            dx += this.xOffset
            dy += this.yOffset
            this.forward = true;
            let desiredTheta = Math.atan2(dy,dx);
            let d1 = thetaDiff(body.theta, desiredTheta)
            let d2 = thetaDiff(body.theta + Math.PI, desiredTheta)
            if (Math.abs(d1) < Math.abs(d2)) {
                this.left = true;
            } else {
                this.right = true;
            }

            dx = Math.abs(dx);
            dy = Math.abs(dy);
            if (dx < this.shotDistance && dy < this.shotDistance)
            {
                this.state = states.targetting;
                this.useRightSide = Math.abs(d2) < Math.abs(d1);
            }
        }
        else if (this.state == states.targetting) {
            let desiredTheta = Math.atan2(dy,dx);
            let d1 = thetaDiff(body.theta + Math.PI/2, desiredTheta)
            let d2 = thetaDiff(body.theta - Math.PI/2, desiredTheta)
            let close = Math.abs(Math.abs(d1) - Math.abs(d2)) < .3;
            if (!close) {
                if (Math.abs(d1) < Math.abs(d2)) {
                    if (this.useRightSide) this.left = true;
                    else this.right = true;
                } else {
                    if (this.useRightSide) this.right = true;
                    else this.left = true;
                }
            } else {
                this.shoot = true;
            }

            dx = Math.abs(dx);
            dy = Math.abs(dy);
            if (dx > this.shotDistance || dy > this.shotDistance)
            {
                this.state = states.tracking;
            }

        }
    }
}

function thetaDiff(th1, th2) {
    let th = th2 - th1
    while (th > Math.PI) th -= TAU
    while (th < -Math.PI) th += TAU
    return th;
}