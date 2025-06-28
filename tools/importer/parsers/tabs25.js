/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs container block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (tab list is a single row of <li>s)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tabpanel containers, which directly hold each tab's content
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure labels and panels counts match
  // If not, fallback on minimal row creation

  // Header row: block name as required (match spec exactly)
  const headerRow = ['Tabs (tabs25)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i += 1) {
    const labelEl = tabLabels[i];
    const label = labelEl ? labelEl.textContent.trim() : '';

    // Defensive: if no corresponding panel, create an empty div
    let panel = tabPanels[i];
    if (!panel) {
      panel = document.createElement('div');
    }
    // Remove aria-hidden if present so content is visible in downstream
    panel.removeAttribute('aria-hidden');
    // Reference the original panel DIV (do not clone or create anew)
    rows.push([label, panel]);
  }

  // Create the block table with the provided helper
  const table = WebImporter.DOMUtils.createTable(rows, document);
  
  // Replace the tabs block with the structured table
  tabsBlock.replaceWith(table);
}
