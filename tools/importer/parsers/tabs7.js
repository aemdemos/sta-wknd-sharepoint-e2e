/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the given element
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tablist (the tabs' labels)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Find all tabpanel elements (tab content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the table: header, then one row per tab
  const headerRow = ['Tabs (tabs7)'];
  const cells = [headerRow];

  tabLabels.forEach((tabLabel) => {
    // Extract label text
    const label = tabLabel.textContent.trim();
    // Find tabpanel for this tab
    const ariaControls = tabLabel.getAttribute('aria-controls');
    let panel = null;
    if (ariaControls) {
      panel = tabsBlock.querySelector(`#${ariaControls}`);
    }
    // Fallback: match by index
    if (!panel) {
      const idx = tabLabels.indexOf(tabLabel);
      panel = tabPanels[idx];
    }
    let contentElem = null;
    if (panel) {
      // Use the panel as-is, not cloning or wrapping
      contentElem = panel;
    } else {
      // fallback: empty div
      contentElem = document.createElement('div');
    }
    cells.push([label, contentElem]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace tabs block with the table
  tabsBlock.replaceWith(table);
}
