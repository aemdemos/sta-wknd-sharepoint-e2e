/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block in the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tabEl => {
      tabLabels.push(tabEl.textContent.trim());
    });
  }

  // Get all tab panels in order
  const tabPanels = tabsBlock.querySelectorAll('.cmp-tabs__tabpanel');

  // Prepare rows for the table: first row is header
  const rows = [];
  rows.push(["Tabs (tabs13)"]);

  // For each tab, add a row [label, content]
  tabPanels.forEach((panel, idx) => {
    // Get the tab label for this panel by index
    const label = tabLabels[idx] || `Tab ${idx+1}`;
    // The displayed content is the first significant element inside the tabpanel (may be an article/contentfragment)
    // To be robust, if there's only 1 non-empty element, use that; otherwise, collect all non-empty children
    let contentElems = [];
    panel.childNodes.forEach(node => {
      // Only use element nodes with non-empty HTML
      if (node.nodeType === 1 && node.innerHTML.trim()) {
        contentElems.push(node);
      }
    });
    // If nothing found, use panel itself as fallback
    if (contentElems.length === 0) {
      contentElems = Array.from(panel.children).length > 0 ? Array.from(panel.children) : [panel];
    }
    const content = contentElems.length === 1 ? contentElems[0] : contentElems;
    rows.push([label, content]);
  });

  // Create the block table and replace the original tabs block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
