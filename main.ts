interface ObjectAssigment {
    key: string;
    value: Object;
}

type Coordinates = [number, number];
type CaroValue = [number, number];

const DIRECTION_VECTORS: Coordinates[] = [
    [0, 1],
    [1, 0],
    [-1, -1],
    [1, -1],
];

const caroBoardElement = document.getElementById('caro_app') as HTMLElement;
const closeBtn = document.getElementById('closeModalBtn') as HTMLElement;
const backdrop = document.getElementById('modalBackdrop') as HTMLElement;

let caroBoardValue: (boolean|null)[][];
let caroBoardParams: CaroValue = [20, 20]; 
let caroScore: CaroValue = [0, 0];
let turn = true;

const createMatrix = <T>(rows: number, cols: number, defaultValue: T): T[][] =>
    Array.from({ length: cols }, () =>
      Array.from({ length: rows }, () => defaultValue)
    );

const parseCellId = (cellId: string): { i: number; j: number } | null => {
    const match = cellId.match(/^cell_(\d+)-(\d+)$/);
    return match
      ? { i: parseInt(match[1], 10), j: parseInt(match[2], 10) }
      : null;
  };

const addVector = (location: Coordinates, vector: Coordinates): Coordinates => [location[0] + vector[0], location[1] + vector[1]];
const mulWithK = (vector: Coordinates, k:number): Coordinates => [k * vector[0], k * vector[1]];

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
    caroBoardElement.innerHTML = '';

    for (let i: number = 0; i < colNum; i++) {
        const rowElement:HTMLElement = createElement('div', [`row_${i}`, 'row_item'], null);
        for (let j: number = 0; j < rowNum; j++) {
            const cellElement:HTMLElement = createElement('div', [`cell_item`], null, `cell_${i}-${j}`);
            rowElement.appendChild(cellElement);
        }
        caroBoardElement.appendChild(rowElement);
    }
}

const updateScore = ():void => {
    const scoreElement = document.getElementById('score') as HTMLElement;
    const [left, right] = caroScore;
    scoreElement.innerHTML = `${left} - ${right}`;
}

const checkResult = (location: Coordinates, turn: boolean, limit: number = 0) => {
    const rays: Coordinates = [-1, 1];
    let cotinuousScore: number = 0;
    let isVictory: boolean = false;

    for (let key of DIRECTION_VECTORS) {
        cotinuousScore = 1;
        for (let ray of rays) {
            for (let k: number = 1; k <= 5; k++) {
                const nextVector: Coordinates = mulWithK(key, k * ray);
                const [nextX, nextY]: Coordinates = addVector(location, nextVector);
                if (nextX < 0 || nextY < 0 || nextX >= caroBoardParams[0] || nextY >= caroBoardParams[1]) {
                    break;
                }

                if (caroBoardValue[nextX][nextY] === turn) {
                    cotinuousScore++;
                    if (cotinuousScore >= 5) {
                        isVictory = true;
                        return isVictory;
                    }
                } else {
                    break;
                }
            }
        }
    }
    return false;
}

const generateBtn: HTMLElement|null = document.getElementById('generate_btn');

generateBtn?.addEventListener('click', function () {
    const colInput = document.getElementById('col_num') as HTMLInputElement;
    const rowInput = document.getElementById('row_num') as HTMLInputElement;

    const rowNum: number = parseInt(colInput?.value) || 10;
    const colNum: number = parseInt(rowInput?.value) || 10;
    caroBoardParams[0] = rowNum;
    caroBoardParams[1] = colNum;

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
            alert('Đã đánh rồi, chơi cho đúng luật nào!');
            return;
        }
        caroBoardValue[i][j] = turn;
        const src:string = turn ? './icons/circle-icon.svg' : './icons/cross-icon.svg';
        const turnValue: any = createElement('img', ['caro_icon'], null);
        turnValue.src = src;
        target.appendChild(turnValue);
        if (checkResult([i, j], turn)) {
            alert(`${turn ? 'Parrot' : 'Dog' } win!!!!!!`);
            backdrop.style.display = 'flex';
            turn ? caroScore[0]++ : caroScore[1]++;
            updateScore();
        }
        turn = !turn
    }
});

caroBoardElement.addEventListener('mousemove', function(e) {
    const rect = caroBoardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    document.body.style.cursor = !turn ? "url('./icons/small-cross-icon.svg') 16 16, auto" : "url('./icons/small-circle-icon.svg') 16 16, auto";
  });

caroBoardElement.addEventListener('mouseleave', function(e) {
    document.body.style.cursor = "default";
  });

  

closeBtn.addEventListener('click', () => {
    backdrop.style.display = 'none';
});

backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
        backdrop.style.display = 'none';
    }
});
    
