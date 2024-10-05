document.getElementById('seed-form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get input values
  const seedSize = parseFloat(document.getElementById('seed-size').value);
  const moistureDepth = parseFloat(document.getElementById('moisture-depth').value);
  const soilType = document.getElementById('soil-type').value;
  const trashLevel = parseFloat(document.getElementById('trash-level').value);
  const otherSeeds = document.getElementById('other-seeds').value;
  const cropType = document.getElementById('crop-type').value;

  // Calculate seeds per metre
  const seedsPerMetre = calculateSeedsPerMetre(seedSize, moistureDepth, soilType, trashLevel, otherSeeds, cropType);

  // Display the result
  document.getElementById('result').innerText = `Optimal Seeds Per Metre: ${seedsPerMetre.toFixed(2)}`;
});

function calculateSeedsPerMetre(seedSize, moistureDepth, soilType, trashLevel, otherSeeds, cropType) {
  // Base seed rate per metre for the selected crop type
  let baseRate = getBaseSeedRate(cropType);

  // Adjustments
  const seedSizeFactor = adjustForSeedSize(seedSize);
  const moistureFactor = adjustForMoistureDepth(moistureDepth);
  const soilFactor = adjustForSoilType(soilType);
  const trashFactor = adjustForTrashLevel(trashLevel);
  const weedFactor = adjustForOtherSeeds(otherSeeds);

  // Calculate final seed rate
  const finalSeedRate = baseRate * seedSizeFactor * moistureFactor * soilFactor * trashFactor * weedFactor;

  return finalSeedRate;
}

function getBaseSeedRate(cropType) {
  const baseRates = {
    'wheat': 250,    // seeds per square metre
    'corn': 8,       // seeds per metre (assuming 75 cm row spacing)
    'soybean': 35,   // seeds per metre (assuming 19 cm row spacing)
    'barley': 200,   // seeds per square metre
    'canola': 70,    // seeds per square metre
    // Add more crop types and their base rates
  };
  return baseRates[cropType];
}

function adjustForSeedSize(seedSize) {
  // Seed size in grams per 1000 seeds (TKW)
  if (seedSize < 35) {
    return 1.05; // Increase seeding rate by 5%
  } else if (seedSize > 45) {
    return 0.95; // Decrease seeding rate by 5%
  } else {
    return 1.0;  // No adjustment
  }
}

function adjustForMoistureDepth(moistureDepth) {
  if (moistureDepth < 5) {
    return 1.10; // Increase seeding rate by 10%
  } else if (moistureDepth > 10) {
    return 0.95; // Decrease seeding rate by 5%
  } else {
    return 1.0;  // No adjustment
  }
}

function adjustForSoilType(soilType) {
  const soilFactors = {
    'sandy': 1.10,  // Increase seeding rate by 10%
    'loamy': 1.0,   // No adjustment
    'clay': 0.95,   // Decrease seeding rate by 5%
  };
  return soilFactors[soilType];
}

function adjustForTrashLevel(trashLevel) {
  if (trashLevel < 30) {
    return 1.0;   // No adjustment
  } else if (trashLevel <= 60) {
    return 1.05;  // Increase seeding rate by 5%
  } else {
    return 1.10;  // Increase seeding rate by 10%
  }
}

function adjustForOtherSeeds(otherSeeds) {
  const weedFactors = {
    'low': 1.0,      // No adjustment
    'moderate': 1.05, // Increase seeding rate by 5%
    'high': 1.10,    // Increase seeding rate by 10%
  };
  return weedFactors[otherSeeds];
}
