const gameContainer = document.getElementById('game');
const startButton = document.getElementById('startButton')
const resetButton = document.getElementById('resetButton')
const controlsDiv = document.getElementById('controls')
const score = document.getElementById('score')

gameContainer.addEventListener('click', handleCardClick)
resetButton.disabled = 'true'

const COLORS = [
  'red',
  'blue',
  'green',
  'orange',
  'purple',
  'red',
  'blue',
  'green',
  'orange',
  'purple'
];

let cardChoices = {}
let matches = new Set()
let colors = new Set()


// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

function createColorDiv(color, index) {
  // create a new div
  const newDiv = document.createElement('div');

  // give it a class attribute for the value we are looping over
  newDiv.classList.add(color);

  // give it a unique ID
  newDiv.id = index

  // append the div to the element with an id of game
  gameContainer.append(newDiv);
}

function evaulateChoices() {
  return Object.values(cardChoices)[0].className === Object.values(cardChoices)[1].className
}

function resetAttempt() {
  Object.values(cardChoices).forEach(function(choice) {
    if (!matches.has(choice.className)) {
      choice.style.backgroundColor = null
    }
  })
  cardChoices = {}
}

function incrementScore() {
  scoreInt = parseInt(score.innerText)
  scoreInt += 1
  score.innerText = scoreInt
}

function decrementScore() {
  scoreInt = parseInt(score.innerText)
  scoreInt -= 1
  score.innerText = scoreInt
}

function persistScore() {
  let storedScore = localStorage.getItem('score')
  let scoreInt = parseInt(score.innerText)

  if (!storedScore) {
    localStorage.setItem('score', scoreInt)
    console.log('no scores logged')
    console.log(scoreInt)
  }
  else if (scoreInt < storedScore) {
    localStorage.setItem('score', scoreInt)
    console.log(storedScore)
    console.log(scoreInt)
  }
}

// TODO: Implement this function!
function handleCardClick(e) {
  // you can use e.target to see which element was clicked
  if (!e.target.className) {
    console.log('card not selected')
    return
  }

  if (e.target.style.backgroundColor) {
    console.log('card already flipped')
    return
  }

  if (Object.keys(cardChoices).length >= 2) {
    console.log('too many cards selected')
    return
  }

  if (Object.keys(cardChoices).length < 2) {
    cardChoices[e.target.id] = e.target

    if (!e.target.style.backgroundColor) {
      e.target.style.backgroundColor = e.target.className
    }
  }

  if (Object.keys(cardChoices).length === 2) {
    incrementScore()

    if (!evaulateChoices()) {
      console.log('not a match')
      setTimeout(resetAttempt, 1000)
      return
    }

    matches.add(Object.values(cardChoices)[0].className)

    if (matches.size < gameContainer.childElementCount/2) {
      console.log('all matches not found')
      resetAttempt()
      return
    }

    if (matches.size === gameContainer.childElementCount/2) {
      console.log('all mataches found')

      let storedScore = localStorage.getItem('score')
      let scoreInt = parseInt(score.innerText)

      if (!storedScore || scoreInt < storedScore) {
        localStorage.setItem('score', scoreInt)
        setTimeout(function() {
          alert(`BEST SCORE!!! ${scoreInt}`)
        }, 500)
        return
      }

      setTimeout(function() {
        alert('COMPLETE!!!')
      }, 500)
    }
  }
}

// when the DOM loads
let shuffledColors = null
startButton.addEventListener('click', function() {
  shuffledColors = shuffle(COLORS)
  shuffledColors.forEach(createColorDiv)
  resetButton.disabled = ''
  score.innerText = 0
  startButton.disabled = 'true'
})

resetButton.addEventListener('click', function() {
  shuffledColors = shuffle(COLORS)
  gameContainer.innerHTML = ''
  matches = new Set()
  cardChoices = {}
  score.innerText = 0
  shuffledColors.forEach(createColorDiv)
})
