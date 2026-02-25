# Troubleshooting Card Reordering

## Checklist for Live Updates Not Working

### 1. Browser Console Check
- **Action:** Open DevTools (F12), go to Console tab
- **Expected:** After pressing arrow button, you should see logs like:
  ```
  [v0] handleMoveCard called for card: abc123 direction: up index: 1
  [v0] updateCard - calling mutate for card: abc123
  [v0] Cards updated in SettingsScreen: [...]
  ```
- **If missing:** Check browser console for errors. They'll appear in red.

### 2. Order Lock Enabled
- **Action:** Verify the "Lock Order" toggle in settings is ON
- **Expected:** Arrow buttons appear to the left of edit/delete buttons
- **If not visible:** Click the lock icon to enable order locking

### 3. Multiple Cards Required
- **Action:** Ensure at least 2 cards exist
- **Expected:** Arrow buttons should work on middle and lower cards
- **If only 1 card:** Create additional cards first

### 4. Browser Storage Check
- **Action:** Open DevTools > Application > IndexedDB > cardholder > cards
- **Expected:** See all your cards with an `order` field (0, 1, 2, etc.)
- **If `order` is undefined:** Delete old cards and create new ones

### 5. Network Tab Check
- **Action:** Open DevTools > Network tab, then press arrow button
- **Expected:** No 404 errors, service worker cached responses
- **If you see errors:** Hard refresh (Ctrl+Shift+R) to clear cache

## Common Issues & Solutions

### Issue: Arrow buttons don't appear
**Solution:** 
1. Click the lock/unlock icon to toggle order locking
2. Refresh the page
3. Try a different browser

### Issue: Reorder works but changes don't persist
**Solution:**
1. Open DevTools > Application > Storage
2. Delete all IndexedDB data
3. Refresh page
4. Create cards again
5. Try reordering

### Issue: Buttons are slow to respond
**Solution:**
1. This is usually normal on first reorder (SWR initializing)
2. Subsequent reorders should be instant
3. If persistent, check browser performance (DevTools > Performance tab)

### Issue: Arrow buttons are disabled/grayed out
**Solution:**
- This is normal when card is at first (up button) or last position (down button)
- Try moving a middle card instead
- Disabled buttons appear faded (opacity-30)

## Debug Mode

To enable more detailed debugging:

1. Edit `/lib/use-cardholder.ts`
2. Find any line with `console.log("[v0]"`
3. Keep them enabled (they already are)
4. Open DevTools Console to see all operations

### What Each Log Means:

| Log | Meaning |
|-----|---------|
| `handleMoveCard called` | Arrow button was pressed |
| `updateCard - calling mutate` | Card order is being saved to DB |
| `Cards updated in SettingsScreen` | UI should refresh with new order |
| `Invalid newIndex` | Card is at first/last position |

## Testing

### Quick Test
1. Go to `/test-reorder` page
2. Wait for test to complete
3. Check if "✅ Reorder test passed" appears

### Manual Test
1. Add 3 cards
2. Enable order lock in settings
3. Press up/down arrow buttons
4. Verify cards move positions
5. Close and reopen settings - changes should persist

## Browser Compatibility

✅ **Tested & Working:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

❌ **Known Issues:**
- Safari Private Browsing: IndexedDB limitations may affect persistence

## Still Not Working?

1. **Clear everything:**
   - DevTools > Application > Storage > Clear site data
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

2. **Check console errors:**
   - Look for red error messages
   - Search for "IndexedDB" or "Service Worker" errors

3. **Test in another browser:**
   - Chrome if using Firefox, etc.
   - Use browser incognito/private mode to test clean state

4. **Check logs in test page:**
   - Navigate to `/test-reorder`
   - Read the status message and console logs

## Performance Tips

- If you have 50+ cards, reordering might feel slower
- Solution: Consider organizing cards into groups or using the all-cards view
- Optional: Increase `dedupingInterval` to 500ms in `lib/use-cardholder.ts` for fewer database reads

## Related Files

- Core logic: `/lib/use-cardholder.ts`
- Settings UI: `/components/settings-screen.tsx`
- Tests: `/scripts/test-card-reorder.js`
- Debug: `/app/test-reorder/page.tsx`

