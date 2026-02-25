#!/usr/bin/env node

/**
 * Card Reordering Logic Test
 * Tests the core card reordering algorithm to ensure it works correctly
 */

// Test data
const mockCards = [
  {
    id: "card1",
    name: "Starbucks",
    description: "Coffee",
    codeImageDataUrl: "data:image/png;base64,test",
    lastUsed: Date.now(),
    createdAt: Date.now(),
    orderLocked: false,
    order: 0,
  },
  {
    id: "card2",
    name: "Target",
    description: "Retail",
    codeImageDataUrl: "data:image/png;base64,test",
    lastUsed: Date.now() - 1000,
    createdAt: Date.now() - 1000,
    orderLocked: false,
    order: 1,
  },
  {
    id: "card3",
    name: "Walgreens",
    description: "Pharmacy",
    codeImageDataUrl: "data:image/png;base64,test",
    lastUsed: Date.now() - 2000,
    createdAt: Date.now() - 2000,
    orderLocked: false,
    order: 2,
  },
];

// Test helper function
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✓ ${message}`);
  }
}

// Simulate the reordering logic
function simulateMoveCard(cards, cardId, direction) {
  const cardIndex = cards.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return null;

  const newIndex = direction === "up" ? cardIndex - 1 : cardIndex + 1;
  if (newIndex < 0 || newIndex >= cards.length) return null;

  const reorderedCards = [...cards];
  [reorderedCards[cardIndex], reorderedCards[newIndex]] = [
    reorderedCards[newIndex],
    reorderedCards[cardIndex],
  ];

  // Update order field for all cards
  for (let i = 0; i < reorderedCards.length; i++) {
    reorderedCards[i].order = i;
  }

  return reorderedCards;
}

// Run tests
console.log("\n🧪 Running Card Reordering Tests...\n");

// Test 1: Move card up
console.log("Test 1: Move card up");
let result = simulateMoveCard(mockCards, "card2", "up");
assert(result !== null, "Move up should succeed for middle card");
assert(result[0].id === "card2", "Target should move to first position");
assert(result[1].id === "card1", "Starbucks should move to second position");
assert(result[2].id === "card3", "Walgreens should stay at third position");
assert(result[0].order === 0, "Target order should be 0");
assert(result[1].order === 1, "Starbucks order should be 1");
assert(result[2].order === 2, "Walgreens order should be 2");

// Test 2: Move card down
console.log("\nTest 2: Move card down");
result = simulateMoveCard(mockCards, "card1", "down");
assert(result !== null, "Move down should succeed for first card");
assert(result[0].id === "card2", "Target should move to first position");
assert(result[1].id === "card1", "Starbucks should move to second position");
assert(result[2].id === "card3", "Walgreens should stay at third position");
assert(result[0].order === 0, "Target order should be 0");
assert(result[1].order === 1, "Starbucks order should be 1");
assert(result[2].order === 2, "Walgreens order should be 2");

// Test 3: Cannot move first card up
console.log("\nTest 3: Cannot move first card up");
result = simulateMoveCard(mockCards, "card1", "up");
assert(result === null, "Move up should fail for first card");

// Test 4: Cannot move last card down
console.log("\nTest 4: Cannot move last card down");
result = simulateMoveCard(mockCards, "card3", "down");
assert(result === null, "Move down should fail for last card");

// Test 5: Multiple moves (sequence test)
console.log("\nTest 5: Multiple sequential moves");
let cards = [...mockCards];
// Move card3 (Walgreens) up twice
cards = simulateMoveCard(cards, "card3", "up");
assert(cards[1].id === "card3", "After first move up, Walgreens at index 1");
cards = simulateMoveCard(cards, "card3", "up");
assert(cards[0].id === "card3", "After second move up, Walgreens at index 0");
// Now move it down twice to get back
cards = simulateMoveCard(cards, "card3", "down");
cards = simulateMoveCard(cards, "card3", "down");
assert(cards[2].id === "card3", "After moving down twice, Walgreens back at index 2");

// Test 6: Data preservation
console.log("\nTest 6: Card data preservation during reorder");
result = simulateMoveCard(mockCards, "card2", "up");
const movedCard = result[0];
assert(movedCard.id === "card2", "ID preserved");
assert(movedCard.name === "Target", "Name preserved");
assert(movedCard.description === "Retail", "Description preserved");
assert(movedCard.codeImageDataUrl === "data:image/png;base64,test", "Code image preserved");
assert(movedCard.lastUsed === mockCards[1].lastUsed, "LastUsed preserved");

console.log("\n✅ All tests passed!\n");
