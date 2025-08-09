/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs wrapper within the provided element
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels from the tablist
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []).map(tab => tab.textContent.trim());

  // Find all tab panels in order they appear
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Build table header row
  const headerRow = ['Tabs (tabs30)'];

  // Compose the rows: each tab label + its content
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let contentElement = '';
    const panel = tabPanels[i];
    if (panel) {
      // Prefer the article inside the tabpanel if present (captures all content for the tab)
      const article = panel.querySelector('article');
      if (article) {
        contentElement = article;
      } else {
        // If no article, use the tabpanel's direct children (excluding script/style)
        const children = Array.from(panel.childNodes).filter(
          node => (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') || node.nodeType === 3
        );
        if (children.length === 1) {
          contentElement = children[0];
        } else if (children.length > 1) {
          contentElement = children;
        } else {
          contentElement = '';
        }
      }
    }
    rows.push([label, contentElement]);
  }

  // Replace the original element with the new block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
