class Entity extends createjs.Container {
  constructor(width, x, y, map) {
    super()

    this.width = width
    this.isMoving = false
    this.coord = new createjs.Point(x, y)
    this.map = map
    this.direction = Direction.NONE

    this.setBounds(0, 0, width, width)
    this.setCoord(x, y)
  }

  getCoord() {
    return this.coord
  }

  setCoord(x, y) {
    this.coord.x = x
    this.coord.y = y
  }

  isCollidingWith(object) {
    const HIT_DIST = 250
    return (Math.pow(this.x - object.x, 2) + Math.pow(this.y - object.y, 2)) < HIT_DIST
  }

  canMoveLeft() {
    var originCoord = this.getCoord()
    return this.map.getIsCoordMoveable(originCoord.x - 1, originCoord.y)
  }

  canMoveRight() {
    var originCoord = this.getCoord()
    return this.map.getIsCoordMoveable(originCoord.x + 1, originCoord.y)
  }

  canMoveUp() {
    var originCoord = this.getCoord()
    return this.map.getIsCoordMoveable(originCoord.x, originCoord.y - 1)
  }

  canMoveDown() {
    var originCoord = this.getCoord()
    return this.map.getIsCoordMoveable(originCoord.x, originCoord.y + 1)
  }

  tryToMoveLeft() {
    if (this.canMoveLeft()) {
      this.direction = Direction.LEFT
      var originCoord = this.getCoord()
      this.moveToDestination(originCoord.x - 1, originCoord.y)
      this.sprite.gotoAndStop("left")
    }
  }

  tryToMoveRight() {
    if (this.canMoveRight()) {
      this.direction = Direction.RIGHT
      var originCoord = this.getCoord()
      this.moveToDestination(originCoord.x + 1, originCoord.y)
      this.sprite.gotoAndStop("right")
    }
  }

  tryToMoveUp() {
    if (this.canMoveUp()) {
      this.direction = Direction.UP
      var originCoord = this.getCoord()
      this.moveToDestination(originCoord.x, originCoord.y - 1)
      this.sprite.gotoAndStop("up")
    }
  }

  tryToMoveDown() {
    if (this.canMoveDown()) {
      this.direction = Direction.DOWN
      var originCoord = this.getCoord()
      this.moveToDestination(originCoord.x, originCoord.y + 1)
      this.sprite.gotoAndStop("down")
    }
  }

  moveToDestination(x, y) {
    var destinationPosition = this.map.getCoordToMap(x, y)
    this.isMoving = true;

    createjs.Tween.get(this).to({x:destinationPosition.x, y:destinationPosition.y}, this.getSpeed(), createjs.Ease.linear).call(function() {
      this.isMoving = false;
      this.setCoord(x, y)
    }.bind(this))
  }

  getSquaredDistanceLeftToPoint(x, y) {
    var originCoord = this.getCoord()
    var destinationPosition = this.map.getCoordToMap(originCoord.x - 1, originCoord.y)
    return Math.pow(x - destinationPosition.x, 2) + Math.pow(y - destinationPosition.y, 2)
  }

  getSquaredDistanceRightToPoint(x, y) {
    var originCoord = this.getCoord()
    var destinationPosition = this.map.getCoordToMap(originCoord.x + 1, originCoord.y)
    return Math.pow(x - destinationPosition.x, 2) + Math.pow(y - destinationPosition.y, 2)
  }

  getSquaredDistanceUpToPoint(x, y) {
    var originCoord = this.getCoord()
    var destinationPosition = this.map.getCoordToMap(originCoord.x, originCoord.y - 1)
    return Math.pow(x - destinationPosition.x, 2) + Math.pow(y - destinationPosition.y, 2)
  }

  getSquaredDistanceDownToPoint(x, y) {
    var originCoord = this.getCoord()
    var destinationPosition = this.map.getCoordToMap(originCoord.x, originCoord.y + 1)
    return Math.pow(x - destinationPosition.x, 2) + Math.pow(y - destinationPosition.y, 2)
  }
}

class Player extends Entity {
  constructor(spritesheet, width, x, y, map) {
    super(width, x, y, map)

    this.isAlive = true
    this.shape = new createjs.Shape()
    this.addChild(this.shape)

    var sprite = new createjs.Sprite(spritesheet)
    sprite.scale = width / 20
    setAnchorPointCenter(sprite)
    sprite.x = width * .5
    sprite.y = width * .5
    this.addChild(sprite)
    this.sprite = sprite

    this.shape.graphics.beginFill("#ffff00").drawCircle(width/2, width/2, width/2);
  }

  playHurtAnimation() {
    this.sprite.gotoAndStop("hurt")
  }

  restoreAnimation() {
    this.sprite.gotoAndStop(this.direction)
  }

  getSpeed() {
    return 250
  }
}

class Answer extends Entity {
  constructor(x, y, map, valueString) {
    var label = new createjs.Text(valueString, "20px Courier", "#dea185");

    var width = label.getMeasuredWidth()

    super(width, x, y, map)

    this.valueString = valueString

    setAnchorPointCenter(label)
    label.x = width / 2
    label.y = width / 2

    this.addChild(label)
    this.label = label
  }
}

class Enemy extends Entity {
  constructor(spritesheet, width, x, y, map, type) {
    super(width, x, y, map)

    this.map = map
    this.speed = 700 + randomInt(0, 250)
    this.type = type

    var sprite = new createjs.Sprite(spritesheet)
    sprite.scale = width / 20
    setAnchorPointCenter(sprite)
    sprite.x = width * .5
    sprite.y = width * .5
    this.addChild(sprite)
    this.sprite = sprite
  }

  startPatrolling() {
    this.tryToMoveUp()
  }

  getSpeed() {
    return this.speed
  }
}
