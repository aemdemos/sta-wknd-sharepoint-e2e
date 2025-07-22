/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get the tab panels (tab content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  
  // Only pair up as many panels as there are labels (or vice versa)
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Prepare the rows for the block table
  const rows = [];
  // Header row as in the example
  rows.push(['Tabs (tabs7)']);

  // Each tab: [Label, Content]
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // For tab content, include all direct children
    // If there's only one main child (like <article>), use that, else all children
    let tabContent;
    if (panel.children.length === 1) {
      tabContent = panel.children[0];
    } else {
      // Collect all non-empty nodes (remove whitespace text nodes)
      tabContent = Array.from(panel.childNodes).filter(n => {
        if (n.nodeType === Node.ELEMENT_NODE) return true;
        if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) return true;
        return false;
      });
    }
    rows.push([label, tabContent]);
  }

  // Create and replace with the block table
  const tableBlock = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(tableBlock);
}
