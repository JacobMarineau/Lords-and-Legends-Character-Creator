# Lords & Legends Character Creator

## Overview

The **Lords & Legends Character Creator** is a web-based tool for creating and managing characters for the tabletop role-playing game **Lords & Legends (L&L)**. Players can dynamically select races, vocations, and manually input stats to generate their character sheets. This tool handles major stats, minor stats, micro stats, and additional attributes such as HP, Armor Rating, Skills, and Equipment.

## Table of Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [How to Run](#how-to-run)
5. [Detailed Explanation](#detailed-explanation)
6. [Contributions](#contributions)

## Features

- **Dynamic Stat Handling**: Automatically calculates stat modifiers for major, minor, and micro stats.
- **Race and Vocation Selections**: Players can select a race and vocation, which modifies stats and passives accordingly.
- **Customizable Attributes**: Players can input custom values for attributes like HP, Armor Rating (AR), Magic Resistance (MR), Speed Class (SC), and others.
- **Dynamic Character Sheet**: The character sheet is updated dynamically based on player inputs and selections.
- **Editable Character Details**: The player can input and update the character’s name, race, and vocation.

## Technologies Used

- **HTML**: Structure of the character creator and character sheet.
- **CSS**: Styling of the UI elements and layout of the character creator.
- **JavaScript**: Dynamic updates of stats, attributes, and handling race/vocation selections.

## Project Structure

```bash
├── index.html         # Main HTML file for the character creator
├── styles.css         # Stylesheet for the UI
├── scripts.js         # JavaScript logic for dynamic updates
├── data.json          # Data file for races, vocations, and bonuses
└── README.md          # Project documentation
index.html
This file contains the structure for the UI, including the form inputs for stats, dropdowns for race and vocation selection, and sections for displaying the character sheet.

styles.css
Defines the styles for the web app, ensuring a clean and organized layout.

scripts.js
The core of the character creator’s functionality. It handles all dynamic updates, including:

Modifying stats based on race and vocation selection
Updating the character sheet
Handling custom inputs for stats and attributes
data.json
Contains data about the available races, vocations, their associated bonuses, and skills.

How to Run
Download/Clone the repository: You can clone the repository using the following command:
bash
Copy code
git clone <repository-url>
Open index.html in a browser: The app is a client-side application, so you just need to open index.html in any browser to start using it.
You may need to run a local server to serve the JSON file properly. You can use a tool like Live Server or run:
bash
Copy code
npx http-server .
This command serves the folder with the index.html file.
Detailed Explanation
Major Stats
The following major stats are supported:

Charisma: (Persuasion, Deception, Bargaining, Performance, Charm)
Strength: (Acrobatics, Athletics, Agility, Lifting)
Dexterity: (Sleight of Hand, Stealth, Medicine, Weapon Mastery, Carving)
Intelligence: (History, Wisdom, Science, Technology, Foraging)
Vitality: (Endurance, Resistance)
Willpower: (Feat of Heroism, Leadership, Counter-Charisma)
Arcana: (Magical Knowledge, Magic Save Modifier)
Ferocity: (Intimidation, Physical Save Modifier)
Minor Stats
Each major stat has related minor stats that are updated dynamically based on the selected race and vocation, or manual inputs.
Micro Stats
Micro stats are vocation-specific and update based on the vocation selected. They are smaller skills or bonuses that don’t directly tie into major stats.
Attributes
Attributes like Hit Points (HP), Armor Rating (AR), Magic Resistance (MR), and Speed Class (SC) are manually input by the player but are displayed dynamically on the character sheet.

Race and Vocation Modifiers
Race Modifiers: Modify base stats when a race is selected.
Vocation Modifiers: Apply specific bonuses to minor and micro stats when a vocation is selected.
Contributions
If you want to contribute to the project, feel free to fork the repository and submit a pull request. Make sure to follow the project's structure and keep all functions well-commented for easy understanding.

Fork the repository.
Create your feature branch: git checkout -b feature/my-feature.
Commit your changes: git commit -m 'Add my feature'.
Push to the branch: git push origin feature/my-feature.
Open a pull request.
