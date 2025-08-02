/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels in order
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim()).filter(Boolean);

  // Extract tab panels in order
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // If mismatch, do not continue
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows: header and one row per tab (label, content)
  const rows = [];
  // Header row: exactly one cell (block name)
  rows.push(['Tabs (tabs18)']);
  // Data rows: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Get all non-empty child nodes as tab content
    const contentNodes = Array.from(panel.childNodes).filter(
      node => !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '')
    );
    // If empty, fallback to panel itself
    const content = contentNodes.length ? contentNodes : [panel];
    rows.push([label, content]);
  }

  // Create block table and replace the tabs block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
