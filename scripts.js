document.addEventListener("DOMContentLoaded", () => {
  const majorStatSelectors = {
    strength: "strength",
    dexterity: "dexterity",
    intelligence: "intelligence",
    charisma: "charisma",
    vitality: "vitality",
    ferocity: "ferocity",
    arcana: "arcana",
    willpowerInnate: "willpower-innate",
    willpowerExtended: "willpower-extended",
  };

  const minorStatSelectors = {
    strength: ["acrobatics", "agility", "lifting"],
    dexterity: [
      "sleight-of-hand",
      "stealth",
      "medicine",
      "weapon-mastery",
      "carving",
    ],
    intelligence: ["history", "wisdom", "science", "technology", "foraging"],
    charisma: ["persuasion", "deception", "bargaining", "performance", "charm"],
    vitality: ["endurance", "resistance"],
    ferocity: ["intimidation", "physical-save"],
    arcana: ["magical-knowledge", "magic-save"],
  };

  let userInputValues = {}; // Store original values for each stat

  // Function to store user input for major stats
  function storeUserInputValues() {
    Object.keys(majorStatSelectors).forEach((stat) => {
      const statInput = document.getElementById(majorStatSelectors[stat]);
      userInputValues[stat] = parseInt(statInput.value) || 0;
    });
  }

  // Reset stats back to original input values
  function resetToUserInputValues() {
    Object.keys(majorStatSelectors).forEach((stat) => {
      const statInput = document.getElementById(majorStatSelectors[stat]);
      statInput.value = userInputValues[stat];
    });
  }

  // Update modifiers for all major stats
  function updateModifiers() {
    Object.keys(majorStatSelectors).forEach((stat) => {
      if (stat !== "willpowerInnate" && stat !== "willpowerExtended") {
        const majorStatInput = document.getElementById(
          majorStatSelectors[stat]
        );
        const majorStatValue = parseInt(majorStatInput.value) || 0;
        const modifier = calculateModifier(majorStatValue, stat);

        // Update major stat modifier
        document.getElementById(`${stat}-modifier`).textContent = modifier;

        // Update minor stats related to the major stat
        updateMinorStats(stat, modifier);
      }
    });
    updateWillpower(); // Update willpower separately
  }

  // Calculate modifier for a given stat
  function calculateModifier(statValue, statType) {
    return ["ferocity", "arcana"].includes(statType)
      ? statValue // Direct modifier for these stats
      : Math.floor((statValue - 10) / 2); // Standard modifier calculation
  }

  // Update minor stats based on the major stat's modifier
  function updateMinorStats(majorStat, modifier) {
    if (!minorStatSelectors[majorStat]) return;
    minorStatSelectors[majorStat].forEach((minorStat) => {
      const minorStatInput = document.getElementById(minorStat);
      const minorStatValue = parseInt(minorStatInput.value) || 0;
      const totalModifier = modifier + minorStatValue;
      document.querySelector(
        `#${minorStat} + .minor-stat-modifier`
      ).textContent = ` ${totalModifier}`;
    });
  }

  // Update willpower separately
  function updateWillpower() {
    const willpowerInnateValue =
      parseInt(document.getElementById("willpower-innate").value) || 0;
    const willpowerExtendedValue =
      parseInt(document.getElementById("willpower-extended").value) || 0;
    document.getElementById(
      "willpower-modifier"
    ).textContent = `Innate: ${willpowerInnateValue} (Extended: ${willpowerExtendedValue})`;
  }

  // Apply race modifiers
  // Apply race modifiers and update the race section of the character sheet
  function applyRaceModifiers(selectedRace) {
    if (!raceData[selectedRace]) return;

    const race = raceData[selectedRace];

    // Update race stat modifiers in the race section
    document.getElementById(
      "race-strength-modifier"
    ).textContent = `Strength: ${race.modifiers.strength || 0}`;
    document.getElementById(
      "race-dexterity-modifier"
    ).textContent = `Dexterity: ${race.modifiers.dexterity || 0}`;
    document.getElementById(
      "race-intelligence-modifier"
    ).textContent = `Intelligence: ${race.modifiers.intelligence || 0}`;
    document.getElementById(
      "race-charisma-modifier"
    ).textContent = `Charisma: ${race.modifiers.charisma || 0}`;
    document.getElementById(
      "race-vitality-modifier"
    ).textContent = `Vitality: ${race.modifiers.vitality || 0}`;
    document.getElementById(
      "race-ferocity-modifier"
    ).textContent = `Ferocity: ${race.modifiers.ferocity || 0}`;
    document.getElementById("race-arcana-modifier").textContent = `Arcana: ${
      race.modifiers.arcana || 0
    }`;
    document.getElementById(
      "race-willpower-modifier"
    ).textContent = `Willpower: ${race.modifiers.willpower || 0}`;

    // Update the race passive description
    document.getElementById("race-passive-description").textContent =
      race.passive || "No passive abilities available.";

    // Apply race stat modifiers to the main character stats
    Object.keys(race.modifiers).forEach((stat) => {
      const originalValue = userInputValues[stat];
      const raceModifier = race.modifiers[stat];

      const statInput = document.getElementById(stat);
      statInput.value = originalValue + raceModifier;
      document.getElementById(`${stat}-modifier`).textContent =
        calculateModifier(statInput.value, stat);
    });

    updateModifiers(); // Recalculate all modifiers after applying race modifiers
  }

  // Fetch and load race data
  function loadRaceData() {
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        raceData = data.races;
      })
      .catch((error) => console.error("Error loading race data:", error));
  }

  // Initialize event listeners and data loading
  Object.keys(majorStatSelectors).forEach((stat) => {
    const statInput = document.getElementById(majorStatSelectors[stat]);
    statInput.addEventListener("input", () => {
      storeUserInputValues(); // Store values on input
      updateModifiers(); // Update modifiers dynamically
    });
  });

  // Event listener for race selection
  document.getElementById("race").addEventListener("change", (event) => {
    const selectedRace = event.target.value;
    applyRaceModifiers(selectedRace);
    document.getElementById("char-race-output").textContent =
      selectedRace.charAt(0).toUpperCase() + selectedRace.slice(1);
  });

  // Load race data on page load
  loadRaceData();
  updateModifiers();
});

let userInputValues = {}; // Store original values for each stat

// Function to calculate the major stat modifier
function calculateMajorStatModifier(statValue) {
  if (statValue >= 10) {
    return Math.floor((statValue - 10) / 2); // For every 2 points above 10, +1 modifier
  } else {
    return Math.floor((statValue - 10) / 2); // For every 2 points below 10, -1 modifier
  }
}

// Function to store user input for major stats
function storeUserInputValues() {
  const minorStatElements = document.querySelectorAll(".minor-stat-input");
  minorStatElements.forEach((input) => {
    const statId = input.id;
    userInputValues[statId] = parseInt(input.value) || 0; // Store the current user input
  });
}

// Function to apply the user's stat input values and then add vocation bonuses
function applyVocationData(selectedVocation, vocationData) {
  if (!vocationData[selectedVocation]) return;

  const vocation = vocationData[selectedVocation];

  // Reset minor stats to user input values first
  resetMinorStatsToUserInput();

  // Apply vocation bonuses to the minor stats
  applyVocationMinorStatBonuses(vocation.minorStatBonuses);

  // Populate other vocation-related sections (equipment, weaponry, etc.)
  populateVocationSections(vocation);
}

// Function to reset the minor stats to user input values
function resetMinorStatsToUserInput() {
  const minorStatElements = document.querySelectorAll(".minor-stat-input");
  minorStatElements.forEach((input) => {
    const statId = input.id;
    input.value = userInputValues[statId] || 0; // Reset stat to user input value
    document.querySelector(
      `#${statId} + .minor-stat-modifier`
    ).textContent = ` ${userInputValues[statId] || 0}`;
  });
}

// Apply vocation bonuses to minor stats by adding to the major stat modifier
function applyVocationMinorStatBonuses(minorStatBonuses) {
  if (!minorStatBonuses) return;

  Object.keys(minorStatBonuses).forEach((minorStat) => {
    const majorStatElement = document.getElementById(minorStat); // Assuming minor stat is related to a major stat
    const majorStatValue = parseInt(majorStatElement.value) || 10; // Get the major stat value
    const majorStatModifier = calculateMajorStatModifier(majorStatValue); // Get the modifier for that major stat
    const vocationBonus = minorStatBonuses[minorStat]; // Get the vocation bonus

    const finalValue = majorStatModifier + vocationBonus; // Add the vocation bonus to the major stat modifier
    document.querySelector(
      `#${minorStat} + .minor-stat-modifier`
    ).textContent = ` ${finalValue}`;
  });
}

// Update modifiers when the user changes a minor stat manually
function handleMinorStatInput() {
  const minorStatElements = document.querySelectorAll(".minor-stat-input");
  minorStatElements.forEach((input) => {
    input.addEventListener("input", () => {
      const statId = input.id;
      userInputValues[statId] = parseInt(input.value) || 0;
      applyVocationMinorStatBonuses(vocationData[selectedVocation]); // Reapply bonuses after user input change
    });
  });
}

// Function to populate vocation-specific sections like equipment, skills, and magic
function populateVocationSections(vocation) {
  // Populate weaponry, armor, equipment, skills, etc. (Similar to previous functions)
  const weaponrySection = document.getElementById("vocation-weaponry");
  weaponrySection.innerHTML = ""; // Clear previous data
  vocation.weaponry.forEach((item) => {
    const itemElement = document.createElement("li");

    // Check if the item is armor or weaponry
    if (item.type === "Armor") {
      itemElement.textContent = `${item.name} (Armor Rating: ${item.armor})`;
    } else {
      itemElement.textContent = `${item.name} (${item.type}) - Damage/Effect: ${
        item.damage || item.effect || "N/A"
      }`;
    }
    weaponrySection.appendChild(itemElement);
  });

  const equipmentSection = document.getElementById("vocation-equipment");
  equipmentSection.innerHTML = ""; // Clear previous data
  vocation.equipment.forEach((item) => {
    const itemElement = document.createElement("li");
    itemElement.textContent = item;
    equipmentSection.appendChild(itemElement);
  });

  const skillsSection = document.getElementById("vocation-skills");
  skillsSection.innerHTML = ""; // Clear previous data
  vocation.skills.forEach((skill) => {
    const skillElement = document.createElement("li");
    skillElement.textContent = `${skill.name}: ${skill.description}`;
    skillsSection.appendChild(skillElement);
  });
}

// Fetch vocation data and add event listener
function loadVocationData() {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      const vocationData = data.vocations;

      // Event listener for vocation selection
      document
        .getElementById("vocation")
        .addEventListener("change", (event) => {
          const selectedVocation = event.target.value;
          applyVocationData(selectedVocation, vocationData);
        });

      handleMinorStatInput(); // Ensure user inputs are tracked
    })
    .catch((error) => {
      console.error("Error loading vocation data:", error);
    });
}

// Call this function to load vocation data on page load
loadVocationData();
storeUserInputValues(); // Store initial user input values
