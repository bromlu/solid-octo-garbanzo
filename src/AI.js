export class RandomMovementAI {
    goForward() {
        return Math.random() * 11 > 5
    }

    goLeft() {
        return Math.random() * 11 > 5
    }

    goRight() {
        return Math.random() * 11 > 5
    }
}