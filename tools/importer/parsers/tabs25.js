/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container (cmp-tabs)
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get the <ol> tablist and all tab labels
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : []);

  // Get all tab panels, which are siblings in the structure
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));

  // Build a map of tabId to label text
  const labelMap = {};
  tabLabels.forEach(labelEl => {
    // Each tab has aria-controls="<tabId>-tabpanel"
    let controls = labelEl.getAttribute('aria-controls');
    if (controls && controls.endsWith('-tabpanel')) {
      const tabId = controls.slice(0, controls.length - '-tabpanel'.length);
      labelMap[tabId] = labelEl.textContent.trim();
    }
  });

  // Prepare the rows for the block table
  const rows = [];
  // Block header row - must match exactly
  rows.push(['Tabs (tabs25)']);

  // For each tab panel, pair its label and content
  tabPanels.forEach(panel => {
    // Each panel has id="<tabId>-tabpanel"
    let tabId = panel.id ? panel.id.slice(0, panel.id.length - '-tabpanel'.length) : '';
    const label = labelMap[tabId] || '';
    // Content: reference the first .contentfragment inside the panel if present, else the panel itself
    let content = panel.querySelector('.contentfragment') || panel;
    rows.push([label, content]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the entire tabs container with the table
  tabsContainer.replaceWith(table);
}
