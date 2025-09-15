/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements in tablist)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // If no tabs or panels, do nothing
  if (!tabLabels.length || !tabPanels.length) return;

  // Build table rows: first row is header
  const rows = [ ['Tabs (tabs12)'] ];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!panel) continue;

    // Use all child nodes of the panel as the content cell
    const contentNodes = Array.from(panel.childNodes).filter(
      node => !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim())
    );
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else {
      contentCell = contentNodes;
    }
    rows.push([label, contentCell]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsRoot.replaceWith(table);
}
