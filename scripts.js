// -------------------------------
// FUNCTIONS FOR MAJOR/MINOR STATS
// -------------------------------
// Object to store all the major and minor stats
const stats = {
  charisma: {
    label: "Charisma",
    abbreviation: "Chr",
    value: 10,
    modifier: 0,
    minors: {
      persuasion: "persuasion",
      deception: "deception",
      bargaining: "bargaining",
      performance: "performance",
      charm: "charm",
    },
  },
  strength: {
    label: "Strength",
    abbreviation: "Str",
    value: 10,
    modifier: 0,
    minors: {
      acrobatics: "acrobatics",
      agility: "agility",
      lifting: "lifting",
    },
  },
  dexterity: {
    label: "Dexterity",
    abbreviation: "Dex",
    value: 10,
    modifier: 0,
    minors: {
      sleightOfHand: "sleight-of-hand",
      stealth: "stealth",
      medicine: "medicine",
      weaponMastery: "weapon-mastery",
      carving: "carving",
    },
  },
  intelligence: {
    label: "Intelligence",
    abbreviation: "Int",
    value: 10,
    modifier: 0,
    minors: {
      history: "history",
      wisdom: "wisdom",
      science: "science",
      technology: "technology",
      foraging: "foraging",
    },
  },
  vitality: {
    label: "Vitality",
    abbreviation: "Vit",
    value: 10,
    modifier: 0,
    minors: {
      endurance: "endurance",
      resistance: "resistance",
    },
  },
  willpower: {
    label: "Willpower",
    abbreviation: "Wil",
    innate: 10,
    extended: 10,
    modifierInnate: 10, // Willpower innate modifier
    modifierExtended: 10, // Willpower extended modifier
    minors: {
      featOfHeroism: "feat-of-heroism",
      leadership: "leadership",
      counterCharisma: "counter-charisma",
    },
  },
  arcana: {
    label: "Arcana",
    abbreviation: "Arc",
    value: 10,
    modifier: 10, // Arcana modifier is equal to the value
    minors: {
      magicalKnowledge: "magical-knowledge",
      magicSave: "magic-save",
    },
  },
  ferocity: {
    label: "Ferocity",
    abbreviation: "Fer",
    value: 10,
    modifier: 10, // Ferocity modifier is equal to the value
    minors: {
      intimidation: "intimidation",
      physicalSave: "physical-save",
    },
  },
};

// Function to calculate the modifier for regular major stats (except Fer, Arc, Wil)
function calculateStandardModifier(statValue) {
  return Math.floor((statValue - 10) / 2);
}

// Function to update major stat and modifier based on the type of stat
function updateMajorStat(statName, newValue) {
  const stat = stats[statName];

  if (statName === "ferocity" || statName === "arcana") {
    // Ferocity and Arcana: Modifier is directly equal to the stat value
    stat.value = newValue;
    stat.modifier = newValue;
    document.getElementById(`${statName}-modifier`).innerText = newValue;
  } else if (statName === "willpower") {
    // Willpower: Handle innate and extended separately
    stat.innate = newValue.innate;
    stat.extended = newValue.extended;
    stat.modifierInnate = newValue.innate;
    stat.modifierExtended = newValue.extended;
    document.getElementById(
      "willpower-modifier"
    ).innerText = `Innate: ${newValue.innate} (Extended: ${newValue.extended})`;
  } else {
    // All other stats: Calculate modifier based on the standard formula
    stat.value = newValue;
    stat.modifier = calculateStandardModifier(newValue);
    document.getElementById(`${statName}-modifier`).innerText = stat.modifier;
  }

  // Update the minor stats associated with this major stat
  updateMinorStats(statName);
}

// Function to update minor stats based on the modifier of the major stat
function updateMinorStats(statName) {
  const stat = stats[statName];
  const modifier = stat.modifier; // Fer, Arc, and standard stats all have a "modifier" field

  Object.keys(stat.minors).forEach((minorStat) => {
    const minorStatInput = document.getElementById(stat.minors[minorStat]); // Use the mapped element IDs from the stat object
    const userValue = Number(minorStatInput.value) || 0; // Get user input for this minor stat
    const finalValue = modifier + userValue; // Final minor stat = modifier + user input
    minorStatInput.nextElementSibling.innerText = finalValue; // Update the displayed value
  });
}

// Attach event listeners to handle input changes for each major stat
document.getElementById("strength").addEventListener("input", function () {
  const newValue = Number(this.value);
  updateMajorStat("strength", newValue);
});

document.getElementById("dexterity").addEventListener("input", function () {
  const newValue = Number(this.value);
  updateMajorStat("dexterity", newValue);
});

document.getElementById("intelligence").addEventListener("input", function () {
  const newValue = Number(this.value);
  updateMajorStat("intelligence", newValue);
});

document.getElementById("charisma").addEventListener("input", function () {
  const newValue = Number(this.value);
  updateMajorStat("charisma", newValue);
});

document.getElementById("vitality").addEventListener("input", function () {
  const newValue = Number(this.value);
  updateMajorStat("vitality", newValue);
});

document.getElementById("ferocity").addEventListener("input", function () {
  const newValue = Number(this.value);
  updateMajorStat("ferocity", newValue);
});

document.getElementById("arcana").addEventListener("input", function () {
  const newValue = Number(this.value);
  updateMajorStat("arcana", newValue);
});
// --------------------------------------------------------
// Handle willpower inputs separately (innate and extended)
// --------------------------------------------------------
document
  .getElementById("willpower-innate")
  .addEventListener("input", function () {
    const newValueInnate = Number(this.value);
    const newValueExtended = Number(
      document.getElementById("willpower-extended").value
    );
    updateMajorStat("willpower", {
      innate: newValueInnate,
      extended: newValueExtended,
    });
  });

document
  .getElementById("willpower-extended")
  .addEventListener("input", function () {
    const newValueInnate = Number(
      document.getElementById("willpower-innate").value
    );
    const newValueExtended = Number(this.value);
    updateMajorStat("willpower", {
      innate: newValueInnate,
      extended: newValueExtended,
    });
  });

// ----------------------------
// FUNCTIONS FOR RACE MODIFIERS
// ----------------------------

const races = {
  madorian: {
    name: "Madorian",
    passive: "Leadership checks low cap at 10",
    modifiers: {
      strength: 2,
      dexterity: 2,
      intelligence: -1,
      charisma: 0,
      vitality: 0,
      ferocity: 0,
      arcana: 0,
      willpower: 0,
    },
  },
  novorian: {
    name: "Novorian",
    passive: "Wisdom can be used in place of a general Charisma check",
    modifiers: {
      strength: 1,
      dexterity: 1,
      intelligence: 1,
      charisma: -2,
      vitality: 0,
      ferocity: 0,
      arcana: 0,
      willpower: 0,
    },
  },
  abrigian: {
    name: "Abrigian",
    passive: "Can use Willpower instead of Charisma during Charisma rolls",
    modifiers: {
      strength: -1,
      dexterity: -1,
      intelligence: 2,
      charisma: 0,
      vitality: 0,
      ferocity: 1,
      arcana: 0,
      willpower: 3,
    },
  },
};

// Store the base stat values separately, starting with default values
const baseStats = {
  strength: 10,
  dexterity: 10,
  intelligence: 10,
  charisma: 10,
  vitality: 10,
  ferocity: 1,
  arcana: 1,
  willpower: { innate: 1, extended: 0 },
};

// Function to update baseStats when a player manually inputs a value
function handlePlayerInput(statName, newValue) {
  if (statName === "willpower") {
    // Handle willpower's two parts separately
    baseStats.willpower.innate = newValue.innate;
    baseStats.willpower.extended = newValue.extended;
  } else {
    // Update the base value of the major stat
    baseStats[statName] = newValue;
  }
}

// Event listeners for manual player input (update base stats when a player enters a custom value)
document.getElementById("strength").addEventListener("input", function () {
  const newValue = Number(this.value);
  handlePlayerInput("strength", newValue);
});

document.getElementById("dexterity").addEventListener("input", function () {
  const newValue = Number(this.value);
  handlePlayerInput("dexterity", newValue);
});

document.getElementById("intelligence").addEventListener("input", function () {
  const newValue = Number(this.value);
  handlePlayerInput("intelligence", newValue);
});

document.getElementById("charisma").addEventListener("input", function () {
  const newValue = Number(this.value);
  handlePlayerInput("charisma", newValue);
});

document.getElementById("vitality").addEventListener("input", function () {
  const newValue = Number(this.value);
  handlePlayerInput("vitality", newValue);
});

document.getElementById("ferocity").addEventListener("input", function () {
  const newValue = Number(this.value);
  handlePlayerInput("ferocity", newValue);
});

document.getElementById("arcana").addEventListener("input", function () {
  const newValue = Number(this.value);
  handlePlayerInput("arcana", newValue);
});

// Handle willpower (innate and extended) separately
document
  .getElementById("willpower-innate")
  .addEventListener("input", function () {
    const newValueInnate = Number(this.value);
    const newValueExtended = Number(
      document.getElementById("willpower-extended").value
    );
    handlePlayerInput("willpower", {
      innate: newValueInnate,
      extended: newValueExtended,
    });
  });

document
  .getElementById("willpower-extended")
  .addEventListener("input", function () {
    const newValueInnate = Number(
      document.getElementById("willpower-innate").value
    );
    const newValueExtended = Number(this.value);
    handlePlayerInput("willpower", {
      innate: newValueInnate,
      extended: newValueExtended,
    });
  });

// Function to reset stats to base before applying race modifiers
function resetStatsToBase() {
  Object.keys(baseStats).forEach((statName) => {
    if (statName === "willpower") {
      // Handle willpower separately for innate and extended
      document.getElementById("willpower-innate").value =
        baseStats.willpower.innate;
      document.getElementById("willpower-extended").value =
        baseStats.willpower.extended;
    } else {
      // For other stats, set the value back to the base stat
      document.getElementById(statName).value = baseStats[statName];
    }
  });
}

// Function to apply race modifiers and update the displayed race modifier section
function applyRaceModifiers(race) {
  const raceData = races[race];

  // First, reset all stats to their base values (which might have been modified by the player)
  resetStatsToBase();

  // Loop through each major stat and apply the race modifiers
  Object.keys(raceData.modifiers).forEach((statName) => {
    if (statName === "willpower") {
      // Handle willpower separately for innate and extended
      const modifier = raceData.modifiers[statName];

      const innateElement = document.getElementById("willpower-innate");
      const extendedElement = document.getElementById("willpower-extended");

      if (innateElement && extendedElement) {
        const baseInnate = baseStats.willpower.innate;
        const baseExtended = baseStats.willpower.extended;

        // Apply the modifier to both innate and extended
        const newInnate = baseInnate + modifier;
        const newExtended = baseExtended + modifier;

        // Update the input fields for innate and extended
        innateElement.value = newInnate;
        extendedElement.value = newExtended;

        // Update Willpower dynamically (innate and extended are equal here)
        updateMajorStat("willpower", {
          innate: newInnate,
          extended: newExtended,
        });

        // Update the race modifier display for Willpower
        document.getElementById(
          `race-willpower-modifier`
        ).innerText = `Willpower: ${modifier}`;
      }
    } else {
      // Handle all other stats normally
      const modifier = raceData.modifiers[statName];
      const statElement = document.getElementById(statName);

      // Add a safety check to ensure statElement exists before modifying it
      if (!statElement) {
        console.error(`Element with ID '${statName}' not found`);
        return;
      }

      // Use the base stat value to apply the race modifier
      const baseValue = baseStats[statName];
      const newStatValue = baseValue + modifier;

      // Update the input field with the modified stat
      statElement.value = newStatValue;
      updateMajorStat(statName, newStatValue); // Update modifiers dynamically

      // Update the race modifier display
      document.getElementById(`race-${statName}-modifier`).innerText = `${
        statName.charAt(0).toUpperCase() + statName.slice(1)
      }: ${modifier}`;
    }
  });

  // Display the passive ability
  const racePassive = document.getElementById("race-passive-description");
  racePassive.innerText =
    raceData.passive || "No passive available for this race";
}

// Event listener for race selection
document.getElementById("race").addEventListener("change", function () {
  const selectedRace = this.value;
  if (selectedRace) {
    applyRaceModifiers(selectedRace);
  }
});

// --------------------------------------------------
// FUNCTIONS FOR HANDLING VOCATIONS AND VOCATION DATA
// --------------------------------------------------

// {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{FIX!}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
//?? WHEN VOCATION IS CHANGED IT ADDS THE MODIFIER WITHOUT RESETTING TO THE SET NUMBER
// {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{FIX!}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
let vocationData = {}; // Variable to store the loaded data

// Fetch the data.json file
fetch("data.json")
  .then((response) => response.json()) // Convert the response to JSON
  .then((data) => {
    vocationData = data.vocations; // Save the vocations data for later use
    populateVocationOptions(vocationData); // Populate the dropdown with vocations
  })
  .catch((error) => console.error("Error loading JSON:", error));

// Function to populate the vocation dropdown
function populateVocationOptions(vocations) {
  const vocationSelect = document.getElementById("vocation");

  // Clear existing options
  vocationSelect.innerHTML = '<option value="">--Choose a Vocation--</option>';

  // Loop through the vocations in the data and create <option> elements
  Object.keys(vocations).forEach((vocationKey) => {
    const vocationOption = document.createElement("option");
    vocationOption.value = vocationKey;
    vocationOption.textContent = vocations[vocationKey].name;
    vocationSelect.appendChild(vocationOption);
  });
}

// Function to apply vocation-specific bonuses to minor stats and micro stats
function applyVocationBonuses(vocation) {
  const vocationData = vocation;

  // Apply minor stat bonuses
  Object.keys(vocationData.minorStatBonuses).forEach((minorStat) => {
    const bonus = vocationData.minorStatBonuses[minorStat];
    const minorStatElement = document.getElementById(minorStat);

    if (minorStatElement) {
      const currentValue = Number(minorStatElement.value) || 0;
      const newValue = currentValue + bonus;
      minorStatElement.value = newValue;
      minorStatElement.nextElementSibling.innerText = newValue; // Assuming next sibling displays final value
    }
  });

  // Apply micro stat bonuses and update micro stats section
  applyMicroStats(vocationData.microStats);

  applyMinorStats(vocationData.minorStatBonuses);

  // Update vocation details in the HTML (weaponry, equipment, skills, armor rating)
  updateVocationDetails(vocationData);
}

// Function to apply micro stat bonuses
function applyMicroStats(microStats) {
  // Update micro stats section in the HTML
  const microStatsList = document.getElementById("char-micro-output");
  microStatsList.innerHTML = ""; // Clear previous micro stats

  Object.keys(microStats).forEach((microStat) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${microStat.replace(/-/g, " ")}: ${
      microStats[microStat]
    }`;
    microStatsList.appendChild(listItem);
  });
}

// Function to apply minor stat bonuses
function applyMinorStats(minorStatBonuses) {
  // Update minor stats section in the HTML
  const minorStatsList = document.getElementById("char-minor-output"); // Use "char-minor-output"
  minorStatsList.innerHTML = ""; // Clear previous minor stats

  // Loop through each minor stat and display its value
  Object.keys(minorStatBonuses).forEach((minorStat) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${minorStat.replace(/-/g, " ")}: ${
      minorStatBonuses[minorStat]
    }`;
    minorStatsList.appendChild(listItem);
  });
}

// Function to populate vocation details in the HTML (weaponry, equipment, skills, armor rating)
function updateVocationDetails(vocationData) {
  // Update weaponry section
  const weaponryList = document.getElementById("vocation-weaponry");
  weaponryList.innerHTML = "";
  let totalArmorRating = 0; // Track total AR

  vocationData.weaponry.forEach((weapon) => {
    const listItem = document.createElement("li");
    if (weapon.armor) {
      listItem.textContent = `${weapon.name} (${weapon.type}) - ${weapon.armor}`;
      totalArmorRating += parseInt(weapon.armor); // Add to total armor rating if it has AR
    } else {
      listItem.textContent = `${weapon.name} (${weapon.type}) - ${
        weapon.damage || weapon.effect
      }`;
    }
    weaponryList.appendChild(listItem);
  });

  // Update equipment section
  const equipmentList = document.getElementById("vocation-equipment");
  equipmentList.innerHTML = "";
  vocationData.equipment.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    equipmentList.appendChild(listItem);
  });

  // Update skills section
  const skillsList = document.getElementById("vocation-skills");
  skillsList.innerHTML = "";
  vocationData.skills.forEach((skill) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${skill.name}: ${skill.description}`;
    skillsList.appendChild(listItem);
  });

  // Update total Armor Rating (AR) in the relevant section
  const armorRatingElement = document.getElementById("armor-rating");
  armorRatingElement.innerText = `Total Armor Rating: ${totalArmorRating} AR`;
}

// Event listener for vocation selection
document.getElementById("vocation").addEventListener("change", function () {
  const selectedVocation = this.value;
  if (selectedVocation) {
    applyVocationBonuses(vocationData[selectedVocation]);
  }
});

function updateCharacterSheet(characterData) {
  // Update Character Info
  document.getElementById("char-name").value = characterData.name || "N/A";
  document.getElementById("char-race").value = characterData.race || "N/A";
  document.getElementById("char-vocation").value =
    characterData.vocation || "N/A";

  // Update Major Stats
  document.getElementById("char-strength").value =
    characterData.stats.strength || 0;
  document.getElementById("char-dexterity").value =
    characterData.stats.dexterity || 0;
  // Add other major stats similarly

  // Update Minor Stats
  updateList("char-minor-output", characterData.minorStats);

  // Update Micro Stats
  updateList("char-micro-output", characterData.microStats);

  // Update Attributes (HP, AR, SC, etc.)
  document.getElementById("char-hp").value = characterData.attributes.hp || 0;
  document.getElementById("char-ar").value = characterData.attributes.ar || 0;
  document.getElementById("char-mr").value = characterData.attributes.mr || 0;
  // Add other attributes similarly

  // Update Skills
  updateList("char-skills-output", characterData.skills);

  // Update Equipment
  updateList("char-equipment-output", characterData.equipment);

  // Update Passives
  document.getElementById("char-passive-output").textContent =
    characterData.passives || "No passives selected";
}

function updateList(elementId, dataList) {
  const listElement = document.getElementById(elementId);
  listElement.innerHTML = ""; // Clear current list

  if (dataList && dataList.length > 0) {
    dataList.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      listElement.appendChild(listItem);
    });
  } else {
    listElement.innerHTML = "<li>None</li>";
  }
}

updateCharacterSheet(CharacterData);
