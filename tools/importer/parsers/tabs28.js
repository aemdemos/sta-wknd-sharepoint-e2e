/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  // For each tab, add a row [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: get the main contentfragment/article inside the panel
    let tabContent = null;
    tabContent = panel.querySelector('article') || panel;
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsRoot.parentNode.replaceChild(block, tabsRoot);
}
