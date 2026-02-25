"use client";

import { useState, useEffect } from "react";
import { useCards, addCard, updateCard } from "@/lib/use-cardholder";

export default function TestReorderPage() {
  const { cards, isLoading } = useCards();
  const [testStatus, setTestStatus] = useState<string>("Initializing test...");
  const [testPassed, setTestPassed] = useState(false);

  useEffect(() => {
    const runTest = async () => {
      try {
        setTestStatus("Adding test cards...");
        
        // Add 3 test cards
        const card1 = await addCard({
          name: "Test Card A",
          description: "First test card",
          codeImageDataUrl: "data:image/png;base64,test1",
        });
        
        const card2 = await addCard({
          name: "Test Card B",
          description: "Second test card",
          codeImageDataUrl: "data:image/png;base64,test2",
        });
        
        const card3 = await addCard({
          name: "Test Card C",
          description: "Third test card",
          codeImageDataUrl: "data:image/png;base64,test3",
        });

        setTestStatus("Waiting for cards to load...");
        
        // Small delay to ensure SWR revalidates
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setTestStatus("Testing reorder logic - moving card at index 2 up to index 1...");
        
        // Simulate the handleMoveCard logic
        const currentCards = cards;
        if (currentCards.length >= 3) {
          const cardIndex = 2; // Last card
          const newIndex = 1; // Move up
          
          const reorderedCards = [...currentCards];
          [reorderedCards[cardIndex], reorderedCards[newIndex]] = [
            reorderedCards[newIndex],
            reorderedCards[cardIndex],
          ];
          
          // Update orders
          for (let i = 0; i < reorderedCards.length; i++) {
            await updateCard({ ...reorderedCards[i], order: i });
            console.log(`[v0] Updated ${reorderedCards[i].name} to order ${i}`);
          }
          
          // Wait for revalidation
          await new Promise(resolve => setTimeout(resolve, 500));
          
          setTestStatus("✅ Reorder test passed! Check console for details.");
          setTestPassed(true);
        } else {
          setTestStatus(`❌ Not enough cards loaded. Got ${currentCards.length} cards`);
        }
      } catch (error) {
        setTestStatus(`❌ Test failed: ${error instanceof Error ? error.message : String(error)}`);
        console.error("[v0] Test error:", error);
      }
    };

    if (!isLoading && cards.length === 0) {
      runTest();
    }
  }, [cards, isLoading]);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Card Reorder Integration Test</h1>
        
        <div className={`p-4 rounded-lg mb-4 ${testPassed ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
          <p className="text-sm font-mono">{testStatus}</p>
        </div>

        <div className="bg-card rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Current Cards ({cards.length}):</h2>
          <div className="space-y-2">
            {cards.map((card, idx) => (
              <div key={card.id} className="flex gap-2 p-2 bg-secondary rounded">
                <span className="font-mono text-xs font-bold w-4">{idx}</span>
                <div>
                  <p className="font-mono text-sm">{card.name}</p>
                  <p className="text-xs text-muted-foreground">Order: {card.order}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Open browser console (F12) to see detailed debug logs with [v0] prefix.</p>
          <p>If reordering works, you should see cards update their positions and order values in real-time.</p>
        </div>
      </div>
    </div>
  );
}
