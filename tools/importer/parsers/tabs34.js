/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate on the tabs block
  if (!element || !element.classList.contains('tabs')) return;

  // Find the main tabs container
  const tabsCmp = element.querySelector('.cmp-tabs');
  if (!tabsCmp) return;

  // Get tab labels (in order)
  const tabLabels = Array.from(
    tabsCmp.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Get tab panels (in order)
  const tabPanels = Array.from(
    tabsCmp.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Ensure we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: header, then one row per tab
  const rows = [];
  // Always use the required block name as header
  rows.push(['Tabs (tabs34)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Use the full tabpanel content for the cell
    const tabContent = Array.from(panel.childNodes).filter(node => {
      // Remove empty text nodes
      return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
    });
    rows.push([
      label,
      tabContent.length > 0 ? tabContent : panel
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
