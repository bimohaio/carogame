var DIRECTION_VECTORS = [
    [0, 1],
    [1, 0],
    [-1, -1],
    [1, -1],
];
var caroBoardElement = document.getElementById('caro_app');
var caroBoardValue;
var caroBoardParams = [20, 20];
var caroScore = [0, 0];
var turn = true;
var createMatrix = function (rows, cols, defaultValue) {
    return Array.from({ length: cols }, function () {
        return Array.from({ length: rows }, function () { return defaultValue; });
    });
};
var parseCellId = function (cellId) {
    var match = cellId.match(/^cell_(\d+)-(\d+)$/);
    return match
        ? { i: parseInt(match[1], 10), j: parseInt(match[2], 10) }
        : null;
};
var addVector = function (location, vector) { return [location[0] + vector[0], location[1] + vector[1]]; };
var mulWithK = function (vector, k) { return [k * vector[0], k * vector[1]]; };
var createElement = function (tagName, classNames, objectAssign, id) {
    if (id === void 0) { id = null; }
    var element = document.createElement(tagName);
    if (classNames) {
        for (var id_1 in classNames) {
            element.classList.add(classNames[id_1]);
        }
    }
    if (objectAssign) {
        var key = objectAssign.key, value = objectAssign.value;
        Object.assign(element[key], value);
    }
    if (id) {
        element.id = id;
    }
    return element;
};
var renderCaroBoard = function (rowNum, colNum) {
    caroBoardValue = createMatrix(rowNum, colNum, null);
    caroBoardElement.innerHTML = '';
    for (var i = 0; i < colNum; i++) {
        var rowElement = createElement('div', ["row_".concat(i), 'row_item'], null);
        for (var j = 0; j < rowNum; j++) {
            var cellElement = createElement('div', ["cell_item"], null, "cell_".concat(i, "-").concat(j));
            rowElement.appendChild(cellElement);
        }
        caroBoardElement.appendChild(rowElement);
    }
};
var updateScore = function () {
    var scoreElement = document.getElementById('score');
    var left = caroScore[0], right = caroScore[1];
    scoreElement.innerHTML = "".concat(left, " - ").concat(right);
};
var checkResult = function (location, turn, limit) {
    if (limit === void 0) { limit = 0; }
    var rays = [-1, 1];
    var cotinuousScore = 0;
    var isVictory = false;
    for (var _i = 0, DIRECTION_VECTORS_1 = DIRECTION_VECTORS; _i < DIRECTION_VECTORS_1.length; _i++) {
        var key = DIRECTION_VECTORS_1[_i];
        cotinuousScore = 1;
        for (var _a = 0, rays_1 = rays; _a < rays_1.length; _a++) {
            var ray = rays_1[_a];
            for (var k = 1; k <= 5; k++) {
                var nextVector = mulWithK(key, k * ray);
                var _b = addVector(location, nextVector), nextX = _b[0], nextY = _b[1];
                if (nextX < 0 || nextY < 0 || nextX >= caroBoardParams[0] || nextY >= caroBoardParams[1]) {
                    break;
                }
                if (caroBoardValue[nextX][nextY] === turn) {
                    cotinuousScore++;
                    if (cotinuousScore >= 5) {
                        isVictory = true;
                        return isVictory;
                    }
                }
                else {
                    break;
                }
            }
        }
    }
    return false;
};
var generateBtn = document.getElementById('generate_btn');
generateBtn === null || generateBtn === void 0 ? void 0 : generateBtn.addEventListener('click', function () {
    var colInput = document.getElementById('col_num');
    var rowInput = document.getElementById('row_num');
    var rowNum = parseInt(colInput === null || colInput === void 0 ? void 0 : colInput.value) || 10;
    var colNum = parseInt(rowInput === null || rowInput === void 0 ? void 0 : rowInput.value) || 10;
    caroBoardParams[0] = rowNum;
    caroBoardParams[1] = colNum;
    if (rowNum < 1 || colNum < 1) {
        alert('Set row number or column number again!');
        return;
    }
    renderCaroBoard(rowNum, colNum);
});
caroBoardElement.addEventListener('click', function (event) {
    var target = event.target;
    var location = parseCellId(target.id);
    if (location) {
        var i = location.i, j = location.j;
        if (caroBoardValue[i][j] !== null) {
            alert('Đã đánh rồi, chơi cho đúng luật nào!');
            return;
        }
        caroBoardValue[i][j] = turn;
        var src = turn ? './icons/circle-icon.svg' : './icons/cross-icon.svg';
        turn = !turn;
        var turnValue = createElement('img', ['caro_icon'], null);
        turnValue.src = src;
        target.appendChild(turnValue);
        if (checkResult([i, j], !turn)) {
            alert("".concat(!turn ? 'Parrot' : 'Dog', " win!!!!!!"));
            !turn ? caroScore[0]++ : caroScore[1]++;
            updateScore();
        }
    }
});
caroBoardElement.addEventListener('mousemove', function (e) {
    var rect = caroBoardElement.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    document.body.style.cursor = !turn ? "url('./icons/small-cross-icon.svg') 16 16, auto" : "url('./icons/small-circle-icon.svg') 16 16, auto";
});
caroBoardElement.addEventListener('mouseleave', function (e) {
    document.body.style.cursor = "default";
});
