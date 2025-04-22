const generateBtn: HTMLElement|null = document.getElementById('generate_btn');

const renderCaroBoard = (rowNum: number, colNum: number) => {
    for (let i: number = 0; i < rowNum; i++) {
        for (let j: number = 0; j < colNum; j++) {

        }
    }
}

generateBtn?.addEventListener('click', function () {
    const colInput = document.getElementById('col_num') as HTMLInputElement;
    const rowInput = document.getElementById('row_num') as HTMLInputElement;

    const rowNum: number = parseInt(colInput?.value) || 10;
    const colNum: number = parseInt(rowInput?.value) || 10;

    renderCaroBoard(rowNum, colNum);
});
    
