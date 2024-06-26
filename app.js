const S0 = document.querySelector("#s0")
, S1 = document.querySelector("#s1")
, S2 = document.querySelector("#s2")
, S3 = document.querySelector("#s3")
, S4 = document.querySelector("#s4")
, S5 = document.querySelector("#s5")
, S6 = document.querySelector("#s6");


const SLOTS = [S0, S1, S2, S3, S4, S5, S6]

const node = function (val, move) {
this.value = val || '';
this.moveDirection = move || null;
this.position = null;
this.left = null;
this.right = null;
this.isPossible = false;

this.getValue = function () {
    return this.value;
}

this.getMoveDirection = function () {
    return this.moveDirection;
}

this.setLeftNode = function (node) {
    this.left = node;
}

this.getLeftNode = function () {
    return this.left;
}

this.setRightNode = function (node) {
    this.right = node;
}

this.getRightNode = function () {
    return this.right
}

this.setPosition = function (pos) {
    this.position = pos;
}

this.getPosition = function () {
    return this.position;
}

this.getIsPossible = function () {
    return this.isPossible;
}

this.setIsPossible = function (val) {
    if (val === true || val === false) {
        this.isPossible = val
    }
}

this.isValidMove = function () {
    //right node is empty
    if (this.moveDirection === 1) {
        //next node is empty
        if (this.getRightNode().value === EMPTY) {
            return true;
        }
        //next node is opposite and node after is empty
        if (
            this.getRightNode().value !== this.value
            && this.getRightNode().getRightNode().value === EMPTY
        ) {
            return true;
        }
    }
    if (this.moveDirection === -1) {
        if (this.getLeftNode().value === EMPTY) {
            return true;
        }
        if (
            this.getLeftNode().value !== this.value
            && this.getLeftNode().getLeftNode().value === EMPTY
        ) {
            return true;
        }
    }
    return false;
}

this.getValidMoves = function () {
    let rValue = []
    if (this.moveDirection === 1) {
        //next node is empty
        if (this.getRightNode().value === EMPTY) {
            rValue.push(true);
        } else {
            if (this.getRightNode() === null) {
                return rValue;
            }
            rValue.push(false);
        }
        //next node is opposite and node after is empty
        if (
            this.getRightNode().value !== this.value
            && this.getRightNode().getRightNode().value === EMPTY
        ) {
            rValue.push(true);
        } else {
            if (this.getRightNode().getRightNode() === null) {
                return rValue;
            }
            rValue.push(false);
        }
    }
    if (this.moveDirection === -1) {
        if (this.getLeftNode().value === EMPTY) {
            rValue.push(true);
        } else {
            if (this.getLeftNode() === null) {
                return rValue;
            }
            rValue.push(false);
        }
        if (
            this.getLeftNode().value !== this.value
            && this.getLeftNode().getLeftNode().value === EMPTY
        ) {
            rValue.push(true);
        } else {
            if (this.getLeftNode().getLeftNode() === null) {
                return rValue;
            }
            rValue.push(false);
        }
    }
    return rValue;

}

}

const GEM = '\u{0001F48E}'
const COIN = '\u{0001FA99}'
const EMPTY = '';

const placement = [
new node(GEM, 1),
new node(GEM, 1),
new node(GEM, 1),
new node(EMPTY),
new node(COIN, -1),
new node(COIN, -1),
new node(COIN, -1)
]

// console.log(placement)

function addConnections(array) {
let last = array.length - 1
for (let i = 0; i < array.length; i++) {
    array[i].setPosition(i)
    if (i > 0) {
        array[i].setLeftNode(array[i - 1]);
    }
    if (i !== last) {
        array[i].setRightNode(array[i + 1]);
    }
}

}

addConnections(placement)




console.table(placement)

function possibleMove() {
let target = event.target;
let position = +target.id.substring(1)
if (placement[position].getIsPossible()) {
    let swap = [];
    for (let i = 0; i < placement.length; i++) {
        if (placement[i].getIsPossible()) {
            swap.push(placement[i])
        }
    }
    // console.table(swap)
    // console.table(placement)
    let temp = swap[0]
    placement[swap[0].getPosition()] = placement[swap[1].getPosition()];
    placement[swap[1].getPosition()] = temp;
    // console.table(placement)
    addConnections(placement)
    // console.table(placement)
    for (let i = 0; i < placement.length; i++) {
        placement[i].setIsPossible(false)

    }
    clearSelection()
    setDisplay()
}
}

function clearSelection() {
for (let i = 0; i < SLOTS.length; i++) {
    SLOTS[i].style.removeProperty('background-color');
}
}

function setDisplay() {
for (let i = 0; i < SLOTS.length; i++) {
    if (placement[i].getMoveDirection() !== 0) {

        SLOTS[i].innerText = ''
        SLOTS[i].innerText = placement[i].getValue()
    }
}
}

function showSelected(event) {
possibleMove()
clearSelection()
let target = event.target;
let position = +target.id.substring(1)
// console.log(position)
// console.log(placement[position].isValidMove())
let isValid = placement[position].isValidMove()
//shakwe the box if its negative and colour it red
if (!isValid) {
    target.style.setProperty('background-color', 'red');
}
//green if good
else {
    target.style.setProperty('background-color', 'green');
    let squares = placement[position].getValidMoves()
    console.log(squares);
    for (let i = 0; i < squares.length; i++) {
        if (squares[i]) {
            let future = SLOTS[position + (i + 1) * placement[position].getMoveDirection()]
            placement[position].setIsPossible(true)
            placement[position + (i + 1) * placement[position].getMoveDirection()].setIsPossible(true);
            console.log(target, position, i, placement[position].getMoveDirection(), future)
            future.style.setProperty('background-color', 'yellow')
        }
    }
}
}


setDisplay()
for (let i = 0; i < SLOTS.length; i++) {
SLOTS[i].addEventListener('click', showSelected)
}
