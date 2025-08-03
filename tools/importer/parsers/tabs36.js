/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the input element
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Gather all tab labels in the order they appear
  const tablist = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Gather all tabpanels (content)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('div[role="tabpanel"]'));

  // Build the block table rows
  const cells = [
    ['Tabs (tabs36)']
  ];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Defensive: handle case of fewer panels than labels
    const panel = tabPanels[i];
    if (!panel) {
      cells.push([label, '']);
      continue;
    }

    // Find the main content inside the tabpanel
    // Usually a .contentfragment, but if not, fall back to panel content itself
    let tabContentElem = panel.querySelector('.contentfragment');
    if (!tabContentElem) {
      // fallback
      tabContentElem = panel;
    }
    cells.push([label, tabContentElem]);
  }

  // Create the block table with the required structure
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element in the DOM
  element.replaceWith(block);
}
