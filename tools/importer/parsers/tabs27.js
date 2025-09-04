/* global WebImporter */
export default function parse(element, { document }) {
  // Only process tab blocks
  if (!element.classList.contains('tabs')) return;

  // Block header as per spec
  const headerRow = ['Tabs (tabs27)'];
  const rows = [headerRow];

  // Find the tabs container
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: Find the main content inside the tab panel
    // Usually a .contentfragment or similar
    let tabContent = null;
    tabContent = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;

    // Clone the tabContent to avoid moving it out of the DOM
    let tabContentClone = tabContent.cloneNode(true);

    // Place the label and content in the row
    rows.push([label, tabContentClone]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
