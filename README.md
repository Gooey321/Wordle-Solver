# Wordle Solver

## Overview

Wordle Solver helps players efficiently solve the popular game, Wordle, by analyzing guesses and their outcomes. It provides the top 10 possible word suggestions to guide you toward the correct answer.

## How to Use

1. **Enter Your Guess:**

   - Input letters that have color (yellow or green) into the corresponding input fields.

2. **Set Letter Status:**

   - Use the buttons below each letter to indicate its status:
     - **Yellow:** The letter is in the word but in the wrong position.
     - **Green:** The letter is in the correct position.

3. **Set Letters to Exclude:**

   - Below the letter status buttons, select letters to exclude from the word. For example, if you guessed "cloud" but "c", "l", and "d" are not in the word, exclude those letters here.

4. **Specific Exclusion:**

   - Below the letter exclusion box, you can exclude letters from specific positions. For example, if "l" was yellow in the second position in a previous guess, you can set it to be excluded from that position.

5. **Submit:**

   - Click **Submit** to process your inputs and generate word suggestions.

6. **Review Results:**

   - The top 10 suggested words will appear on the left. Note: Sometimes a word may not be in the word list. The top suggestion can also be incorrect, but it’s usually a good starting point and it will usually get a few letters correct.

## Running the Program Locally

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Gooey321/Wordle-Solver.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd Wordle-Solver
   ```

3. **Open the Application:**

   - Open `index.html` in your web browser.
   - Alternatively, run a local server for a better experience:

     ```bash
     python3 -m http.server
     ```

     Then navigate to `http://localhost:8000` in your browser.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
