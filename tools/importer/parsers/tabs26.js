/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab label elements (li inside cmp-tabs__tablist)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')
  );
  // Get all tab panel elements (in DOM order)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Prepare header row for the tabs block
  const cells = [['Tabs (tabs26)']];

  // Each subsequent row: [tab label text, tab panel content]
  for (let i = 0; i < tabLabels.length; i++) {
    const tabLabel = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive in case of mismatch
    const labelText = tabLabel ? tabLabel.textContent.trim() : '';
    // Always include the entire existing tab panel element for resilience
    // (referenced, not cloned)
    if (panel) {
      cells.push([labelText, panel]);
    } else {
      cells.push([labelText, '']);
    }
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
