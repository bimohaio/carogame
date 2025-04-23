var caroBoardElement = document.getElementById('caro_app');
var caroBoardValue;
var turn = true;
var createMatrix = function (rows, cols, defaultValue) {
    return Array.from({ length: rows }, function () {
        return Array.from({ length: cols }, function () { return defaultValue; });
    });
};
var parseCellId = function (cellId) {
    var match = cellId.match(/^cell_(\d+)-(\d+)$/);
    return match
        ? { i: parseInt(match[1], 10), j: parseInt(match[2], 10) }
        : null;
};
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
    for (var i = 0; i < rowNum; i++) {
        var rowElement = createElement('div', ["row_".concat(i), 'row_item'], null);
        for (var j = 0; j < colNum; j++) {
            var cellElement = createElement('div', ["cell_item"], null, "cell_".concat(i, "-").concat(j));
            rowElement.appendChild(cellElement);
        }
        caroBoardElement.appendChild(rowElement);
    }
};
var generateBtn = document.getElementById('generate_btn');
generateBtn === null || generateBtn === void 0 ? void 0 : generateBtn.addEventListener('click', function () {
    var colInput = document.getElementById('col_num');
    var rowInput = document.getElementById('row_num');
    var rowNum = parseInt(colInput === null || colInput === void 0 ? void 0 : colInput.value) || 10;
    var colNum = parseInt(rowInput === null || rowInput === void 0 ? void 0 : rowInput.value) || 10;
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
            return;
        }
        caroBoardValue[i][j] = turn;
        turn = !turn;
        var src = turn ? './icons/circle-icon.svg' : './icons/cross-icon.svg';
        var turnValue = createElement('img', ['caro_icon'], null);
        turnValue.src = src;
        target.appendChild(turnValue);
    }
});
