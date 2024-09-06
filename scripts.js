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
        // Ferocity and Arcana use direct value as modifier
        modifier = calculateDirectModifier(majorStatValue);
      } else {
        // Standard stats (Str, Dex, Int, Chr, Vit) use the 2 points above 10 rule
        modifier = calculateStandardModifier(majorStatValue);
      }

      // Update the major stat modifier span
      document.getElementById(
        `${stat}-modifier`
      ).textContent = `Modifier: ${modifier}`;

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
          ).nextElementSibling.textContent = `Modifier: ${finalMinorStatValue}`;
        });
      }
    });
  }

  // Add event listeners to all major stat and minor stat inputs
  Object.values(majorStatSelectors).forEach((stat) => {
    const inputElement = document.getElementById(stat);
    if (inputElement) {
      inputElement.addEventListener("input", updateModifiers);
    }
  });

  // Add event listeners to all minor stat inputs
  Object.keys(minorStatSelectors).forEach((majorStat) => {
    minorStatSelectors[majorStat].forEach((minorStat) => {
      const inputElement = document.getElementById(minorStat);
      if (inputElement) {
        inputElement.addEventListener("input", updateModifiers);
      }
    });
  });

  // Initialize modifiers when the page loads
  updateModifiers();
});
