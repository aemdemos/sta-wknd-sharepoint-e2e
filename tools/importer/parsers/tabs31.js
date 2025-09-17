/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block (should be the element passed in)
  const tabsRoot = element;
  if (!tabsRoot) return;

  // Find tab labels (li elements inside ol[role=tablist])
  const tabList = tabsRoot.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Find tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsRoot.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) {
    // If mismatch, only use as many as both exist
    const minLen = Math.min(tabLabels.length, tabPanels.length);
    tabLabels.length = minLen;
    tabPanels.length = minLen;
  }

  // Table header row
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel, i) => {
    // Defensive: Get tab panel
    const panel = tabPanels[i];
    if (!panel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: grab all direct children of panel
    // Defensive: Some panels wrap content in a single div.contentfragment
    let tabContent;
    if (panel.children.length === 1 && panel.firstElementChild.classList.contains('contentfragment')) {
      tabContent = panel.firstElementChild;
    } else {
      // Otherwise, use the panel itself
      tabContent = panel;
    }

    rows.push([labelText, tabContent]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsRoot.replaceWith(block);
}
