function initSuSo() {
	window.suSoCells = [];
	window.completed = 0;
	for(var i = 9; i--;){
		suSoCells[i] = [];
		for(var j = 9; j--;){
			suSoCells[i][j] = new SuSoCell(i,j)
		}
	}
	for(var i = 9; i--;){
		for(var j = 9; j--;){
			var currentCell = suSoCells[i][j];
			for(var k = 9; k--;){
				if(k != currentCell.column) currentCell.rowCells.push(suSoCells[i][k])
				if(k != currentCell.row)currentCell.columnCells.push(suSoCells[k][j])
			}
			var firstPosX = Math.floor(i/3) * 3;
			var firstPosY = Math.floor(j/3) * 3;
			for (var x = 3; x--;) {
				for (var y = 3; y--;) {
					//firstPosX + x es igual a la posicion de la celda del bloque, al igual que las posiciones de las celdas y.
					if (firstPosX + x != i || firstPosY + y != j) {
						currentCell.blockCells.push(suSoCells[firstPosX + x][firstPosY + y]);
					}
				}
			}
		}
	}
}

function solve() {
	while(completed < 81) {
		for(var i = 9; i--;) {
			for(var j = 9; j--;) {
				var currentCell = suSoCells[i][j];
				if(!currentCell.value) {
					currentCell.updateRow();
					currentCell.updateColumn();
				}
			}
		}
	}
	return suSoCells;
}

function filterElements(cell, index, array, currentCell) {
	if(cell.value) {
		removePossible(currentCell, value);
		return false; //tengo que remover el elemento de mis columnas o filas y, eliminarlo de los valores posibles, esto lo hago para una version futura
	}
	return true;
}

function removePossible(cell, value) {
	var index = cell.possibleValues.indexOf(value);
	if (index > -1) {
	    cell.possibleValues.splice(index, 1);
	}
}

function SuSoCell(row, column) {
	this.value = undefined;
	this.possibleValues = [1,2,3,4,5,6,7,8,9];
	this.row = row;
	this.column = column;
	this.coords = [row,column];
	this.rowCells = [];
	this.columnCells = [];
	this.blockCells = [];
	//update row, but the only thing it does, is chekcking the other cells to remove those with a value, and remove that values from possible values
	//so it can minimize the effort the next time you want to update this row and column
	this.updateRow = function() {
		this.rowCells = this.rowCells.filter(filterElements, this);
		if(this.possibleValues.length == 1) this.setValue(this.possibleValues[0]);
	};
	this.updateColumn = function() {
		this.columnCells = this.columnCells.filter(filterElements, this);
		if(this.possibleValues.length == 1) this.setValue(this.possibleValues[0]);
	};
	this.setValue = function(val) {
		//todo update values of other cells
		completed++;
		this.value = val;
	}
}







//matrix generation
$( document ).ready(function() {
	var rows = 9;
	var columns = 9;
	var form = document.getElementById("frm");
	for(var i = 0; i < rows; i++){
		for(var j = 0; j < columns; j++){
			var input = $('<input>').attr({class: 'matrix_cell'});
			form.appendChild(input[0]);
		}
		var br = $('<br>')[0];
		form.appendChild(br);
	}

	$("#get").click(function() {
		 console.log(getMatrix());
	});

	function getMatrix(){
		 var matrix_row = [];
		 var ind = 0;
		 $("#frm").contents().each(function(i,e){
			  if (this.nodeName == "INPUT") {
					if (!matrix_row[ind]){
						 matrix_row.push([]);
					}
					matrix_row[ind].push($(this).val());
			  }
			  else {
					ind++;
			  }
		 });
		 var len = matrix_row.length;
		 for(var i = len; i--;) {
			 var len2 = matrix_row[i].length;
			 for(var j = len2; j--;) {
				 suSoCells[i][j].setValue(matrix_row[i][j])
			 }
		 }
		 return matrix_row;
	}
});
