/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by class
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels from the immediate children of the tablist
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = tablist ? Array.from(tablist.children).map(tab => tab.textContent.trim()) : [];

  // Extract tab panels in the order they appear in the DOM
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the rows for the block table
  const rows = [];
  // Header row must match block name in example
  rows.push(['Tabs (tabs12)']);

  // For each tab, create a row with label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] || '';
    const panel = tabPanels[i];
    let contentElem = undefined;
    if (panel) {
      // We want all the content of the panel as a single cell.
      // Use the contentfragment/article if present, else use the panel div directly
      const contentFragment = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
      if (contentFragment) {
        contentElem = contentFragment;
      } else {
        // fallback: reference the panel element itself, not clone
        contentElem = panel;
      }
    } else {
      // Edge case: no panel found for this label
      contentElem = document.createElement('div'); // empty cell
    }
    rows.push([label, contentElem]);
  }

  // Create and replace the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
