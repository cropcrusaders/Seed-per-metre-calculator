// script.js

document.getElementById('seed-form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get input values
  const seedSize = parseFloat(document.getElementById('seed-size').value);
  const germinationRate = parseFloat(document.getElementById('germination-rate').value);
  const moistureDepth = parseFloat(document.getElementById('moisture-depth').value);
  const soilType = document.getElementById('soil-type').value;
  const trashLevel = parseFloat(document.getElementById('trash-level').value);
  const otherSeeds = document.getElementById('other-seeds').value;
  const cropType = document.getElementById('crop-type').value;
  const region = document.getElementById('region').value;

  // Validate germination rate
  if (germinationRate <= 0 || germinationRate > 100) {
    alert('Please enter a valid germination rate between 1 and 100%.');
    return;
  }

  // Calculate seeds per hectare
  const seedsPerHectare = calculateSeedsPerHectare(seedSize, germinationRate, moistureDepth, soilType, trashLevel, otherSeeds, cropType, region);

  // Display the result
  document.getElementById('result').innerText = `Optimal Seeding Rate: ${seedsPerHectare.toLocaleString()} seeds/ha`;
});

function calculateSeedsPerHectare(seedSize, germinationRate, moistureDepth, soilType, trashLevel, otherSeeds, cropType, region) {
  // Base seed rate per hectare for the selected crop type
  let baseRate = getBaseSeedRate(cropType, region); // in seeds per hectare

  // Adjustments
  const seedSizeFactor = adjustForSeedSize(seedSize, cropType);
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
      'australia': 5000000, // seeds per hectare
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

function adjustForSeedSize(seedSize, cropType) {
  // Adjustments based on Thousand Kernel Weight (TKW) or seed size per crop
  // For simplicity, assume standard TKW per crop and adjust accordingly

  // Example for wheat
  const standardTKW = {
    'wheat': 40,
    'barley': 45,
    'canola': 3,
    'soybean': 200,
    'corn': 300,
    'oats': 35,
    'chickpeas': 250,
    'lentils': 50,
    'sorghum': 25,
    'cotton': 120,
    'rice': 25,
    'peas': 150,
    'sunflower': 60,
    // Add standard TKWs for other crops
  };

  const cropTKW = standardTKW[cropType] || seedSize;

  if (seedSize < cropTKW * 0.9) {
    return 1.05; // Increase seeding rate by 5%
  } else if (seedSize > cropTKW * 1.1) {
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
