interface ObjectAssigment {
    key: string;
    value: Object;
}

const caroBoardElement = document.getElementById('caro_app') as HTMLElement;
let caroBoardValue: (boolean|null)[][];
let turn = true;

const createMatrix = <T>(rows: number, cols: number, defaultValue: T): T[][] =>
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => defaultValue)
    );

const parseCellId = (cellId: string): { i: number; j: number } | null => {
    const match = cellId.match(/^cell_(\d+)-(\d+)$/);
    return match
      ? { i: parseInt(match[1], 10), j: parseInt(match[2], 10) }
      : null;
  };

const createElement = (tagName: string, classNames: Array<string>|null , objectAssign: ObjectAssigment|null, id:string|null = null): HTMLElement => {
    const element: any = document.createElement(tagName);
    if (classNames) {
        for (let id in classNames) {
            element.classList.add(classNames[id]);
        }
    } 

    if (objectAssign) {
        const { key: key, value: value } = objectAssign;
        Object.assign(element[key], value);
    }

    if (id) {
        element.id = id;
    }
    
    return element;
};

const renderCaroBoard = (rowNum: number, colNum: number): void => {
    caroBoardValue = createMatrix(rowNum, colNum, null);
    for (let i: number = 0; i < rowNum; i++) {
        const rowElement:HTMLElement = createElement('div', [`row_${i}`, 'row_item'], null);
        for (let j: number = 0; j < colNum; j++) {
            const cellElement:HTMLElement = createElement('div', [`cell_item`], null, `cell_${i}-${j}`);
            rowElement.appendChild(cellElement);
        }
        caroBoardElement.appendChild(rowElement);
    }
}

const generateBtn: HTMLElement|null = document.getElementById('generate_btn');

generateBtn?.addEventListener('click', function () {
    const colInput = document.getElementById('col_num') as HTMLInputElement;
    const rowInput = document.getElementById('row_num') as HTMLInputElement;

    const rowNum: number = parseInt(colInput?.value) || 10;
    const colNum: number = parseInt(rowInput?.value) || 10;

    if (rowNum < 1 || colNum < 1) {
        alert('Set row number or column number again!');
        return;
    }
    renderCaroBoard(rowNum, colNum);
});

caroBoardElement.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const location: any = parseCellId(target.id);
    if (location) {
        const {i, j} = location;
        if (caroBoardValue[i][j] !== null) {
            return;
        }
        caroBoardValue[i][j] = turn;
        turn = !turn
        const src:string = turn ? './icons/circle-icon.svg' : './icons/cross-icon.svg';
        const turnValue: any = createElement('img', ['caro_icon'], null);
        turnValue.src = src;
        target.appendChild(turnValue);
    }
});

    
