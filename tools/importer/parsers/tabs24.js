/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (order matters)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li')).map(li => li.textContent.trim()) : [];

  // Get all tab panels, their order should match the tab labels
  const tabPanels = tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');
  if (!tabLabels.length || !tabPanels.length) return;

  // Build rows: 
  // 1. Header row: block name (single cell)
  // 2. Labels row: one cell per tab label
  // 3+. One row per tab, with the content in the matching cell, other cells empty
  const rows = [];
  rows.push(['Tabs (tabs24)']);
  rows.push(tabLabels);

  for (let i = 0; i < tabLabels.length; i++) {
    const row = new Array(tabLabels.length).fill('');
    // Defensive: only fill content if panel exists
    const panel = tabPanels[i];
    let mainContent = null;
    if (panel) {
      // Prefer <article>, fallback to .cmp-contentfragment, then firstElementChild, then panel
      mainContent = panel.querySelector('article')
        || panel.querySelector('.cmp-contentfragment')
        || (panel.children.length === 1 ? panel.firstElementChild : null)
        || panel;
    }
    row[i] = mainContent;
    rows.push(row);
  }

  // Create the table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
