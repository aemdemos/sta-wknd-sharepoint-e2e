/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li') : []);
  // Get all tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Header row must match the block name exactly
  const headerRow = ['Tabs (tabs7)'];

  // Build tab rows
  const rows = tabLabels.map((tab, i) => {
    // Use the label text from the tab <li>
    const label = tab.textContent.trim();
    // Corresponding tabpanel
    const panel = tabPanels[i];
    let tabContent = '';
    if (panel) {
      // Use contentfragment if present, else all children
      const contentFragment = panel.querySelector('.contentfragment');
      if (contentFragment) {
        tabContent = contentFragment;
      } else {
        // If no contentfragment, use all children (not just panel itself as that adds unnecessary wrappers)
        tabContent = Array.from(panel.childNodes).filter(node => {
          // Only include non-empty elements (skip empty text nodes)
          if (node.nodeType === Node.ELEMENT_NODE) return true;
          if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
          return false;
        });
        // If only one element, use it directly
        if (tabContent.length === 1) tabContent = tabContent[0];
      }
    }
    return [label, tabContent];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
