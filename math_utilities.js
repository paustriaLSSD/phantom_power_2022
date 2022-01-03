const ExponentProperty = {
  PRODUCT_OF_POWERS: 'product of powers',
  POWER_OF_POWERS: 'power of powers',
  QUOTIENT_OF_POWERS: 'quotient of powers',
  ZERO_EXPONENT: 'zero exponent',
  NEGATIVE_EXPONENT: 'negative exponent',
  POWER_OF_PRODUCT: 'power of product',
  //POWER_OF_QUOTIENT: 'power of quotient'
}

const SUPER_MAP = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
}

function randomInt(minVal, maxVal)
{
    return Math.round(Math.random() * (maxVal - minVal) + minVal);
}

function randomBool()
{
  return Math.random() < 0.5;
}

function toMappedCharacter(value, map) {
  if (value == 1) {
    return ""
  }

  var returnedString = ""
  if (value < 0) {
    returnedString += "⁻"
    value *= -1
  }

  return returnedString + value.toString().replace(/[0123456789]/g, function(match) {
      return map[match]
  })
}

function getExponentString(value) {
  return toMappedCharacter(value, SUPER_MAP)
}

function getSimplifiedTerm(exponent, ignoreZero = false) {
  if (!ignoreZero && exponent == 0) {
    return "1"
  }
  else {
    return "x" + getExponentString(exponent)
  }
}

function getEasyConcepts() {
  var concepts = []

  var productOfPowersConcepts = []
  for (var i = 1; i < 10; ++i) {
    for (var j = 1; j < 10; ++j) {
      var sum = i + j
      if(sum < 10 && sum > 1 && i != 0 && j != 0) {
        var concept = {
          numerator: getSimplifiedTerm(i) + " ⋅ " + getSimplifiedTerm(j),
          answer: getSimplifiedTerm(sum),
          type: ExponentProperty.PRODUCT_OF_POWERS
        }
        productOfPowersConcepts.push(concept)
      }
    }
  }
  concepts.push(productOfPowersConcepts)

  return concepts
}

function getMediumConcepts() {
  var concepts = []

  var productOfPowersConcepts = []
  for (var i = 1; i < 10; ++i) {
    for (var j = 1; j < 10; ++j) {
      var sum = i + j
      if(sum < 10 && sum > 1 && i != 0 && j != 0) {
        var concept = {
          numerator: getSimplifiedTerm(i) + " ⋅ " + getSimplifiedTerm(j),
          answer: getSimplifiedTerm(sum),
          type: ExponentProperty.PRODUCT_OF_POWERS
        }
        productOfPowersConcepts.push(concept)
      }
    }
  }
  concepts.push(productOfPowersConcepts)

  var powerOfPowersConcepts = []
  for (var i = 1; i < 10; ++i) {
    for (var j = 1; j < 10; ++j) {
      var product = i * j
      if(product < 10 && product > 1 && i != 1 && j != 1) {
        var concept = {
          numerator: "(x" + getExponentString(i) + ")" + getExponentString(j),
          answer: getSimplifiedTerm(product),
          type: ExponentProperty.POWER_OF_POWERS
        }
        powerOfPowersConcepts.push(concept)
      }
    }
  }
  concepts.push(powerOfPowersConcepts)

  var quotientOfPowersConcepts = []
  for (var i = 1; i < 10; ++i) {
    for (var j = 1; j < 10; ++j) {
      var difference = i - j
      if(difference < 10 && difference > 1) {
        var concept = {
          numerator: getSimplifiedTerm(i),
          denominator: getSimplifiedTerm(j),
          answer: getSimplifiedTerm(difference),
          type: ExponentProperty.QUOTIENT_OF_POWERS
        }
        quotientOfPowersConcepts.push(concept)
      }
    }
  }
  concepts.push(quotientOfPowersConcepts)

  return concepts
}

function getHardConcepts() {
  var concepts = []

  var productOfPowersConcepts = []
  for (var i = -2; i < 10; ++i) {
    for (var j = -2; j < 10; ++j) {
      var sum = i + j
      if(sum < 10 && sum > 0) {
        var concept = {
          numerator: getSimplifiedTerm(i, true) + " ⋅ " + getSimplifiedTerm(j, true),
          answer: getSimplifiedTerm(sum),
          type: ExponentProperty.PRODUCT_OF_POWERS
        }
        productOfPowersConcepts.push(concept)
      }
    }
  }
  concepts.push(productOfPowersConcepts)

  var powerOfPowersConcepts = []
  for (var i = -2; i < 10; ++i) {
    for (var j = -2; j < 10; ++j) {
      var product = i * j
      if(product < 10 && product > 0 && i != 1 && j != 1) {
        var concept = {
          numerator: "(x" + toMappedCharacter(i, SUPER_MAP) + ")" + toMappedCharacter(j, SUPER_MAP),
          answer: getSimplifiedTerm(product),
          type: ExponentProperty.POWER_OF_POWERS
        }
        powerOfPowersConcepts.push(concept)
      }
    }
  }
  concepts.push(powerOfPowersConcepts)

  var quotientOfPowersConcepts = []
  for (var i = -2; i < 10; ++i) {
    for (var j = -2; j < 10; ++j) {
      var difference = i - j
      if(difference < 10 && difference > 0) {
        var concept = {
          numerator: getSimplifiedTerm(i, true),
          denominator: getSimplifiedTerm(j, true),
          answer: getSimplifiedTerm(difference),
          type: ExponentProperty.QUOTIENT_OF_POWERS,
        }
        quotientOfPowersConcepts.push(concept)
      }
    }
  }
  concepts.push(quotientOfPowersConcepts)

  var zeroExponentConcepts = []
  for (var i = -4; i < 10; ++i) {
    for (var j = -4; j < 10; ++j) {
      var sum = i + j
      var product = i * j
      var difference = i - j

      if(sum == 0 && !(i == 0 && j == 0)) {
        var concept = {
          numerator: getSimplifiedTerm(i) + " ⋅ " + getSimplifiedTerm(j),
          answer: getSimplifiedTerm(0),
          type: ExponentProperty.ZERO_EXPONENT,
        }
        zeroExponentConcepts.push(concept)
      }

      if(product == 0 && i != 0) {
        var concept = {
          numerator: "(x" + toMappedCharacter(i, SUPER_MAP) + ")" + toMappedCharacter(j, SUPER_MAP),
          answer: getSimplifiedTerm(0),
          type: ExponentProperty.ZERO_EXPONENT,
        }
        zeroExponentConcepts.push(concept)
      }

      if(difference == 0 && i != j) {
        var concept = {
          numerator: getSimplifiedTerm(i),
          denominator: getSimplifiedTerm(j),
          answer: getSimplifiedTerm(0),
          type: ExponentProperty.ZERO_EXPONENT,
        }
        zeroExponentConcepts.push(concept)
      }
    }
  }
  concepts.push(zeroExponentConcepts)

  var negativeExponentConcepts = []
  for (var i = -9; i < 0; ++i) {
    var concept = {
      numerator: "1",
      denominator: getSimplifiedTerm(i),
      answer: getSimplifiedTerm(-i),
      type: ExponentProperty.NEGATIVE_EXPONENT
    }
    negativeExponentConcepts.push(concept)

    concept = {
      numerator: "1",
      denominator: "x",
      answer: getSimplifiedTerm(-i),
      exponent:i,
      type: ExponentProperty.NEGATIVE_EXPONENT
    }
    negativeExponentConcepts.push(concept)
  }
  concepts.push(negativeExponentConcepts)

  var powerOfProductConcepts = []
  for (var i = 2; i < 10; ++i) {
    for (var j = 2; j < 10; ++j) {
      for (var k = 2; k < 10; ++k) {
        var coefficient = i
        var innerExponent = j
        var outerExponent = k

        var resultCoefficient = Math.pow(coefficient, outerExponent)
        var resultExponent = innerExponent * outerExponent

        if (resultCoefficient < 10 && resultExponent < 10) {
          var distractors = ["x", "1"]

          distractors.push(coefficient + "x" + getExponentString(resultExponent))
          distractors.push("x" + getExponentString(resultExponent))

          if (innerExponent != resultExponent) {
            distractors.push(resultCoefficient + "x" + getExponentString(innerExponent))
          }
          if (outerExponent != resultExponent) {
            distractors.push(resultCoefficient + "x" + getExponentString(outerExponent))
          }

          var concept = {
            numerator: "(" + coefficient + "x" + getExponentString(innerExponent) + ")" + getExponentString(outerExponent),
            answer: resultCoefficient + "x" + getExponentString(resultExponent),
            type: ExponentProperty.POWER_OF_PRODUCT,
            distractors: distractors
          }
          powerOfProductConcepts.push(concept)
        }
      }
    }
  }
  concepts.push(powerOfProductConcepts)

  return concepts
}
