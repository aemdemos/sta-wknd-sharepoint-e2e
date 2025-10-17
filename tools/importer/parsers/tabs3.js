/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Extract tab labels in order
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(tab => tab.textContent.trim());

  // Extract tab panels in order
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build table rows
  const rows = [];
  // CRITICAL: Use the exact block header
  rows.push(['Tabs (tabs3)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Gather all direct children of the tabpanel for content
    const tabContent = Array.from(panel.childNodes).filter(node => {
      // Only include element nodes or meaningful text nodes
      return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
    });

    // If no content, fallback to empty string
    rows.push([label, tabContent.length ? tabContent : '']);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
