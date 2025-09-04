/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Ensure labels and panels match
  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row as per requirement
  rows.push(['Tabs (tabs29)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // For content, use the entire tabpanel's content (excluding the tabpanel wrapper itself)
    // We'll collect all direct children of the tabpanel
    const contentNodes = Array.from(panel.childNodes).filter(node => {
      // Remove empty text nodes
      return node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== '';
    });

    // If only one element, use it directly; otherwise, use array
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else {
      contentCell = contentNodes;
    }

    rows.push([label, contentCell]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(table);
}
