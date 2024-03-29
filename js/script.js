

var GRID_SIZE = 4;
var ANIMATION_DURATION = 100;
var m1=true, m2=true, m3=true, m4=true;
var grid = [];
var merging = [];
var score=0;
for (var i = 0; i < GRID_SIZE; i++) {
	var row1 = [];
	var row2 = [];

	for (var j = 0; j < GRID_SIZE; j++) {
		row1.push(null);
		row2.push(false);
	}

	grid.push(row1);
	merging.push(row2);
}

function makeNew(row, col) {
	var number = Math.random() < 0.9 ? 2 : 4;
	var color = pikColor(number);
	var textcolor = textColor(number);

	return grid[row][col] = $('<div>').css({
		background : color,
		color : textColor,
		top : row * 100 + 'px',
		left : col * 100 + 'px'
	}).text(number).addClass('box').appendTo($('#grid'));
	// $('#grid').append($('#grid .box:first'));
	
}

function hasUnusedCell() {
	for (var i = 0; i < GRID_SIZE; i++) {
		for (var j = 0; j < GRID_SIZE; j++) {
			if (grid[i][j] == null) {
				return true;
			}
		}
	}

	return false;
}

// Find Unused Cell
function findUnusedCell() {
	while (true) {
		var row = Math.floor(Math.random() * GRID_SIZE);
		var col = Math.floor(Math.random() * GRID_SIZE);

		if (grid[row][col] == null) {
			return [ row, col ];
		}
	}
}

// check if relationBlocked
function isRelationBlocked(row1, col1, row2, col2) {
	if (row1 == row2) {
		var min = Math.min(col1, col2);
		var max = Math.max(col1, col2);

		for (var mid = min + 1; mid < max; mid++) {
			if (grid[row1][mid])
				return true;
		}
	} else {
		var min = Math.min(row1, row2);
		var max = Math.max(row1, row2);

		for (var mid = min + 1; mid < max; mid++) {
			if (grid[mid][col1])
				return true;
		}
	}

	return false;
}
// try to move
function tryMove(row1, col1, row2, col2) {
	if (grid[row1][col1] == null || isRelationBlocked(row1, col1, row2, col2)) {
		return false;
	}

	if (grid[row2][col2] == null) {
		return move(row1, col1, row2, col2);
	} else if (grid[row1][col1].text() == grid[row2][col2].text()) {
		return merge(row1, col1, row2, col2);
	}

	return false;
}

// Tile moving
function move(row1, col1, row2, col2) {
	grid[row2][col2] = grid[row1][col1];
	grid[row1][col1] = null;
	var number = grid[row2][col2].text() * 1;
	var color = pikColor(number);
	var textcolor = textColor(number);

	grid[row2][col2].css({
		background : color,
		color : textcolor
	}).animate({
		top : row2 * 100 + 'px',
		left : col2 * 100 + 'px'
	}, 100).text(number);

	return true;
}

// move the cell up
function moveUp() {
	var moved = false;

	for (var i = 0; i < GRID_SIZE; i++) {
		for (var j = 0; j < GRID_SIZE; j++) {
			for (var k = j + 1; k < GRID_SIZE; k++) {
				if (tryMove(k, i, j, i)) {
					moved = true;
				}
			}
		}
	}

	if (moved) {
		didMovement();
		return (moved);
	}
	else{return (moved);}
}

// move the cell down
function moveDown() {
	var moved = false;

	for (var i = 0; i < GRID_SIZE; i++) {
		for (var j = GRID_SIZE - 1; j >= 0; j--) {
			for (var k = j - 1; k >= 0; k--) {
				if (tryMove(k, i, j, i)) {
					moved = true;
				}
			}
		}
	}

	if (moved) {
		didMovement();
		return (moved);
	}
	else{return (moved);}
}

// move the cell left
function moveLeft() {
	var moved = false;

	for (var i = 0; i < GRID_SIZE; i++) {
		for (var j = 0; j < GRID_SIZE; j++) {
			for (var k = j + 1; k < GRID_SIZE; k++) {
				if (tryMove(i, k, i, j)) {
					moved = true;
				}
			}
		}
	}

	if (moved) {
		didMovement();
		return (moved);
	}
	else{return (moved);}
}

// move the cell right
function moveRight() {
	var moved = false;

	for (var i = 0; i < GRID_SIZE; i++) {
		for (var j = GRID_SIZE - 1; j >= 0; j--) {
			for (var k = j - 1; k >= 0; k--) {
				if (tryMove(i, k, i, j)) {
					moved = true;
				}
			}
		}
	}

	if (moved) {
		didMovement();
		return (moved);
	}
	else{return (moved);}
}

// merge two cells
function merge(row1, col1, row2, col2) {
	if (merging[row2][col2]) {
		return false;
	}

	grid[row2][col2].remove();
	grid[row2][col2] = grid[row1][col1];
	grid[row1][col1] = null;
	var number = grid[row2][col2].text() * 2;
	var color = pikColor(number);
	var textcolor = textColor(number);
	merging[row2][col2] = true;

	grid[row2][col2].css({
		top : row2 * 100 + 'px',
		left : col2 * 100 + 'px'
	}).text(number).animate({
		height : '90px',
		width : '90px'
	}, 100).animate({
		backgroundColor : color,
		color : textcolor
	}, 100).animate({
		height : '80px',
		width : '80px'
	}, 100);
		score=score+number;
	$( ".test" ).remove();
	$( '<div class="test">' ).text(score).appendTo( "#score" );
	
	return true;
}

// cleare merging
function clearMerging() {
	for (var i = 0; i < GRID_SIZE; i++) {
		for (var j = 0; j < GRID_SIZE; j++) {
			merging[i][j] = false;
		}
	}
}

function didMovement() {
	clearMerging();

	if (hasUnusedCell()) {
		var unused = findUnusedCell();
		makeNew(unused[0], unused[1]);
	}
}

// pick a color

function pikColor(number) {
	var color;
	switch (number) {
	case 2:
		color = '#EEEE4DA'
		break;
	case 4:
		color = '#EDE0C8'
		break;
	case 8:
		color = '#F2B179'
		break;
	case 16:
		color = '#EE770F'
		break;
	case 32:
		color = '#EE4A0F'
		break;
	case 64:
		color = '#EE0F0F'
		break;
	case 128:
		color = '#E4D505'
	case 256:
		color = '#EDED62'
		break;
	case 512:
		color = '#B4C953'
	case 1024:
		color = '#E5FF71'
	default:
		color = '#3CF713'
	}
	return color;
}

// text's color 
function textColor(number) {
	var textColor;
	if (number <= 4) {
		textColor = "#776E65";
	} else {
		textColor = "#F9F6F2";
	}
	return textColor;
}

function makebageground() {
			for (var i = 0; i < GRID_SIZE; i++) {
		
		
			for (var j = 0; j < GRID_SIZE; j++) {
				
				$('<div>').css({
					background : "#960",
					color : textColor,
					top : i * 100 + 'px',
					left : j * 100 + 'px'
				}).addClass('box').appendTo($('#back'));
				
			}
		
			
		}
	}

$(document).ready(function() {
	
    $(document).keydown(function(e) {
								 window.scrollTo(0, 0);
      if (e.keyCode == 37) {m1 = moveLeft(); }
      if (e.keyCode == 38) {m2 = moveUp();window.scrollTo(0, 0);}
      if (e.keyCode == 39) {m3 = moveRight();window.scrollTo(0, 0);}
      if (e.keyCode == 40) {m4 = moveDown();window.scrollTo(0, 0);}
	 
    });
	
	if(!m1 & !m2 & !m3 & !m4){
	
		$( '#cover' ).removeClass( 'ende' ).addClass( 'end' );
		}
	makebageground();
    var unused = findUnusedCell();
    makeNew(unused[0], unused[1]);

    var unused = findUnusedCell();
    makeNew(unused[0], unused[1]);
  });
