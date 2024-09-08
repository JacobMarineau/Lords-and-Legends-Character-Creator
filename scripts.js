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
  let raceBonuses = {}; // Store race bonuses
  let vocationBonuses = {}; // Store vocation bonuses

  // Function to calculate the major stat modifier (unifying all logic)
  function calculateModifier(statValue, statType) {
    if (["ferocity", "arcana"].includes(statType)) {
      return statValue; // Direct modifier for these stats
    }
    return Math.floor((statValue - 10) / 2); // Standard modifier calculation
  }

  // Function to store user input values for all major stats
  function storeUserInputValues() {
    Object.keys(majorStatSelectors).forEach((stat) => {
      const statInput = document.getElementById(majorStatSelectors[stat]);
      userInputValues[stat] = parseInt(statInput.value) || 0;
    });
  }

  // Reset stats back to user input values (clear all bonuses)
  function resetToUserInputValues() {
    Object.keys(majorStatSelectors).forEach((stat) => {
      const statInput = document.getElementById(majorStatSelectors[stat]);
      statInput.value = userInputValues[stat]; // Reset stat input to user value
    });
  }

  // Apply modifiers and bonuses (vocation + race) to all major stats
  function updateModifiers() {
    Object.keys(majorStatSelectors).forEach((stat) => {
      const statInput = document.getElementById(majorStatSelectors[stat]);
      const majorStatValue = parseInt(statInput.value) || 0;
      let modifier = calculateModifier(majorStatValue, stat);

      // Apply race and vocation bonuses
      if (raceBonuses[stat]) modifier += raceBonuses[stat];
      if (vocationBonuses[stat]) modifier += vocationBonuses[stat]; // Add vocation bonuses here

      // Update major stat modifier
      document.getElementById(`${stat}-modifier`).textContent = modifier;

      // Update related minor stats based on major stat's modifier
      updateMinorStats(stat, modifier);
    });

    updateWillpower(); // Special case for willpower
  }

  let userMinorStatInputs = {}; // Store user inputs for minor stats

  // Update minor stats based on the major stat's modifier and allow manual input
  function updateMinorStats(majorStat, modifier) {
    if (!minorStatSelectors[majorStat]) return;

    minorStatSelectors[majorStat].forEach((minorStat) => {
      const minorStatInput = document.getElementById(minorStat);
      const userMinorStatValue = userMinorStatInputs[minorStat] || 0; // Get user input for this minor stat

      let totalModifier = modifier + userMinorStatValue; // Start with user input + major stat modifier

      // Apply vocation bonuses if they exist for this minor stat
      if (vocationBonuses[minorStat]) {
        totalModifier += vocationBonuses[minorStat]; // Add vocation bonus
      }

      // Update the displayed minor stat modifier
      document.querySelector(
        `#${minorStat} + .minor-stat-modifier`
      ).textContent = ` ${totalModifier}`;
    });
  }

  function handleMinorStatInput() {
    const minorStatElements = document.querySelectorAll(".minor-stat-input");
    minorStatElements.forEach((input) => {
      input.addEventListener("input", () => {
        const statId = input.id;
        const newValue = parseInt(input.value) || 0;
        userMinorStatInputs[statId] = newValue; // Store user input
        updateModifiers(); // Reapply all modifiers after user input
      });
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
  function applyRaceModifiers(selectedRace) {
    if (!raceData[selectedRace]) return;

    const race = raceData[selectedRace];
    raceBonuses = race.modifiers; // Store race modifiers for all relevant stats

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

    updateModifiers(); // Recalculate all modifiers after applying race modifiers
  }

  function applyVocationData(selectedVocation, vocationData) {
    if (!vocationData[selectedVocation]) return;

    const vocation = vocationData[selectedVocation];

    // Check if minor stat bonuses exist for the selected vocation
    if (vocation.minorStatBonuses) {
      vocationBonuses = vocation.minorStatBonuses; // Store vocation bonuses for relevant minor stats
    } else {
      vocationBonuses = {}; // Reset vocation bonuses if none exist
    }

    // Populate vocation-specific sections (weaponry, equipment, skills)
    populateVocationSections(vocation);

    // Apply vocation bonuses and update the character sheet
    updateModifiers();
  }
  // Populate vocation-specific sections like weaponry and skills
  function populateVocationSections(vocation) {
    const weaponrySection = document.getElementById("vocation-weaponry");
    weaponrySection.innerHTML = ""; // Clear previous data
    vocation.weaponry.forEach((item) => {
      const itemElement = document.createElement("li");
      if (item.type === "Armor") {
        itemElement.textContent = `${item.name} (Armor Rating: ${item.armor})`;
      } else {
        itemElement.textContent = `${item.name} (${
          item.type
        }) - Damage/Effect: ${item.damage || item.effect || "N/A"}`;
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

  // Fetch and load race data
  function loadRaceData() {
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        raceData = data.races;
      })
      .catch((error) => console.error("Error loading race data:", error));
  }

  // Fetch and load vocation data
  function loadVocationData() {
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        const vocationData = data.vocations;
        document
          .getElementById("vocation")
          .addEventListener("change", (event) => {
            const selectedVocation = event.target.value;
            applyVocationData(selectedVocation, vocationData);
          });
      })
      .catch((error) => console.error("Error loading vocation data:", error));
  }

  // Initialize event listeners and data loading
  Object.keys(majorStatSelectors).forEach((stat) => {
    const statInput = document.getElementById(majorStatSelectors[stat]);
    statInput.addEventListener("input", () => {
      storeUserInputValues(); // Store values on input
      updateModifiers(); // Update modifiers dynamically
    });
  });

  document.getElementById("race").addEventListener("change", (event) => {
    const selectedRace = event.target.value;
    applyRaceModifiers(selectedRace);
    document.getElementById("char-race-output").textContent =
      selectedRace.charAt(0).toUpperCase() + selectedRace.slice(1);
  });

  loadRaceData();
  loadVocationData();
  updateModifiers(); // Initial calculation
});
