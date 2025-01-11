let ButtonColor;
(function (ButtonColor) {
  ButtonColor["White"] = "color-white";
  ButtonColor["Yellow"] = "color-yellow";
  ButtonColor["Green"] = "color-green";
})(ButtonColor || (ButtonColor = {}));

let buttonStates = [];

const getButtonColor = (index) => {
  return buttonStates[index].currentColor;
};

const getAllButtonColors = () => {
  return buttonStates.map((state) => state.currentColor);
};

let wordList = [];

fetch("wordlist.txt")
  .then((response) => response.text())
  .then((data) => {
    wordList = data.split("\n").map((word) => word.trim().toLowerCase());
  });

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  const buttons = document.querySelectorAll(".location-input button");
  const wordInputs = document.querySelectorAll(".word-input input");
  const resultsList = document.getElementById("top-words-list");

  buttons.forEach((button, index) => {
    button.classList.remove(
      ButtonColor.White,
      ButtonColor.Yellow,
      ButtonColor.Green
    );
    button.classList.add(ButtonColor.White);

    buttonStates[index] = {
      element: button,
      currentColor: ButtonColor.White,
    };

    button.addEventListener("click", () => {
      const currentState = buttonStates[index];
      button.classList.remove(
        ButtonColor.White,
        ButtonColor.Yellow,
        ButtonColor.Green
      );

      switch (currentState.currentColor) {
        case ButtonColor.White:
          currentState.currentColor = ButtonColor.Yellow;
          break;
        case ButtonColor.Yellow:
          currentState.currentColor = ButtonColor.Green;
          break;
        case ButtonColor.Green:
          currentState.currentColor = ButtonColor.White;
          break;
        default:
          currentState.currentColor = ButtonColor.White;
      }

      button.classList.add(currentState.currentColor);

      console.log(getWordInputs());
      console.log(`Button ${index + 1} color:`, getButtonColor(index));
      console.log("All button colors:", getAllButtonColors());
    });
  });

  let excludedLetters = [];
  const globalLetterButtons = document.querySelectorAll(
    ".letter-grid .letter-button"
  );
  globalLetterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const letter = button.dataset.letter;
      if (button.classList.contains("excluded")) {
        button.classList.remove("excluded");
        excludedLetters = excludedLetters.filter((l) => l !== letter);
      } else {
        button.classList.add("excluded");
        excludedLetters.push(letter);
      }
      if (selectedPosition !== null) {
        renderExclusionLetters();
      }
      renderExclusionLetters();
    });
  });

  const positionExclusions = Array.from({ length: 5 }, () => new Set());

  let selectedPosition = null;
  const positionButtons = document.querySelectorAll(".position-button");
  const exclusionLettersContainer =
    document.querySelector(".exclusion-letters");

  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const letterButtons = {};

  letters.forEach((letter) => {
    const button = document.createElement("button");
    button.textContent = letter.toUpperCase();
    button.classList.add("letter-button");
    button.dataset.letter = letter;
    exclusionLettersContainer.appendChild(button);
    letterButtons[letter] = button;

    button.addEventListener("click", () => {
      if (!selectedPosition) return;

      const isGloballyExcluded = excludedLetters.includes(letter);
      if (isGloballyExcluded) return;

      const posIndex = parseInt(selectedPosition) - 1;

      if (button.classList.contains("position-excluded")) {
        button.classList.remove("position-excluded");
        positionExclusions[posIndex].delete(letter);
      } else {
        button.classList.add("position-excluded");
        positionExclusions[posIndex].add(letter);
      }
    });
  });

  positionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const position = button.dataset.pos;
      if (selectedPosition === position) {
        selectedPosition = null;
        button.classList.remove("active");
      } else {
        selectedPosition = position;
        positionButtons.forEach((b) => b.classList.remove("active"));
        button.classList.add("active");
      }
      renderExclusionLetters();
    });
  });

  function renderExclusionLetters() {
    letters.forEach((letter) => {
      const button = letterButtons[letter];
      button.classList.remove("position-excluded", "excluded");

      if (excludedLetters.includes(letter)) {
        button.classList.add("excluded");
      }

      if (selectedPosition !== null) {
        const posIndex = parseInt(selectedPosition) - 1;
        if (positionExclusions[posIndex].has(letter)) {
          button.classList.add("position-excluded");
        }
      }
    });
  }

  renderExclusionLetters();

  const getWordInputs = () => {
    return Array.from(wordInputs).map(
      (input) => input.value.toLowerCase() || null
    );
  };

  const filterWords = (guessLetters, colors) => {
    return wordList.filter((word) => {
      if (excludedLetters.some((letter) => word.includes(letter))) {
        return false;
      }
      for (let i = 0; i < 5; i++) {
        if (positionExclusions[i].has(word[i])) {
          return false;
        }
      }
      for (let i = 0; i < 5; i++) {
        const letter = guessLetters[i];
        if (!letter) continue;
        if (colors[i] === ButtonColor.Green) {
          if (word[i] !== letter) return false;
        } else if (colors[i] === ButtonColor.Yellow) {
          if (word[i] === letter || !word.includes(letter)) return false;
        } else if (colors[i] === ButtonColor.White) {
          if (word.includes(letter)) return false;
        }
      }
      return true;
    });
  };

  const wordRanks = (filteredWords) => {
    const letterFrequency = {};
    filteredWords.forEach((word) => {
      [...new Set(word)].forEach((letter) => {
        letterFrequency[letter] = (letterFrequency[letter] || 0) + 1;
      });
    });

    return filteredWords
      .map((word) => ({
        word,
        score: [...new Set(word)].reduce(
          (acc, letter) => acc + (letterFrequency[letter] || 0),
          0
        ),
      }))
      .sort((a, b) => b.score - a.score);
  };

  const submitButton = document.getElementById("submit");
  if (submitButton) {
    submitButton.addEventListener("click", () => {
      console.log("Submit clicked");
      const guessLetters = getWordInputs();
      const colors = getAllButtonColors();
      const possibleWords = filterWords(guessLetters, colors);
      console.log("Possible words:", possibleWords);
      const rankedWords = wordRanks(possibleWords);
      console.log("Ranked words:", rankedWords);

      if (rankedWords.length > 0) {
        const top10 = rankedWords.slice(0, 10).map((wordObj) => wordObj.word);
        resultsList.innerHTML = "";
        top10.forEach((word, i) => {
          const li = document.createElement("li");
          li.textContent = `${i + 1}. ${word}`;
          resultsList.appendChild(li);
        });
      } else {
        resultsList.innerHTML = "<li>No words found</li>";
      }
    });
  } else {
    console.error("Submit button not found");
  }
});
