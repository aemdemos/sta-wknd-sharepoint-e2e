/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels from tablist
  const tabLabelEls = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all tab panels (in order)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the header row - EXACT header from spec
  const headerRow = ['Tabs (tabs24)'];

  // Compose the rows for the table: [label, content]
  const rows = [];
  for (let i = 0; i < tabLabelEls.length; i++) {
    const labelText = tabLabelEls[i].textContent.trim();
    // Find the corresponding tab panel for this label
    let panel = null;
    // Use aria-controls to match
    const ariaControls = tabLabelEls[i].getAttribute('aria-controls');
    if (ariaControls) {
      panel = tabs.querySelector('#' + ariaControls);
    }
    if (!panel) {
      // fallback to index order
      panel = tabPanels[i];
    }
    // For the tab content: reference the main contentfragment/article if present, else the full panel
    let tabContent = null;
    const cf = panel ? panel.querySelector('article.cmp-contentfragment') : null;
    tabContent = cf ? cf : panel;
    // Defensive: If even panel is missing, use an empty div
    if (!tabContent) {
      tabContent = document.createElement('div');
    }
    rows.push([labelText, tabContent]);
  }

  // Compose table rows
  const cells = [headerRow, ...rows];
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
