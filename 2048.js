const log = console.log.bind(console)

const e = function(selector) {
	let element = document.querySelector(selector)
	if (element === null) {
		let s = `选择器 ${selector} 写错了, 请仔细检查并且复习三种基本的选择器`
		// alert(s)
		return null
	} else {
		return element
	}
}

const es = function(selector) {
	let elements = document.querySelectorAll(selector)
	if (elements.length === 0) {
		let s = `选择器 ${selector} 写错了, 请仔细检查并且复习三种基本的选择器`
		// alert(s)
		return []
	} else {
		return elements
	}
}

const templateCell = function(line, x) {
	let result = ''
	for (let i = 0; i < line.length; i++) {
		let a = line[i]
		result += `<div class="cell" data-number="${a}" data-x="${x}" data-y="${i}"></div>`
	}
	return result
}

const templateRow = function(square) {
	let result = ''
	for (let i = 0; i < square.length; i++) {
		result += '<div class="row clearfix">'
		let n = square[i]
		let x = i
		result += templateCell(n, x)
		result += '</div><br>'
	}
	return result
}

//生成地图
const renderSquare = function(square) {
	let map = document.querySelector('#id-div-mime')
	map.innerHTML = templateRow(square)
}

//新游戏
const newgame = function() {
	let button = e('#id-button-newgame')
	button.addEventListener('click', function() {
		let score = e('.score-container')
		score.innerHTML = 0
		square = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
		score2048 = 0
		renderSquare(square)
		randomNum(square)
		randomNum(square)
		bindEvent(square)
	})
}

//更新数字
const update = function(array) {
	for (let i = 0; i < array.length; i++) {
		let n = array[i]
		for (let j = 0; j < n.length; j++) {
			let div = e(`[data-x="${i}"][data-y="${j}"]`)
			let number = array[i][j]
			if (array[i][j] !== 0) {
				div.innerHTML = number
				div.className = 'cell n' + `${number}`
			} else {
				div.innerHTML = ''
				div.className = 'cell'
			}
		}
	}
}

//判断游戏结束
const gameover = function(square) {
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			//数组还有0， 返回false
			if (square[i][j] === 0) {
				return false
			}
			//左右两边相等， 返回false
			if (j < 3) {
				if (square[i][j] === square[i][j + 1]) {
					return false
				}
			}
			//上下两边相等， 返回false
			if (i < 3) {
				if (square[i][j] === square[i + 1][j]) {
					return false
				}
			}
		}
	}
	return true
}

//弹出游戏结束界面
const alertgameover = function() {
	let over = e('.game-message')
	over.style.display = 'inline'
}
//关闭弹窗，开始新游戏
const closewindow = function() {
	let tryagain = e('.retry-button')
	tryagain.addEventListener('click', function() {
		let over = e('.game-message')
		over.style.display = 'none'
		let score = e('.score-container')
		score.innerHTML = 0
		square = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
		score2048 = 0
		renderSquare(square)
		randomNum(square)
		randomNum(square)
		bindEvent(square)
	})
}

//随机数字
const randomNum = function(square) {
	for (let i = 0; i < 100; i++) {
		let x = Math.floor(Math.random() * 4)
		let y = Math.floor(Math.random() * 4)
		if (square[x][y] === 0) {
			let random = Math.random() < 0.8 ? 2 : 4
			square[x][y] = random
			let choice = `[data-x="${x}"][data-y="${y}"]`
			let index = e(choice)
			index.innerHTML = random
			break
		}
	}
	update(square)
}

//左移动
const moveleft = function(array) {
	let before = JSON.stringify(array)
	let score = e('.score-container')
	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < 3; j++) {
			let next = leftindex(i, j, array)
			if (next !== -1) {
				if (array[i][j] === 0) {
					log('next', next)
					array[i][j] = array[i][next]
					array[i][next] = 0
					j--
				} else if (array[i][j] === array[i][next]) {
					array[i][j] *= 2
					array[i][next] = 0
					//分数
					score2048 += array[i][j]
					score.innerHTML = score2048
				}
			}
		}
	}
	//判断是否能移动，能移动产生随机数字
	let after = JSON.stringify(array)
	if (before !== after) {
		randomNum(array)
	}
}
const leftindex = function(i, j, array) {
	for (let a = j + 1; a < 4; a++) {
		if (array[i][a] !== 0) {
			return a
		}
	}
	return -1
}

//右移动
const moveright = function(array) {
	let before = JSON.stringify(array)
	let score = e('.score-container')
	for (let i = 3; i >= 0; i--) {
		for (let j = 3; j > 0; j--) {
			let next = rightindex(i, j, array)
			if (next !== -1) {
				if (array[i][j] === 0) {
					array[i][j] = array[i][next]
					array[i][next] = 0
				} else if (array[i][j] === array[i][next]) {
					array[i][j] *= 2
					array[i][next] = 0
					//分数
					score2048 += array[i][j]
					score.innerHTML = score2048
				}
			}
		}
	}
	let after = JSON.stringify(array)
	if (before !== after) {
		randomNum(array)
	}
}
const rightindex = function(i, j, array) {
	for (let a = j - 1; a >= 0; a--) {
		if (array[i][a] !== 0) {
			return a
		}
	}
	return -1
}

//上移动
const moveup = function(array) {
	let before = JSON.stringify(array)
	let score = e('.score-container')
	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < 3; j++) {
			let next = upindex(i, j, array)
			if (next !== -1) {
				if (array[j][i] === 0) {
					log('next', next)
					array[j][i] = array[next][i]
					array[next][i] = 0
					j--
				} else if (array[j][i] === array[next][i]) {
					array[j][i] *= 2
					array[next][i] = 0
					//分数
					score2048 += array[i][j]
					score.innerHTML = score2048
				}
			}
		}
	}
	let after = JSON.stringify(array)
	if (before !== after) {
		randomNum(array)
	}
}
const upindex = function(i, j, array) {
	for (let a = j + 1; a < 4; a++) {
		if (array[a][i] !== 0) {
			return a
		}
	}
	return -1
}

//下移动
const movedown = function(array) {
	let before = JSON.stringify(array)
	let score = e('.score-container')
	for (let i = 3; i >= 0; i--) {
		for (let j = 3; j > 0; j--) {
			let next = downindex(i, j, array)
			if (next !== -1) {
				if (array[j][i] === 0) {
					log('next', next)
					array[j][i] = array[next][i]
					array[next][i] = 0
					j--
				} else if (array[j][i] === array[next][i]) {
					array[j][i] *= 2
					array[next][i] = 0
					//分数
					score2048 += array[i][j]
					score.innerHTML = score2048
				}
			}
		}
	}
	let after = JSON.stringify(array)
	if (before !== after) {
		randomNum(array)
	}
}
const downindex = function(i, j, array) {
	for (let a = j - 1; a >= 0; a--) {
		if (array[a][i] !== 0) {
			return a
		}
	}
	return -1
}

//绑定事件
const bindEvent = function(square) {
	window.addEventListener('keydown', function(event ) {
		let key = event.key
		log(key)
		if (key === 'a') {
			moveleft(square)
			update(square)
			if (gameover(square)) {
				alertgameover()
			}
		}
		if (key === 'd') {
			moveright(square)
			update(square)
			if (gameover(square)) {
				alertgameover()
			}
		}
		if (key === 'w') {
			moveup(square)
			update(square)
			if (gameover(square)) {
				alertgameover()
			}
		}
		if (key === 's') {
			movedown(square)
			update(square)
			if (gameover(square)) {
				alertgameover()
			}
		}

		if (key === 'ArrowLeft') {
			moveleft(square)
			update(square)
			if (gameover(square)) {
				alertgameover()
			}
		}
		if (key === 'ArrowRight') {
			moveright(square)
			update(square)
			if (gameover(square)) {
				alertgameover()
			}
		}
		if (key === 'ArrowUp') {
			moveup(square)
			update(square)
			if (gameover(square)) {
				alertgameover()
			}
		}
		if (key === 'ArrowDown') {
			movedown(square)
			update(square)
			if (gameover(square)) {
				alertgameover()
			}
		}
	})
}


const __main = function() {
	renderSquare(square)
	randomNum(square)
	randomNum(square)
	bindEvent(square)
	newgame()
	closewindow()
	// log(square)
}
let square = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
let score2048 = 0
__main()