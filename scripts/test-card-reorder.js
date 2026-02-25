#!/usr/bin/env node

/**
 * Card Reorder Tests
 *
 * Tests:
 * 1. Swap algorithm correctness
 * 2. Order field assignment after swap
 * 3. Sorted-list-based reorder (the actual bug fix)
 * 4. Boundary checks (first up, last down)
 * 5. Data preservation during reorder
 * 6. Multi-step sequential moves
 * 7. DB batch-write simulation (order fields)
 */

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (!cond) {
    console.error(`  FAIL: ${msg}`);
    failed++;
  } else {
    console.log(`  PASS: ${msg}`);
    passed++;
  }
}

function makeCards() {
  return [
    { id: "a", name: "Alpha", order: 0, description: "", codeImageDataUrl: "d:a", lastUsed: 300, createdAt: 100, orderLocked: false },
    { id: "b", name: "Bravo", order: 1, description: "", codeImageDataUrl: "d:b", lastUsed: 200, createdAt: 200, orderLocked: false },
    { id: "c", name: "Charlie", order: 2, description: "", codeImageDataUrl: "d:c", lastUsed: 100, createdAt: 300, orderLocked: false },
  ];
}

// This mirrors the FIXED handleMoveCard logic:
// 1. Sort by order
// 2. Find card by id in the sorted list
// 3. Swap with adjacent
// 4. Re-assign order = index
function reorder(cards, cardId, direction) {
  const sorted = [...cards].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const from = sorted.findIndex((c) => c.id === cardId);
  if (from === -1) return null;
  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= sorted.length) return null;
  [sorted[from], sorted[to]] = [sorted[to], sorted[from]];
  return sorted.map((c, i) => ({ ...c, order: i }));
}

// ---- Test 1: Move middle card up ----
console.log("\nTest 1: Move middle card up");
{
  const result = reorder(makeCards(), "b", "up");
  assert(result !== null, "result is non-null");
  assert(result[0].id === "b", "Bravo now at index 0");
  assert(result[1].id === "a", "Alpha now at index 1");
  assert(result[2].id === "c", "Charlie stays at index 2");
  assert(result[0].order === 0, "order[0] === 0");
  assert(result[1].order === 1, "order[1] === 1");
  assert(result[2].order === 2, "order[2] === 2");
}

// ---- Test 2: Move first card down ----
console.log("\nTest 2: Move first card down");
{
  const result = reorder(makeCards(), "a", "down");
  assert(result !== null, "result is non-null");
  assert(result[0].id === "b", "Bravo now at index 0");
  assert(result[1].id === "a", "Alpha now at index 1");
  assert(result[2].id === "c", "Charlie stays at index 2");
}

// ---- Test 3: Move last card up ----
console.log("\nTest 3: Move last card up");
{
  const result = reorder(makeCards(), "c", "up");
  assert(result !== null, "result is non-null");
  assert(result[1].id === "c", "Charlie now at index 1");
  assert(result[2].id === "b", "Bravo now at index 2");
}

// ---- Test 4: Boundary - first card up returns null ----
console.log("\nTest 4: Cannot move first card up");
{
  const result = reorder(makeCards(), "a", "up");
  assert(result === null, "returns null for first-card-up");
}

// ---- Test 5: Boundary - last card down returns null ----
console.log("\nTest 5: Cannot move last card down");
{
  const result = reorder(makeCards(), "c", "down");
  assert(result === null, "returns null for last-card-down");
}

// ---- Test 6: Multi-step sequential moves ----
console.log("\nTest 6: Sequential moves (Charlie to top)");
{
  let cards = makeCards();
  cards = reorder(cards, "c", "up"); // c: 2->1
  assert(cards[0].id === "a" && cards[1].id === "c" && cards[2].id === "b", "After 1st up: A,C,B");
  cards = reorder(cards, "c", "up"); // c: 1->0
  assert(cards[0].id === "c" && cards[1].id === "a" && cards[2].id === "b", "After 2nd up: C,A,B");
  // Move back down twice
  cards = reorder(cards, "c", "down");
  cards = reorder(cards, "c", "down");
  assert(cards[0].id === "a" && cards[1].id === "b" && cards[2].id === "c", "Back to original: A,B,C");
}

// ---- Test 7: Order values are always 0..n-1 after any reorder ----
console.log("\nTest 7: Order values are sequential 0..n-1");
{
  let cards = makeCards();
  cards = reorder(cards, "c", "up");
  cards = reorder(cards, "a", "down");
  for (let i = 0; i < cards.length; i++) {
    assert(cards[i].order === i, `cards[${i}].order === ${i} (got ${cards[i].order})`);
  }
}

// ---- Test 8: Data preservation ----
console.log("\nTest 8: Card data is preserved during reorder");
{
  const result = reorder(makeCards(), "b", "up");
  const moved = result[0]; // was bravo
  assert(moved.id === "b", "id preserved");
  assert(moved.name === "Bravo", "name preserved");
  assert(moved.codeImageDataUrl === "d:b", "codeImageDataUrl preserved");
  assert(moved.lastUsed === 200, "lastUsed preserved");
  assert(moved.createdAt === 200, "createdAt preserved");
}

// ---- Test 9: Cards with no initial order field get sorted stably ----
console.log("\nTest 9: Cards with undefined order default to 0");
{
  const noOrderCards = [
    { id: "x", name: "X", description: "", codeImageDataUrl: "", lastUsed: 0, createdAt: 0, orderLocked: false },
    { id: "y", name: "Y", description: "", codeImageDataUrl: "", lastUsed: 0, createdAt: 0, orderLocked: false },
  ];
  const result = reorder(noOrderCards, "y", "up");
  assert(result !== null, "can reorder cards without order field");
  assert(result[0].id === "y", "Y moved to top");
  assert(result[0].order === 0, "order 0 assigned");
  assert(result[1].order === 1, "order 1 assigned");
}

// ---- Test 10: Simulated DB batch write ----
console.log("\nTest 10: Batch write produces correct DB state");
{
  const fakeDb = {};
  const cards = makeCards();
  const result = reorder(cards, "b", "up");
  // Simulate saveCardsInBatch
  for (const card of result) {
    fakeDb[card.id] = { ...card };
  }
  // Read back sorted
  const fromDb = Object.values(fakeDb).sort((a, b) => a.order - b.order);
  assert(fromDb[0].id === "b", "DB: Bravo at order 0");
  assert(fromDb[1].id === "a", "DB: Alpha at order 1");
  assert(fromDb[2].id === "c", "DB: Charlie at order 2");
}

// ---- Summary ----
console.log(`\n${"=".repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log("=".repeat(40));

if (failed > 0) {
  process.exit(1);
}
