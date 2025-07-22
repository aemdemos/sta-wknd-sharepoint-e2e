/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in this element
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get the tab labels (in order) and tab panels (same order)
  const tabLabels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table header row must match the block name exactly
  const rows = [['Tabs (tabs6)']];

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    if (!label || !panel) continue;

    // Find the meaningful tab panel content
    // Prefer the first .contentfragment, but if not available, use all children
    let contentElem = null;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      contentElem = contentFragment;
    } else {
      // Get all child nodes, filter out empty text nodes
      const childNodes = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.ELEMENT_NODE) return true;
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return true;
        return false;
      });
      if (childNodes.length === 1) {
        contentElem = childNodes[0];
      } else if (childNodes.length > 1) {
        // Reference all child nodes as an array, not cloning
        contentElem = childNodes;
      } else {
        // Panel is empty, fallback to empty string
        contentElem = '';
      }
    }
    rows.push([label, contentElem]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
