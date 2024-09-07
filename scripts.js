document.addEventListener("DOMContentLoaded", () => {
  // Selectors for major stat inputs
  const majorStatSelectors = {
    strength: "strength",
    dexterity: "dexterity",
    intelligence: "intelligence",
    charisma: "charisma",
    vitality: "vitality",
    ferocity: "ferocity",
    arcana: "arcana",
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
    return Math.max(0, Math.floor((statValue - 10) / 2));
  }

  // Function to calculate the modifier for Fer and Arc
  function calculateDirectModifier(statValue) {
    return statValue;
  }

  // Function to update the modifiers in the HTML
  function updateModifiers() {
    Object.keys(majorStatSelectors).forEach((stat) => {
      const majorStatInput = document.getElementById(majorStatSelectors[stat]);
      const majorStatValue = parseInt(majorStatInput.value) || 0;
      let modifier;

      if (["ferocity", "arcana"].includes(stat)) {
        modifier = calculateDirectModifier(majorStatValue);
      } else {
        modifier = calculateStandardModifier(majorStatValue);
      }

      // Update the major stat modifier span
      document.getElementById(`${stat}-modifier`).textContent = ` ${modifier}`;

      // Update all associated minor stat modifiers
      if (minorStatSelectors[stat]) {
        minorStatSelectors[stat].forEach((minorStat) => {
          const minorStatInput = document.getElementById(minorStat);
          const minorStatValue = parseInt(minorStatInput.value) || 0;

          // Calculate final value by adding the major stat modifier and the minor stat input value
          const finalMinorStatValue = modifier + minorStatValue;

          // Update the span next to the minor stat input with the final value
          document.getElementById(
            `${minorStat}`
          ).nextElementSibling.textContent = `${finalMinorStatValue}`;
        });
      }
    });
  }

  // Race data storage
  let raceData = {};

  // Fetch race data from data.json
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

    // Update the race stat modifiers (Strength, Dexterity, Intelligence, etc.)
    Object.keys(race.modifiers).forEach((stat) => {
      const raceModifierElement = document.getElementById(
        `race-${stat}-modifier`
      );
      const baseStatElement = document.getElementById(stat); // Ensure IDs match major stat inputs
      if (raceModifierElement && baseStatElement) {
        const baseStatValue = parseInt(baseStatElement.value) || 0;
        const raceModifier = race.modifiers[stat];

        // Update the race modifier display
        raceModifierElement.textContent = `${
          stat.charAt(0).toUpperCase() + stat.slice(1)
        }: ${raceModifier}`;

        // Update the stat value in the input field (base stat + race modifier)
        const modifiedStatValue = baseStatValue + raceModifier;
        baseStatElement.value = modifiedStatValue;

        // Update the major stat modifier on the character sheet
        document.getElementById(
          `${stat}-modifier`
        ).textContent = `${calculateStandardModifier(modifiedStatValue)}`;
      }
    });

    // Recalculate minor stat modifiers after applying race modifiers
    updateModifiers();
  }

  // Event listener for race selection
  document.getElementById("race").addEventListener("change", (event) => {
    const selectedRace = event.target.value;
    applyRaceModifiers(selectedRace);

    // Update the race on the character sheet
    document.getElementById("char-race-output").textContent =
      selectedRace.charAt(0).toUpperCase() + selectedRace.slice(1);
  });

  // Load race data and initialize modifiers when the page loads
  loadRaceData();
  updateModifiers();

  // Add event listeners to all major and minor stat inputs
  Object.keys(majorStatSelectors).forEach((stat) => {
    const majorInput = document.getElementById(majorStatSelectors[stat]);
    if (majorInput) {
      majorInput.addEventListener("input", updateModifiers);
    }

    if (minorStatSelectors[stat]) {
      minorStatSelectors[stat].forEach((minorStat) => {
        const minorInput = document.getElementById(minorStat);
        if (minorInput) {
          minorInput.addEventListener("input", updateModifiers);
        }
      });
    }
  });

  // Add event listener for Willpower input if it exists
  const willpowerInput = document.getElementById("willpower");
  if (willpowerInput) {
    willpowerInput.addEventListener("input", updateWillpowerModifier);
  }
});

// Function to update the Willpower innate value
function updateWillpowerModifier() {
  const willpowerInput = document.getElementById("willpower");
  const willpowerValue = parseInt(willpowerInput.value) || 0;

  // Update the innate willpower value (innate matches willpower value)
  const innateElement = document.getElementById("willpower-modifier");
  innateElement.textContent = `Innate: ${willpowerValue} (Extended: 0)`;
}
