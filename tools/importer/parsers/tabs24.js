/* global WebImporter */
export default function parse(element, { document }) {
  // Only proceed if element is a tabs block
  if (!element || !element.classList.contains('tabs')) return;

  // Header row as required by block spec
  const headerRow = ['Tabs (tabs24)'];
  const rows = [headerRow];

  // Find the tabs container
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get all tab panels (divs with class cmp-tabs__tabpanel)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: If mismatch, bail
  if (tabLabels.length !== tabPanels.length) return;

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!panel) continue;
    // Collect all content nodes inside the tabpanel
    const contentNodes = Array.from(panel.childNodes).filter(n => {
      // Remove empty text nodes
      return !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim());
    });
    // If no content, skip
    if (!contentNodes.length) continue;
    rows.push([label, contentNodes]);
  }

  // If only header row, do not replace
  if (rows.length === 1) return;

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the new table
  element.replaceWith(table);
}
