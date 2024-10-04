function calculateSeeds() {
    // Get input values
    const seedRate = parseFloat(document.getElementById('seedRate').value);
    const tgw = parseFloat(document.getElementById('tgw').value);
    const rowSpacing = parseFloat(document.getElementById('rowSpacing').value);
    const germinationRate = parseFloat(document.getElementById('germinationRate').value);

    // Validate inputs
    if (isNaN(seedRate) || isNaN(tgw) || isNaN(rowSpacing) || isNaN(germinationRate)) {
        alert('Please enter all fields correctly.');
        return;
    }

    // Calculate seeds per meter
    const seedsPerHa = (seedRate * 1000) / tgw;
    const seedsPerMeterRow = (seedsPerHa / (10000 / rowSpacing)) * (germinationRate / 100);

    // Display result
    document.getElementById('result').innerText = `Optimal Seeds per Meter: ${seedsPerMeterRow.toFixed(2)} seeds/meter`;
}
