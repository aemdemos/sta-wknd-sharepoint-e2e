/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find tab labels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Find tab panels in order
  const tabPanels = [];
  tabs.querySelectorAll('.cmp-tabs__tabpanel').forEach(panel => {
    tabPanels.push(panel);
  });

  // Build the header row (block name EXACTLY as in the instructions)
  const rows = [['Tabs (tabs38)']];

  // For each tab, create a row: [label, tab content (existing element!)].
  // Defensive: only as many rows as there are tabLabels
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let contentElem = null;
    // Use the tabpanel's content. Prefer the first contentfragment/article if exists, else panel content
    const panel = tabPanels[i];
    if (panel) {
      // Prefer the main content fragment or first meaningful child
      // Remove empty AEM grid wrappers
      let mainContent = null;
      // Sometimes the contentfragment is wrapped in a div, sometimes direct
      // Find the first <article> or first non-empty child
      mainContent = panel.querySelector('article') || null;
      if (!mainContent) {
        // fallback: the first child that isn't just whitespace
        for (let child of panel.children) {
          if (child.textContent.trim() || child.children.length > 0) {
            mainContent = child;
            break;
          }
        }
      }
      // As a last resort, the panel itself
      if (!mainContent) mainContent = panel;
      contentElem = mainContent;
    } else {
      // If missing panel, put an empty text node
      contentElem = document.createTextNode('');
    }
    rows.push([label, contentElem]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the new block table
  tabs.replaceWith(table);
}
