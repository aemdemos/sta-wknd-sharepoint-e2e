/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block (cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (li elements inside ol[role=tablist])
  const tabList = tabs.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabs.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs13)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    // Tab label text
    const label = labelEl.textContent.trim();

    // Tab content: reference the whole tabpanel content
    const panel = tabPanels[i];
    // Defensive: some tab panels wrap content in a single child div
    let contentEl = panel;
    // If the panel only has one child and it's a div.contentfragment, use that
    if (panel.children.length === 1 && panel.firstElementChild) {
      contentEl = panel.firstElementChild;
    }
    rows.push([label, contentEl]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs element with the block table
  tabs.replaceWith(block);
}
