# 🔍 PokéDex - JavaScript API Project

![Pokédex Preview](https://repository-images.githubusercontent.com/1104726185/b1143b78-001c-43bc-85d9-00d2073b43a0)

A modern, responsive **PokéDex** application that allows users to browse, search, and view detailed information about Pokémon using the [PokéAPI](https://pokeapi.co/).

## 🚀 Live Demo

👉 [View Live Project](https://artur-groblicki.developerakademie.net/Pokedex/index.html)

## ✨ Key Features

- **Dynamic Data Fetching:** Utilizes asynchronous JavaScript (`fetch`, `async/await`) to retrieve data from the RESTful PokéAPI.
- **Real-time Search:** Search functionality that allows users to find Pokémon by name instantly.
- **Detailed Statistics:** Interactive modal view showing base stats (HP, Attack, Defense), abilities, and high-quality artwork.
- **Responsive Design:** A mobile-first approach ensuring the application works perfectly on smartphones, tablets, and desktops.
- **Type-Based Styling:** Dynamic UI color changes based on the Pokémon's primary type (e.g., Water = Blue, Fire = Red).

## 🧠 Technical Challenges

### 1. Efficient Data Fetching

Fetching data for many Pokémon simultaneously can impact performance. I implemented an asynchronous flow using `async/await` to handle API requests efficiently, ensuring the UI remains responsive while data is being loaded in the background.

### 2. Dynamic UI Mapping

One of the main challenges was mapping raw data from the API to visual elements. I developed a logic that assigns specific CSS classes based on the Pokémon's type, which automatically updates the card's background and icons, providing a much better User Experience.

### 3. Search Optimization

To provide a smooth search experience, I implemented a filtering logic that works on the already fetched data. This avoids unnecessary API calls for every keystroke, saving bandwidth and making the search nearly instantaneous.

## 🛠️ Built With

- **JavaScript (ES6+):** Logic for API communication and DOM manipulation.
- **HTML5:** Semantic structure for the web.
- **CSS3:** Advanced styling with Flexbox, Grid, and Transitions for a modern look.
- **PokéAPI:** The source for all Pokémon data.

## 📁 Project Structure

```text
Pokedex/
├── assets/          # Fonts, icons, and local images
├── scripts/         # JavaScript files (API handlers & rendering logic)
├── styles/          # CSS files for layout and styling
└── index.html       # Main entry point of the application
```

Installation & Setup
Clone the repository:

git clone [https://github.com/your-username/Pokedex.git](https://github.com/your-username/Pokedex.git)

Open index.html in your browser.

Recommended: Use the Live Server extension in VS Code for the best development experience.

Author: Artur Groblicki

Portfolio: Working on it 🏗️
