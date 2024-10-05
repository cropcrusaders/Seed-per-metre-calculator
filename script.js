// script.js

document.getElementById('seed-form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get input values
  const seedsPerKg = parseFloat(document.getElementById('seeds-per-kg').value);
  const germinationRate = parseFloat(document.getElementById('germination-rate').value);
  const moistureDepth = parseFloat(document.getElementById('moisture-depth').value);
  const soilType = document.getElementById('soil-type').value;
  const trashLevel = parseFloat(document.getElementById('trash-level').value);
  const otherSeeds = document.getElementById('other-seeds').value;
  const cropType = document.getElementById('crop-type').value;
  const region = document.getElementById('region').value;

  // Validate inputs
  if (germinationRate <= 0 || germinationRate > 100) {
    alert('Please enter a valid germination rate between 1 and 100%.');
    return;
  }

  if (seedsPerKg <= 0) {
    alert('Please enter a valid number for seeds per kilogram.');
    return;
  }

  // Calculate seeds per hectare
  const seedsPerHectare = calculateSeedsPerHectare(seedsPerKg, germinationRate, moistureDepth, soilType, trashLevel, otherSeeds, cropType, region);

  // Display the result
  document.getElementById('result').innerText = `Optimal Seeding Rate: ${seedsPerHectare.toLocaleString()} seeds/ha`;
});

function calculateSeedsPerHectare(seedsPerKg, germinationRate, moistureDepth, soilType, trashLevel, otherSeeds, cropType, region) {
  // Base seed rate per hectare for the selected crop type
  let baseRate = getBaseSeedRate(cropType, region); // in seeds per hectare

  // Adjustments
  const seedSizeFactor = adjustForSeedSize(seedsPerKg, cropType);
  const moistureFactor = adjustForMoistureDepth(moistureDepth);
  const soilFactor = adjustForSoilType(soilType);
  const trashFactor = adjustForTrashLevel(trashLevel);
  const weedFactor = adjustForOtherSeeds(otherSeeds);

  // Calculate final seed rate before germination adjustment
  let finalSeedRate = baseRate * seedSizeFactor * moistureFactor * soilFactor * trashFactor * weedFactor;

  // Adjust for germination rate
  finalSeedRate = finalSeedRate / (germinationRate / 100);

  return Math.round(finalSeedRate);
}

function getBaseSeedRate(cropType, region) {
  const baseRates = {
    'wheat': {
      'australia': 200000, // seeds per hectare
      'canada': 250000,
    },
    'barley': {
      'australia': 175000,
      'canada': 225000,
    },
    'canola': {
      'australia': 5000000,
      'canada': 6000000,
    },
    'soybean': {
      'australia': 0, // Not commonly grown
      'canada': 450000,
    },
    'corn': {
      'australia': 75000,
      'canada': 80000,
    },
    'oats': {
      'australia': 225000,
      'canada': 275000,
    },
    'chickpeas': {
      'australia': 350000,
      'canada': 0,
    },
    'lentils': {
      'australia': 135000,
      'canada': 135000,
    },
    'sorghum': {
      'australia': 100000,
      'canada': 0,
    },
    'cotton': {
      'australia': 100000,
      'canada': 0,
    },
    'rice': {
      'australia': 3000000,
      'canada': 0,
    },
    'peas': {
      'australia': 800000,
      'canada': 800000,
    },
    'sunflower': {
      'australia': 50000,
      'canada': 50000,
    },
    // Add more crops as needed
  };

  // Handle cases where the crop is not grown in the region
  if (!baseRates[cropType] || !baseRates[cropType][region]) {
    alert(`Data for ${cropType} in ${region} is not available.`);
    return 0;
  }

  return baseRates[cropType][region];
}

function adjustForSeedSize(seedsPerKg, cropType) {
  // Standard seeds per kg for each crop
  const standardSeedsPerKg = {
    'wheat': 25000,     // seeds per kg
    'barley': 22000,
    'canola': 330000,
    'soybean': 5000,
    'corn': 3000,
    'oats': 32000,
    'chickpeas': 4000,
    'lentils': 20000,
    'sorghum': 40000,
    'cotton': 8300,
    'rice': 40000,
    'peas': 7000,
    'sunflower': 16000,
    // Add standard seeds per kg for other crops
  };

  const cropStandardSeedsPerKg = standardSeedsPerKg[cropType];

  if (!cropStandardSeedsPerKg) {
    // If no standard is available, default to no adjustment
    return 1.0;
  }

  // Calculate percentage difference
  const percentageDifference = (seedsPerKg - cropStandardSeedsPerKg) / cropStandardSeedsPerKg;

  if (percentageDifference > 0.1) {
    // Seeds are smaller (more seeds per kg), increase seeding rate by 5%
    return 1.05;
  } else if (percentageDifference < -0.1) {
    // Seeds are larger (fewer seeds per kg), decrease seeding rate by 5%
    return 0.95;
  } else {
    // Within acceptable range, no adjustment
    return 1.0;
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
  return soilFactors[soilType] || 1.0; // Default to no adjustment if soil type is unknown
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
  return weedFactors[otherSeeds] || 1.0; // Default to no adjustment if weed pressure is unknown
}
