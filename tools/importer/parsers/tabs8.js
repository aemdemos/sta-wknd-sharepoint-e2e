/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container in the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels
  const tabLabelNodes = tabs.querySelectorAll('.cmp-tabs__tablist [role="tab"]');
  const tabLabels = Array.from(tabLabelNodes).map(tab => tab.textContent.trim());

  // Extract tab content panels
  const tabPanelNodes = tabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Defensive: ensure equal number of labels and panels
  const numTabs = Math.min(tabLabels.length, tabPanelNodes.length);

  // Build table rows: first header, then each tab label/content pair
  const rows = [
    ['Tabs (tabs8)']
  ];

  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanelNodes[i];

    // Prefer main article if present
    let contentElem = panel.querySelector('article');
    if (!contentElem) {
      // Fall back to the entire panel
      contentElem = panel;
    }
    rows.push([
      label,
      contentElem
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the block table
  tabs.replaceWith(block);
}
