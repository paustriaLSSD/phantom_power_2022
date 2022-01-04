const MAP_DATA = [
  [4,3,3,3,3,3,3,3,3,3,3,3,5],
  [2,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,1,0,1,0,1,0,1,0,1,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,1,0,4,9,0,8,5,0,1,0,2],
  [2,0,0,0,11,0,0,0,11,0,0,0,2],
  [2,0,1,0,0,0,1,0,0,0,1,0,2],
  [2,0,0,0,10,0,0,0,10,0,0,0,2],
  [2,0,1,0,6,9,0,8,7,0,1,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,1,0,1,0,1,0,1,0,1,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,2],
  [6,3,3,3,3,3,3,3,3,3,3,3,7]
]

const WALL_THICKNESS = 5

class Map extends createjs.Container {
  constructor(rows, columns, width, height) {
    super()
    this.rows = rows
    this.columns = columns
    this.width = width
    this.height = height
    this.shape = new createjs.Shape()
    this.addChild(this.shape)

    this.setBounds(0, 0, width, height)

    var blockWidth = this.getBlockWidth()


    for (let row = 0; row < this.rows; ++row) {
      for (let column = 0; column < this.columns; ++column) {

        this.shape.graphics.setStrokeStyle(WALL_THICKNESS,"round").beginStroke("#121266");

        switch (MAP_DATA[row][column]) {
          case 1:

            drawLeftEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            drawTopEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            drawRightEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            drawBottomEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            break
          case 2:
            drawLeftEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            drawRightEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            break
          case 3:
            drawTopEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            drawBottomEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            break
          case 4:
            drawTopEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            drawLeftEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            break
          case 5:
            drawTopEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            drawRightEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            break
          case 6:
            drawBottomEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            drawLeftEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            break
          case 7:
            drawBottomEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            drawRightEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            break
          case 8:
            drawTopEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            drawLeftEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            drawBottomEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            break
          case 9:
            drawTopEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            drawRightEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            drawBottomEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            break
          case 10:
            drawTopEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            drawRightEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            drawLeftEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            break
          case 11:
            drawBottomEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            drawRightEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            drawLeftEdge(this.shape.graphics, column * blockWidth, row * blockWidth, blockWidth)
            break
          default:
            break
        }

        this.shape.graphics.endStroke()
      }
    }
  }

  getBlockWidth() {
    return this.width / this.rows
  }

  getCoordToMap(x, y) {
    var halfWidth = this.getBlockWidth() / 2
    return new createjs.Point(x * this.getBlockWidth() + halfWidth,
                              y * this.getBlockWidth() + halfWidth)
  }

  getIsCoordMoveable(x, y) {
    return (MAP_DATA[y][x] == 0)
  }
}

function drawLeftEdge(graphics, x, y, blockWidth) {
  graphics.moveTo(x, y)
  graphics.lineTo(x, y + blockWidth)
}

function drawRightEdge(graphics, x, y, blockWidth) {
  graphics.moveTo(x + blockWidth, y)
  graphics.lineTo(x + blockWidth, y + blockWidth)
}

function drawTopEdge(graphics, x, y, blockWidth) {
  graphics.moveTo(x, y)
  graphics.lineTo(x + blockWidth, y)
}

function drawBottomEdge(graphics, x, y, blockWidth) {
  graphics.moveTo(x, y + blockWidth)
  graphics.lineTo(x + blockWidth, y + blockWidth)
}
