/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only run if element is a container with the expected structure
  if (!element || !document) return;

  // Helper to trim and clean text
  function cleanText(str) {
    return str ? str.replace(/\s+/g, ' ').trim() : '';
  }

  // --- 1. Table Header ---
  const headerRow = ['Table (striped, bordered, tableStripedBordered37)'];

  // --- 2. Table Data Rows ---
  // Find the left column: contentfragment with details
  let leftCol;
  const leftColCandidate = element.querySelector('.cmp-contentfragment--gastronomic-marais-tour');
  if (leftColCandidate) {
    // Compose a vertical list of dt/dd pairs
    const dl = leftColCandidate.querySelector('dl.cmp-contentfragment__elements');
    if (dl) {
      // Get all pairs
      const pairs = Array.from(dl.children).map(div => {
        const dt = div.querySelector('dt');
        const dd = div.querySelector('dd');
        if (dt && dd) {
          // Compose a div for each row
          const rowDiv = document.createElement('div');
          rowDiv.appendChild(dt);
          rowDiv.appendChild(dd);
          return rowDiv;
        }
        return null;
      }).filter(Boolean);
      // Add the title above
      const title = leftColCandidate.querySelector('h3.cmp-contentfragment__title');
      leftCol = document.createElement('div');
      if (title) leftCol.appendChild(title);
      pairs.forEach(pair => leftCol.appendChild(pair));
    }
  }

  // Find the right column: tabs block
  let rightCol;
  const tabs = element.querySelector('.cmp-tabs');
  if (tabs) {
    // Compose a div for the tabs
    rightCol = document.createElement('div');
    // Add tab list
    const tabList = tabs.querySelector('.cmp-tabs__tablist');
    if (tabList) {
      rightCol.appendChild(tabList);
    }
    // Add all tabpanels (Overview, Itinerary, What to Bring)
    const tabPanels = tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');
    tabPanels.forEach(panel => {
      // Defensive: Only add if it has contentfragment
      const cf = panel.querySelector('.cmp-contentfragment');
      if (cf) {
        rightCol.appendChild(cf);
      }
    });
  }

  // Compose the main table row
  const mainRow = [
    [leftCol, rightCol].filter(Boolean) // Only include columns that exist
  ];

  // --- 3. Create Table ---
  const cells = [headerRow, ...mainRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // --- 4. Replace original element ---
  element.replaceWith(block);
}
