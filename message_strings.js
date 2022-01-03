function getWinMessage(score) {
  if(score < 250) {
    return "Maybe try that again..."
  }
  else if(score < 500) {
    return "Not bad..."
  }
  else if(score < 1000) {
    return "You're good at this..."
  }
  else if(score < 2000) {
    return "Amazing..."
  }
  else if(score < 3000) {
    return "You're an expert..."
  }
  else if(score < 4000) {
    return "You have what it takes..."
  }
  else {
    return "You mastered Phantom Power!"
  }
}

const CONGRATS_MESSAGES = [
  "NICE!",
  "SAME THING!",
  "EQUIVALENT!",
  "SIMPLIFIED!",
  "AWESOME!",
  "CORRECT!",
  "YEAH!",
  "WELL DONE!",
  "THAT'S RIGHT!",
  "YOU BET!"
];

function getCongratsMessage() {
  return getRandomElement(CONGRATS_MESSAGES)
}

function getTipLabel(type) {
  switch(type) {
    case ExponentProperty.PRODUCT_OF_POWERS:
      return "Product of powers property: The exponents should have been added together."
    case ExponentProperty.POWER_OF_POWERS:
      return "Power of powers property: The exponents should have been multiplied together."
    case ExponentProperty.QUOTIENT_OF_POWERS:
      return "Quotient of powers property: The bottom exponent should have been subtracted from the top exponent."
    case ExponentProperty.ZERO_EXPONENT:
      return "Zero exponent property: Remember that anything to the power of zero is 1."
    case ExponentProperty.NEGATIVE_EXPONENT:
      return "Negative exponent property: Take the reciprocal of the quantity (flip the fraction)."
    case ExponentProperty.POWER_OF_PRODUCT:
      return "Power of a product property: \"Distribute\" the exponent to everything inside the parentheses."
    default:
      return "Better luck next time"
  }
}
