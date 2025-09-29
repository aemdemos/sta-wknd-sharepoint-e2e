/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: match labels to panels by order
  const rows = [];
  const headerRow = ['Tabs (tabs16)'];
  rows.push(headerRow);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // For content: grab all direct children of the tabpanel (skip aria-hidden panels)
    // Defensive: filter out empty text nodes
    const contentNodes = Array.from(panel.childNodes).filter(n => {
      if (n.nodeType === Node.ELEMENT_NODE) return true;
      if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) return true;
      return false;
    });
    // If only one element, use it directly, else use array
    let content;
    if (contentNodes.length === 1) {
      content = contentNodes[0];
    } else {
      content = contentNodes;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block
  tabsRoot.replaceWith(block);
}
