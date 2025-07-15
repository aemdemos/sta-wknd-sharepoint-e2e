/* global WebImporter */
export default function parse(element, { document }) {
  // The provided HTML is not a Cards (cards2) block, so do not produce a Cards table.
  // Do nothing; do not create or replace with a Cards (cards2) table block.
  // This prevents incorrect output and matches the cards2 requirement exactly.
  return;
}
