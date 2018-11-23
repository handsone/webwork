var app = new PIXI.Application(window.innerWidth, window.innerHeight , {backgroundColor: 0xFF6600});
document.body.appendChild(app.view);
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";

var maxCount = 16;
var currentCount = 0;
var score  =  0 ;

var style = new PIXI.TextStyle({
	fontFamily: 'Arial',
	fontSize: 60,
	fontStyle: 'italic',
	fontWeight: 'bold',
	fill: ['#ffffff', '#00ff99'], 
	stroke: '#4a1850',
	strokeThickness: 5,
	dropShadow: true,
	dropShadowColor: '#000000',
	dropShadowBlur: 4,
	dropShadowAngle: Math.PI / 6,
	dropShadowDistance: 6,
	wordWrap: true,
	wordWrapWidth: 440
});


var richText = new PIXI.Text('2048', style);
richText.x = app.renderer.width / 2  ;
richText.y = app.renderer.height / 8;
app.stage.addChild(richText);

var scoreText = new  PIXI.Text('Score:' + score ,{
	fontSize:48
});
scoreText.x =  200 ;
scoreText.y =  200 ;
app.stage.addChild(scoreText);


var grid = [] ;
for (var i = 0; i < 4; i++) {
	grid[i] = [0, 0, 0, 0];
}

function getColorByNumber(number) {
	var colorValue = {
		0: 0xF98903,
		2: 0xF4E1E1,
		4: 0xC62727,
		8: 0x4C3232,
		16:0x1C1124,
		32:0x693E52,
		64:0x8AACFF,
		128:0x6D42C7,
		256:0x45171D,
		512:0xF03861,
		1024:0x432C51,
		2048:0xA10054
	};
	var color = colorValue[number];
	if (color === undefined) {
		color = 0xff0fff;
	}

	return color;
}


var flushUI = function () {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			drawCell(i, j);
		}
	}

	scoreText.text = 'Score: ' + score;
};

function drawCell(rowIndex, columnIndex) {

	var graphics = new PIXI.Graphics();
	var width = app.renderer.width ;
	var height = app.renderer.height ;
	graphics.beginFill(getColorByNumber(grid[rowIndex][columnIndex]), 1);
	graphics.lineStyle(7, 0xFF6600, 1);
	graphics.drawRect(width / 8 * 3 + columnIndex * width / 15, height / 8 * 2  + rowIndex * width / 15, width / 15, width / 15 );
	app.stage.addChild(graphics);
	if (grid[rowIndex][columnIndex] !== 0) {
		var number = new PIXI.Text(grid[rowIndex][columnIndex], {
			fontSize: 48
		});
		number.anchor.set(0.5);
		number.x = width / 30 + width  / 8 * 3 + columnIndex * width / 15;	
		number.y = width / 30 + height / 8 * 2 + rowIndex * width / 15;
		app.stage.addChild(number);
	}
};

function generateRandomNumber() {
	return Math.floor(Math.random() * 4);
}

var addRandomCell = function () {
	if (currentCount === maxCount) return;

	var rowIndex = generateRandomNumber();
	var columnIndex = generateRandomNumber();

	while (grid[rowIndex][columnIndex] !== 0) {
		rowIndex = generateRandomNumber();
		columnIndex = generateRandomNumber();
	}

	grid[rowIndex][columnIndex] = 2;
	currentCount++;
};


function moveCellToRight() {
	var isChanged = false;

	for (var rowIndex = 0; rowIndex < 4; rowIndex++) {
		for (var columnIndex = 2; columnIndex >= 0; columnIndex--) {
			if (grid[rowIndex][columnIndex] === 0) continue;

			var theEmptyCellIndex = findTheFirstRightCell(rowIndex, columnIndex);
			if (theEmptyCellIndex !== -1) {
				grid[rowIndex][theEmptyCellIndex] = grid[rowIndex][columnIndex];
				grid[rowIndex][columnIndex] = 0;
				isChanged = true;
			}
			var currentIndex = theEmptyCellIndex === -1 ? columnIndex : theEmptyCellIndex;

			if (grid[rowIndex][currentIndex] === grid[rowIndex][currentIndex + 1]) {
				grid[rowIndex][currentIndex + 1] += grid[rowIndex][currentIndex];
				grid[rowIndex][currentIndex] = 0;

				score += grid[rowIndex][currentIndex + 1];

				isChanged = true;

				currentCount--;
			}

		}
	}

	return isChanged;
}

function findTheFirstRightCell(rowIndex, columnIndex) {
	for (let i = 3; i > columnIndex; i--) {
		if (grid[rowIndex][i] === 0) {
			return i;
		}
	}

	return -1;
}

var onToRightEventHandler = function () {
	var isChanged = moveCellToRight();
	if (isChanged) {
		addRandomCell();
	}
	flushUI();
	if (checkGameOver()) {
		alert('Game over.');
	}
};

var onToDownEventHandler = function () {
	rotateArray(3);
	var isChanged = moveCellToRight();
	rotateArray(1);
	if (isChanged) {
		addRandomCell();
	}
	flushUI();
	if (checkGameOver()) {
		alert('Game over.');
	}
};

var onToLeftEventHandler = function () {
	rotateArray(2);
	var isChanged = moveCellToRight();
	rotateArray(2);
	if (isChanged) {
		addRandomCell();
	}
	flushUI();
	if (checkGameOver()) {
		alert('Game over.');
	}
};

var onToUpEventHandler = function () {
	rotateArray(1);
	var isChanged = moveCellToRight();
	rotateArray(3);
	if (isChanged) {
		addRandomCell();
	}
	flushUI();
	if (checkGameOver()) {
		alert('Game over.');
	}
};

function rotateArray(rotateCount = 1) {
	for (var i = 0; i < rotateCount; i++) {
		grid = rotateArrayToRightOnce(grid);
	}
	
           
	function rotateArrayToRightOnce(array) {      // es6 map映射函数：遍历每个值和索引,然后对每个值和索引条用回调函数
		return array.map((row, rowIndex) => { // 箭头函数
			return row.map((item, columnIndex) => {
				return array[3 - columnIndex][rowIndex];
			})
		})
	}
}

function checkGameOver() {
	if (currentCount !== maxCount) return false;

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (grid[i][j] === grid[i][j - 1] ||
				grid[i][j] === grid[i][j + 1] ||
				(grid[i-1] && grid[i][j] === grid[i - 1][j]) ||
				(grid[i+1] && grid[i][j] === grid[i + 1][j])
			) {
				return false;
			}
		}
	}

	return true;
}

addRandomCell();
addRandomCell();
flushUI();

document.addEventListener('keydown', function (event) {
	if (event.key === 'ArrowRight') {
		onToRightEventHandler();
	}

	if (event.key === 'ArrowUp') {
		onToUpEventHandler();
	}

	if (event.key === 'ArrowLeft') {
		onToLeftEventHandler();
	}

	if (event.key === 'ArrowDown') {
		onToDownEventHandler();
	}
});


var hammertime = new Hammer.Manager(document, {
	recognizers: [
		[Hammer.Swipe, {direction: Hammer.DIRECTION_ALL}]
	]
});
hammertime.on('swiperight', function() {
	onToRightEventHandler();
});
hammertime.on('swipeup', function () {
	onToUpEventHandler();
});
hammertime.on('swipeleft', function () {
	onToLeftEventHandler();
});
hammertime.on('swipedown', function () {
	onToDownEventHandler();
});


