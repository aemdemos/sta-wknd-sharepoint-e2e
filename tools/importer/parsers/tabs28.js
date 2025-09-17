/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is a tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure the number of labels matches the number of panels
  if (tabLabels.length !== tabPanels.length) return;

  // Table header
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const labelText = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Clone the tabpanel content to avoid moving it in the DOM
    const panelClone = panel.cloneNode(true);
    rows.push([labelText, panelClone]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsRoot's parent (.tabs.panelcontainer) with the block
  element.replaceWith(block);
}
