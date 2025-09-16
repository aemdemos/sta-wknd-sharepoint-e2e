/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get all tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only process if labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as per requirements
  rows.push(['Tabs (tabs37)']);

  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label text
    const label = tabLabels[i].textContent.trim();

    // Tab content: grab the panel's content (excluding the panel wrapper)
    // We'll use the children of the tabpanel div, or the whole panel if needed
    const panel = tabPanels[i];
    // Defensive: skip empty panels
    if (!panel) continue;
    // If the panel has only one child, use that, else use all children
    let content;
    if (panel.children.length === 1) {
      content = panel.children[0];
    } else {
      content = Array.from(panel.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
    }
    rows.push([
      label,
      content,
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(table);
}
