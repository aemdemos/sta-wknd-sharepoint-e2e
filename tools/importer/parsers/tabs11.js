/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li elements in the tablist)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    tabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: ensure we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build the table rows
  const headerRow = ['Tabs (tabs11)'];
  const rows = [headerRow];

  // For each tab, get label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Find the corresponding tabpanel by aria-controls/id
    const tabId = label.getAttribute('aria-controls');
    const panel = tabs.querySelector(`#${tabId}`);
    if (!panel) continue;

    // Defensive: find the main content inside the tab panel
    // Usually a .contentfragment or similar
    let content = null;
    // Try to find a contentfragment or just use the panel's children
    const cf = panel.querySelector('.contentfragment, article, .cmp-contentfragment');
    if (cf) {
      // Use the actual DOM node from the document, not a clone
      content = cf;
    } else {
      // fallback: use all children of the panel (as a fragment)
      content = document.createElement('div');
      Array.from(panel.childNodes).forEach((n) => content.appendChild(n.cloneNode(true)));
    }
    rows.push([
      label.textContent.trim(),
      content
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the block table
  tabs.replaceWith(block);
}
