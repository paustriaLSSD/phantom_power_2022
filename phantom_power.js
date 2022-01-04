const GameState = {
  MENU: 'menu',
  ROUND: 'round',
  END: 'end'
}

const Direction = {
  NONE: 'none',
  LEFT: 'left',
  UP: 'up',
  RIGHT: 'right',
  DOWN: 'down'
}

const PatrolType = {
  RANDOM: 'random',
  SEEK: 'seek'
}

const GameMode = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
}

const SPAWN_LOCATIONS = [
  [1,1],
  [6,1],
  [11,1],
  [1,6],
  [11,6],
  [1,11],
  [6,11],
  [11,11],
]

const KEYCODE_LEFT = 37
const KEYCODE_RIGHT = 39
const KEYCODE_UP = 38
const KEYCODE_DOWN = 40
const INPUT_LOCK_DURATION = 1500
const DISTRACTORS_COUNT = 4

const ASSET_MANIFEST = [
  { src:"button_easy.png", id:"playButtonEasy"},
  { src:"button_medium.png", id:"playButtonMedium"},
  { src:"button_hard.png", id:"playButtonHard"},
  { src:"Background_SM.png", id:"background"},
  { src:"Background_SM2.png", id:"backgroundDimmed"},
  { src:"Title_SM.png", id:"title"},
  { src:"collect.wav", id:"collect"},
  { src:"lose.wav", id:"lose"},
  { src:"spawn.wav", id:"spawn"},
  { src:"press.wav", id:"press"},
  { src:"playerSpritesheet.json", id:"playerSpritesheet", type:"spritesheet"},
  { src:"ghostSpritesheet.json", id:"ghostSpritesheet", type:"spritesheet"}
]

const PLAY_BUTTON_DESCRIPTORS = [
  {
    x: 0.5,
    y: 0.55,
    mode: GameMode.EASY,
    sprite: "playButtonEasy"
  },
  {
    x: 0.5,
    y: 0.7,
    mode: GameMode.MEDIUM,
    sprite: "playButtonMedium"
  },
  {
    x: 0.5,
    y: 0.85,
    mode: GameMode.HARD,
    sprite: "playButtonHard"
  },
]

const TITLE_LOCATION_X_PROPORTION = 0.5;
const TITLE_LOCATION_Y_PROPORTION = 0.25;
const ROWS = 13
const COLUMNS = 13
const UI_Y = 15;
const FIRST_INSTRUCTION = "Plot the y intercept"

class PhantomPower {
  constructor(width, height, stage) {
    this.width = width
    this.height = height
    this.stage = stage

    this.gameState = GameState.MENU;
  }

  init() {
    this.loader = new createjs.LoadQueue(true);
    this.loader.installPlugin(createjs.Sound);
    var loader = this.loader

    this.playButtons = []
    loader.addEventListener("complete", function() {
      PLAY_BUTTON_DESCRIPTORS.forEach(playButtonDescriptor => {
        var playButton = new createjs.Bitmap(loader.getResult(playButtonDescriptor.sprite))
        setAnchorPointCenter(playButton)
        playButton.x = this.width * playButtonDescriptor.x
        playButton.y = this.height * playButtonDescriptor.y
        playButton.mode = playButtonDescriptor.mode
        this.playButtons.push(playButton)
      });

      var background = new createjs.Bitmap(loader.getResult("background"));
      this.background = background;

      var backgroundDimmed = new createjs.Bitmap(loader.getResult("backgroundDimmed"));
      this.backgroundDimmed = backgroundDimmed;

      var title = new createjs.Bitmap(loader.getResult("title"));
      setAnchorPointCenter(title);
      title.x = this.width * TITLE_LOCATION_X_PROPORTION;
      title.y = this.height * TITLE_LOCATION_Y_PROPORTION;
      this.title = title;

      const event = new Event('assetsLoaded');
      dispatchEvent(event);
    }.bind(this));

    loader.loadManifest(ASSET_MANIFEST, true, "./assets/");
  }

  showTitle() {
    var stage = this.stage
    stage.addChild(this.background);

    var title = this.title
    stage.addChild(title);
    var titleOriginY = title.y
    var titleDestinationY = title.y - 5
    createjs.Tween.get(title, { loop: true }).to({y:titleDestinationY}, 1000, createjs.Ease.sineInOut).to({y:titleOriginY}, 1000, createjs.Ease.sineInOut);

    this.playButtons.forEach(playButton => {
      stage.addChild(playButton)

      playButton.addEventListener("click", function() {
        this.handlePlayButtonClick(playButton.mode);
      }.bind(this));
    })

    var text = new createjs.Text("Made for Cavelero Mid High School by Mr. Austria", "12px Courier New", "#a9ebf9")
    text.x = 65
    text.y = 542
    stage.addChild(text)
  }

  tearDownTitle() {
    this.playButtons.forEach(playButton => {
      playButton.removeAllEventListeners()
    });

    this.stage.removeAllEventListeners();
    this.stage.removeAllChildren();
  }

  keyDown(event) {
		this.keysPressed[event.keyCode] = true;
  }

  keyUp(event) {
    if (this.keysPressed && this.keysPressed[event.keyCode]) {
      delete this.keysPressed[event.keyCode];
    }
  }

  handleInput() {
    if (!this.player.isMoving) {
      if (this.keysPressed[KEYCODE_UP]) {
        this.player.tryToMoveUp();
      }
      else if (this.keysPressed[KEYCODE_DOWN]) {
        this.player.tryToMoveDown();
      }
      else if (this.keysPressed[KEYCODE_LEFT]) {
        this.player.tryToMoveLeft();
      }
      else if (this.keysPressed[KEYCODE_RIGHT]) {
        this.player.tryToMoveRight();
      }
    }
  }

  initGame(mode) {
    this.startTime = new Date();
    this.score = 0;
    this.currentStreak = 0;

    this.currentEquation;
    this.score = 0;
    this.currentStreak = 0;
    this.keysPressed = {}
    this.correctAnswers = 0;

    switch(mode) {
      case GameMode.EASY:
        this.pointsPerCorrect = 25
        this.concepts = getEasyConcepts()
        break
      case GameMode.MEDIUM:
        this.pointsPerCorrect = 50
        this.concepts = getMediumConcepts()
        break
      default:
        this.pointsPerCorrect = 100
        this.concepts = getHardConcepts()
    }

    document.onkeydown = this.keyDown.bind(this);
    document.onkeyup = this.keyUp.bind(this);
  }

  showGame() {
    var loader = this.loader
    var stage = this.stage

    stage.removeAllChildren();
    stage.removeAllEventListeners();
    this.background.removeAllEventListeners();
    this.backgroundDimmed.removeAllEventListeners();

    var background = this.backgroundDimmed
    stage.addChild(background);

    this.scoreLabel = createLabel(stage, "Score:", 18, "#a9ebf9", 20, UI_Y, "left");
    this.scoreCounter = createLabel(stage, "0", 18, "#a9ebf9", 90, UI_Y, "left")
    this.instructionLabel = createLabel(stage, "Simplify:", 20, "#a9ebf9", this.width / 2, UI_Y, "center")

    var map = new Map(COLUMNS, ROWS, 430, 430)
    setAnchorPointCenter(map);
    map.x = this.width / 2
    map.y = this.height - this.width / 2
    stage.addChild(map)
    this.map = map

    var playerSpritesheet = loader.getResult("playerSpritesheet")
    var player = new Player(playerSpritesheet, map.getBlockWidth(), 6, 9, this.map)
    setAnchorPointCenter(player)
    map.addChild(player)
    var playerCoord = player.getCoord()
    var playerLocation = map.getCoordToMap(playerCoord.x, playerCoord.y)
    player.x = playerLocation.x
    player.y = playerLocation.y
    this.player = player

    this.enemies = []
    this.answers = []

    this.gameState = GameState.ROUND;

    this.prepareNextRound()
  }

  spawnEnemy() {
    var type = PatrolType.SEEK
    if (this.correctAnswers % 2 == 0) {
      type = PatrolType.RANDOM
    }
    var loader = this.loader
    var enemySpritesheet = loader.getResult("ghostSpritesheet")
    var enemy = new Enemy(enemySpritesheet, this.map.getBlockWidth(), 6, 6, this.map, type)

    setAnchorPointCenter(enemy)
    this.map.addChild(enemy)
    var enemyCoord = enemy.getCoord()
    var enemyLocation = this.map.getCoordToMap(enemyCoord.x, enemyCoord.y)
    enemy.x = enemyLocation.x
    enemy.y = enemyLocation.y
    this.enemies.push(enemy)

    // fastboi...
    if (this.enemies.length % 4 == 0) {
      enemy.speed = 500
    }
  }

  spawnAnswer(valueString) {
    var possibleSpawnLocations = []
    var playerCoord = this.player.getCoord()

    // Add unoccupied spawn locations that are far from the player
    SPAWN_LOCATIONS.forEach(possibleSpawnLocation => {
      // check distance
      var coordDistance = Math.pow(playerCoord.x - possibleSpawnLocation[0], 2) + Math.pow(playerCoord.y - possibleSpawnLocation[1], 2)
      if (coordDistance > 10) {
        var isOccupied = false
        var isFarFromPlayer = true

        this.answers.forEach(answer => {
          var answerCoord = answer.getCoord()

          // check if occupied
          if (possibleSpawnLocation[0] == answerCoord.x && possibleSpawnLocation[1] == answerCoord.y) {
            isOccupied = true
          }
        })

        if (!isOccupied && isFarFromPlayer) {
          possibleSpawnLocations.push(possibleSpawnLocation)
        }
      }
    })

    var spawnLocation = getRandomElement(possibleSpawnLocations)
    var answer = new Answer(spawnLocation[0], spawnLocation[1], this.map, valueString)
    setAnchorPointCenter(answer)
    this.map.addChild(answer)
    var answerCoord = answer.getCoord()
    var answerLocation = this.map.getCoordToMap(answerCoord.x, answerCoord.y)
    answer.x = answerLocation.x
    answer.y = answerLocation.y
    this.answers.push(answer)
  }

  tearDownGame() {
    this.stage.removeAllEventListeners();
    this.stage.removeAllChildren();
  }

  prepareNextRound() {
    var concept = this.getNextConcept()
    this.problem = new ExponentialExpression(concept.numerator, concept.denominator, concept.exponent, 26)
    this.problem.x = this.width / 2
    this.problem.y = UI_Y + 53
    setAnchorPointCenter(this.problem)
    this.stage.addChild(this.problem)

    this.expectedAnswer = concept.answer
    this.problemType = concept.type

    this.spawnAnswer(concept.answer)

    var distractors = []
    if (concept.distractors) {
      distractors = concept.distractors
    }
    else {
      if (concept.answer != "1") {
        distractors.push("1")
      }

      for (var i = 1; i < 10; ++i) {
        var distractor = "x" + getExponentString(i)
        if (concept.answer != distractor) {
          distractors.push(distractor)
        }
      }
    }

    while (distractors.length > DISTRACTORS_COUNT) {
      var randomDistractor = getRandomElement(distractors)
      removeElement(distractors, randomDistractor)
    }

    distractors.forEach(distractor => {
      this.spawnAnswer(distractor)
    })
  }

  startRound() {
    this.gameState = GameState.ROUND;

    this.equationLabel.text = this.currentEquation;
    this.equationLabel.visible = true;

    this.instructionLabel.text = FIRST_INSTRUCTION;
    this.instructionLabel.visible = true;
  }

  increaseScore(delta) {
    this.score += delta
    this.scoreCounter.text = this.score
    this.scoreCounter.color = "#a9ebf9"
    createjs.Tween.get(this.scoreCounter).to({color:"#00ff00"}, 50, null)
                                         .to({color:"#ff0000"}, 50, null)
                                         .to({color:"#a9ebf9"}, 50, null)
                                         .to({color:"#00ffff"}, 50, null)
                                         .to({color:"#00ff00"}, 50, null)
                                         .to({color:"#a9ebf9"}, 50, null)
  }

  addFlyaway(x, y, message, color, onComplete=null) {
    var flyaway = new createjs.Text(message, "14px Courier New", color);
    flyaway.textAlign = "center";
    flyaway.x = x
    flyaway.y = y

    var originalColor = color
    var flashColor = "#a9ebf9"

    this.map.addChild(flyaway);
    createjs.Tween.get(flyaway).to({color:flashColor}, 50, null)
                               .wait(50)
                               .to({color:originalColor}, 50, null)
                               .wait(50)
                               .to({color:flashColor}, 50, null)
                               .wait(50)
                               .to({color:originalColor}, 50, null)
                               .wait(50);

    createjs.Tween.get(flyaway).to({y:flyaway.y - 10}, 1000, createjs.Ease.quadOut).call(function() {
        this.map.removeChild(flyaway);

        if (onComplete) {
          onComplete();
        }
    }, null, this);
  }

  handlePatrolling() {
    this.enemies.forEach(enemy => {
      if(!enemy.isMoving) {
        var possibleDirections = []
        if (enemy.canMoveUp() && enemy.direction != Direction.DOWN) {
          possibleDirections.push(Direction.UP)
        }
        if (enemy.canMoveRight() && enemy.direction != Direction.LEFT) {
          possibleDirections.push(Direction.RIGHT)
        }
        if (enemy.canMoveDown() && enemy.direction != Direction.UP) {
          possibleDirections.push(Direction.DOWN)
        }
        if (enemy.canMoveLeft() && enemy.direction != Direction.RIGHT) {
          possibleDirections.push(Direction.LEFT)
        }

        var choice = null

        if (enemy.type == PatrolType.RANDOM) {
          choice = getRandomElement(possibleDirections)
        }
        else if (enemy.type == PatrolType.SEEK) {
          var winningDirection = Direction.UP
          var winningDistance = Number.MAX_VALUE

          possibleDirections.forEach(possibleDirection => {
            var currentDistance = 0
            if (possibleDirection == Direction.UP) {
              currentDistance = enemy.getSquaredDistanceUpToPoint(this.player.x, this.player.y)
            }
            else if (possibleDirection == Direction.RIGHT) {
              currentDistance = enemy.getSquaredDistanceRightToPoint(this.player.x, this.player.y)
            }
            else if (possibleDirection == Direction.DOWN) {
              currentDistance = enemy.getSquaredDistanceDownToPoint(this.player.x, this.player.y)
            }
            else if (possibleDirection == Direction.LEFT) {
              currentDistance = enemy.getSquaredDistanceLeftToPoint(this.player.x, this.player.y)
            }
            if (currentDistance < winningDistance) {
              winningDistance = currentDistance
              winningDirection = possibleDirection
            }
          })

          choice = winningDirection
        }

        switch(choice) {
          case Direction.UP:
            enemy.tryToMoveUp()
            break
          case Direction.LEFT:
            enemy.tryToMoveLeft()
            break
          case Direction.DOWN:
            enemy.tryToMoveDown()
            break
          case Direction.RIGHT:
            enemy.tryToMoveRight()
            break
        }
      }
    })
  }

  checkForCollisions() {
    if (this.player.isAlive) {
      this.enemies.forEach(enemy => {
        if (this.player.isCollidingWith(enemy)) {
          this.handleCollisionWithEnemy(enemy)
        }
      })

      this.answers.forEach(answer => {
        if (this.player.isCollidingWith(answer)) {
          this.handleCollisionWithAnswer(answer)
        }
      })
    }
  }

  handleCollisionWithAnswer(answer) {
    var isCorrect = (answer.valueString == this.expectedAnswer)

    if (isCorrect) {
      createjs.Sound.play("collect");

      this.correctAnswers += 1

      if(this.correctAnswers % 3 == 0) {
        this.spawnEnemy()
      }


      this.addFlyaway(answer.x, answer.y, getCongratsMessage(), "#00ff00")

      var streakBonus = Math.round(this.currentStreak * 10)
      this.increaseScore(this.pointsPerCorrect + streakBonus)
      this.currentStreak += 1

      if (this.currentStreak >= 3) {
        this.addFlyaway(answer.x, answer.y - 15, "COMBO x" + this.currentStreak, "#a9ebf9")
      }

      this.answers.forEach(answer => {
        this.map.removeChild(answer)
      });
      this.answers = []

      this.stage.removeChild(this.problem)

      this.prepareNextRound()
    }
    else {
      createjs.Sound.play("spawn");

      this.addFlyaway(answer.x, answer.y, "Not quite...", "#ff0000")
      this.map.removeChild(answer)
      this.player.playHurtAnimation()
      this.currentStreak = 0
      removeElement(this.answers, answer)

      this.inputLock = true
      createjs.Tween.get(this.player).wait(INPUT_LOCK_DURATION).call(function() {
          this.inputLock = false
          this.player.restoreAnimation()
      }, null, this);
    }
  }

  handleCollisionWithEnemy(enemy) {
    createjs.Sound.play("lose");

    this.addFlyaway(enemy.x, enemy.y - 20, "R.I.P.", "#ff0000")

    this.player.isAlive = false
    this.map.removeChild(this.player)

    createjs.Tween.get(this.player).wait(2000).call(function() {
      this.tearDownGame()
      this.showResultScreen(this.score);
    }, null, this);
  }

  update() {
    var stage = this.stage

    if(stage) {
      if(this.gameState == GameState.ROUND) {
        if (this.player.isAlive) {
          if (!this.inputLock) {
            this.handleInput()
          }
          this.checkForCollisions()
        }

        this.handlePatrolling()
      }

      if(this.gameState == GameState.ROUND && this.timeRemaining <= 0) {
        this.gameState = GameState.END
        this.tearDownGame()
        this.showResultScreen(this.score);
      }

      stage.update();
    }
  }

  showResultScreen(score) {
    var stage = this.stage

    var backgroundDimmed = this.backgroundDimmed
    stage.addChild(backgroundDimmed)

    var gameOverLabel = new createjs.Text("Game Over", "80px Courier New", "#fb78b2");
    setAnchorPointCenter(gameOverLabel)
    gameOverLabel.x = this.width * 0.5;
    gameOverLabel.y = this.height * 0.15;
    stage.addChild(gameOverLabel);
    var gameOverOriginY = gameOverLabel.y
    var gameOverDestinationY = gameOverLabel.y - 5
    createjs.Tween.get(gameOverLabel, {loop: true}).to({y:gameOverDestinationY}, 1000, createjs.Ease.sineInOut).to({y:gameOverOriginY}, 1000, createjs.Ease.sineInOut);

    var finalScoreLabel = new createjs.Text("Final Score", "24px Courier New", "#a9ebf9");
    setAnchorPointCenter(finalScoreLabel)
    finalScoreLabel.x = this.width * 0.5;
    finalScoreLabel.y = this.height * 0.33;
    stage.addChild(finalScoreLabel);

    var finalScoreCounter = new createjs.Text(score, "30px Courier New", "#00ff00");
    setAnchorPointCenter(finalScoreCounter)
    finalScoreCounter.x = this.width * 0.5;
    finalScoreCounter.y = this.height * 0.39;
    stage.addChild(finalScoreCounter);
    createjs.Tween.get(finalScoreCounter, { loop: true }).to({color:"#88cc88"}, 200, createjs.Ease.sineInOut)
                                                         .wait(50)
                                                         .to({color:"#00ff00"}, 200, createjs.Ease.sineInOut)
                                                         .wait(500);

    var lastSeenLabel = createLabel(stage, "Last seen:", 12, "#a9ebf9", this.width * 0.25, this.height * 0.47, "center")
    stage.addChild(lastSeenLabel)

    var lastConcept = this.problem
    setAnchorPointCenter(lastConcept)
    lastConcept.x = this.width * 0.25
    lastConcept.y = this.height * 0.55
    stage.addChild(lastConcept)

    var expectedLabel = createLabel(stage, "Expected answer:", 12, "#a9ebf9", this.width * 0.75, this.height * 0.47, "center")
    stage.addChild(expectedLabel)

    var lastAnswer = createLabel(stage, this.expectedAnswer, 24, "#a9ebf9", this.width * 0.75, this.height * 0.53, "center")
    stage.addChild(lastAnswer)

    var tipLabel = createLabel(stage, getTipLabel(this.problemType), 12, "#a9ebf9", this.width * 0.1, this.height * 0.65, "left")
    tipLabel.lineWidth = this.width * 0.8
    tipLabel.lineHeight = 20
    stage.addChild(tipLabel)

    var messageLabel = new createjs.Text(getWinMessage(score), "24px Courier New", "#a9ebf9");
    setAnchorPointCenter(messageLabel)
    messageLabel.x = this.width * 0.5;
    messageLabel.y = this.height * 0.88;
    messageLabel.alpha = 0;
    stage.addChild(messageLabel);

    var instructionLabel = new createjs.Text("- Click to try again - ", "12px Courier New", "#a9ebf9");
    setAnchorPointCenter(instructionLabel)
    instructionLabel.x = this.width * 0.5;
    instructionLabel.y = this.height * 0.95;
    instructionLabel.alpha = 0;
    stage.addChild(instructionLabel);

    createjs.Tween.get(messageLabel).to({alpha:1.0}, 2000, createjs.Ease.sineInOut)
    createjs.Tween.get(instructionLabel).wait(2000).to({alpha:1.0}, 300, createjs.Ease.sineInOut).call(function() {
        this.waitForResultClick(backgroundDimmed)
    }, null, this);
  }

  waitForResultClick(background) {
    background.addEventListener("click", function(event) {
      this.tearDownResultScreen()
      this.showTitle()
      createjs.Sound.play("press");
    }.bind(this));
  }

  tearDownResultScreen() {
    this.background.removeAllEventListeners()
    this.stage.removeAllChildren()
    this.stage.removeAllEventListeners()
  }

  handlePlayButtonClick(mode) {
    this.tearDownTitle()
    this.initGame(mode);
    this.showGame();

    createjs.Sound.play("press");
  }

  getNextConcept() {
    var conceptsOfOneType = getRandomElement(this.concepts)
    return getRandomElement(conceptsOfOneType)
  }
}

function createLabel(stage, text, fontSize, color, x, y, alignment) {
  var label = new createjs.Text(text, fontSize + "px Courier New", color, alignment)
  label.x = x
  label.y = y
  label.textAlign = alignment
  stage.addChild(label)

  return label
}
