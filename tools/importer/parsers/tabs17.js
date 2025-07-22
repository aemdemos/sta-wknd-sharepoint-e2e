/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the provided root element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get all tab panels in order of appearance
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the table header row
  const rows = [['Tabs (tabs17)']];

  // Defensive: ensure labels and content match by index
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let labelCell = document.createElement('span');
    labelCell.textContent = label.textContent.trim();

    // Find tab panel: match by aria-controls/id if possible
    let panel = null;
    const panelId = label.getAttribute('aria-controls');
    if (panelId) {
      panel = tabsRoot.querySelector(`#${panelId}`);
    }
    // If not found, fallback to index
    if (!panel && tabPanels[i]) panel = tabPanels[i];
    if (!panel) {
      rows.push([labelCell, '']);
      continue;
    }
    // Try to extract the main content from the tab panel
    // Prefer any .contentfragment/article inside, otherwise use whole panel.
    let contentCell = null;
    let mainContent = panel.querySelector('article, .cmp-contentfragment, .cmp-contentfragment__elements');
    if (mainContent) {
      contentCell = mainContent;
    } else {
      // If there is only one element inside, use that; else use the panel itself
      const onlyChild = panel.children.length === 1 ? panel.firstElementChild : null;
      contentCell = onlyChild || panel;
    }
    rows.push([
      labelCell,
      contentCell
    ]);
  }

  // Create the table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
