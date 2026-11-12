let prices = [5, 2];
let quantities = [1, 4];
let total = 0;

for (let i = 0; i < prices.length; i++) {
  let lineTotal = prices[i] * quantities[i];
  if (quantities[i] >= 3) {
    lineTotal -= quantities[i];
  }
  total += lineTotal;
}

console.log("Total:", total);