document.addEventListener("DOMContentLoaded", () => {
  // Selectors for major stat inputs (with willpower-innate and willpower-extended now)
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

  // Selectors for the minor stat inputs
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

  // Function to calculate modifiers for Str, Dex, Int, Chr, Vit
  function calculateStandardModifier(statValue) {
    if (statValue >= 10) {
      return Math.floor((statValue - 10) / 2); // +1 for every 2 points above 10
    } else {
      return Math.floor((statValue - 10) / 2); // -1 for every 2 points below 10
    }
  }

  // Function to calculate the modifier for Fer and Arc
  function calculateDirectModifier(statValue) {
    return statValue;
  }

  // Function to update Willpower
  function updateWillpower() {
    const willpowerInnateValue =
      parseInt(document.getElementById("willpower-innate").value) || 0;
    const willpowerExtendedValue =
      parseInt(document.getElementById("willpower-extended").value) || 0;

    // Update the Willpower display for both innate and extended
    const willpowerModifierDisplay =
      document.getElementById("willpower-modifier");
    willpowerModifierDisplay.textContent = `Innate: ${willpowerInnateValue} (Extended: ${willpowerExtendedValue})`;
  }

  // Function to update the modifiers in the HTML
  function updateModifiers() {
    Object.keys(majorStatSelectors).forEach((stat) => {
      if (stat !== "willpowerInnate" && stat !== "willpowerExtended") {
        const majorStatInput = document.getElementById(
          majorStatSelectors[stat]
        );
        const majorStatValue = parseInt(majorStatInput.value) || 0;
        let modifier;

        if (["ferocity", "arcana"].includes(stat)) {
          modifier = calculateDirectModifier(majorStatValue);
        } else {
          modifier = calculateStandardModifier(majorStatValue);
        }

        // Update the major stat modifier span
        document.getElementById(
          `${stat}-modifier`
        ).textContent = ` ${modifier}`;
      }
    });

    // Update Willpower separately
    updateWillpower();
  }

  // Add event listeners to all major stat inputs
  Object.keys(majorStatSelectors).forEach((stat) => {
    const inputElement = document.getElementById(majorStatSelectors[stat]);
    if (inputElement) {
      inputElement.addEventListener("input", updateModifiers);
    }
  });

  // Load race data from JSON and initialize modifiers
  function loadRaceData() {
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        raceData = data.races;
      })
      .catch((error) => {
        console.error("Error loading race data:", error);
      });
  }

  // Function to apply race modifiers and update character sheet
  function applyRaceModifiers(selectedRace) {
    if (!raceData[selectedRace]) return;

    const race = raceData[selectedRace];

    // Update the race passive section in the form and character sheet
    document.getElementById("race-passive-description").textContent =
      race.passive;
    document.getElementById("char-passive-output").textContent = race.passive;

    // Update the race stat modifiers display (Strength, Dexterity, Intelligence, etc.)
    document.getElementById(
      "race-strength-modifier"
    ).textContent = `Strength: ${race.modifiers.strength}`;
    document.getElementById(
      "race-dexterity-modifier"
    ).textContent = `Dexterity: ${race.modifiers.dexterity}`;
    document.getElementById(
      "race-intelligence-modifier"
    ).textContent = `Intelligence: ${race.modifiers.intelligence}`;
    document.getElementById(
      "race-charisma-modifier"
    ).textContent = `Charisma: ${race.modifiers.charisma}`;
    document.getElementById(
      "race-vitality-modifier"
    ).textContent = `Vitality: ${race.modifiers.vitality}`;
    document.getElementById(
      "race-ferocity-modifier"
    ).textContent = `Ferocity: ${race.modifiers.ferocity}`;
    document.getElementById(
      "race-arcana-modifier"
    ).textContent = `Arcana: ${race.modifiers.arcana}`;
    document.getElementById(
      "race-willpower-modifier"
    ).textContent = `Willpower: ${race.modifiers.willpower}`;

    // Apply the race modifiers to the form inputs (base stats)
    Object.keys(race.modifiers).forEach((stat) => {
      const baseStatElement = document.getElementById(stat);
      if (baseStatElement) {
        const raceModifier = race.modifiers[stat];
        const baseStatValue = parseInt(baseStatElement.value) || 0;
        const modifiedStatValue = baseStatValue + raceModifier;

        baseStatElement.value = modifiedStatValue;
        document.getElementById(`${stat}-modifier`).textContent =
          calculateStandardModifier(modifiedStatValue);
      }
    });

    // Apply the Willpower modifier to the "innate" Willpower stat
    const willpowerInnateElement = document.getElementById("willpower-innate");
    if (race.modifiers.willpower) {
      const willpowerModifier = race.modifiers.willpower;
      willpowerInnateElement.value =
        parseInt(willpowerInnateElement.value || 0) + willpowerModifier;

      // Trigger Willpower update to display the new values
      updateWillpower();
    }

    // Recalculate all modifiers after applying race modifiers
    updateModifiers();
  }

  // Race selection event listener
  document.getElementById("race").addEventListener("change", (event) => {
    const selectedRace = event.target.value;
    applyRaceModifiers(selectedRace);

    document.getElementById("char-race-output").textContent =
      selectedRace.charAt(0).toUpperCase() + selectedRace.slice(1);
  });

  // Initialize race data and stat modifiers on page load
  loadRaceData();
  updateModifiers();
});

// Function to load vocation data from JSON and populate the character sheet
function loadVocationData() {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      // Get vocation data from JSON
      const vocationData = data.vocations;

      // Add event listener for vocation selection
      document
        .getElementById("vocation")
        .addEventListener("change", function (event) {
          const selectedVocation = event.target.value;
          applyVocationData(selectedVocation, vocationData);
        });
    })
    .catch((error) => {
      console.error("Error loading vocation data:", error);
    });
}

// Function to apply vocation data to the character sheet
function applyVocationData(selectedVocation, vocationData) {
  if (!vocationData[selectedVocation]) return;

  const vocation = vocationData[selectedVocation];

  // Populate weaponry section
  const weaponrySection = document.getElementById("vocation-weaponry");
  weaponrySection.innerHTML = ""; // Clear previous data
  vocation.weaponry.forEach((item) => {
    const itemElement = document.createElement("p");
    itemElement.textContent = `${item.name} (${item.type}) - Damage/Effect: ${
      item.damage || item.effect || "N/A"
    }`;
    weaponrySection.appendChild(itemElement);
  });

  // Populate equipment section
  const equipmentSection = document.getElementById("vocation-equipment");
  equipmentSection.innerHTML = ""; // Clear previous data
  vocation.equipment.forEach((item) => {
    const itemElement = document.createElement("p");
    itemElement.textContent = item;
    equipmentSection.appendChild(itemElement);
  });

  // Populate skills section
  const skillsSection = document.getElementById("vocation-skills");
  skillsSection.innerHTML = ""; // Clear previous data
  vocation.skills.forEach((skill) => {
    const skillElement = document.createElement("p");
    skillElement.textContent = `${skill.name}: ${skill.description}`;
    skillsSection.appendChild(skillElement);
  });

  // Populate magic section (if the vocation has magic)
  const magicSection = document.getElementById("vocation-magic");
  magicSection.innerHTML = ""; // Clear previous data
  if (vocation.magic) {
    if (vocation.magic.catalystic) {
      const catalysticHeading = document.createElement("h4");
      catalysticHeading.textContent = "Catalystic Magic";
      magicSection.appendChild(catalysticHeading);

      vocation.magic.catalystic.forEach((spell) => {
        const spellElement = document.createElement("p");
        spellElement.textContent = `${spell.name} (Cost: ${spell.cost}) - Effect: ${spell.effect}`;
        magicSection.appendChild(spellElement);
      });
    }

    if (vocation.magic.runic) {
      const runicHeading = document.createElement("h4");
      runicHeading.textContent = "Runic Magic";
      magicSection.appendChild(runicHeading);

      vocation.magic.runic.forEach((spell) => {
        const spellElement = document.createElement("p");
        spellElement.textContent = `${spell.name} (Cost: ${spell.cost}) - Effect: ${spell.effect}`;
        magicSection.appendChild(spellElement);
      });
    }
  }
}

// Initialize vocation data when the page loads
loadVocationData();
