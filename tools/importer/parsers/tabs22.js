/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tab labels
  const tabLabels = Array.from(element.querySelectorAll('.cmp-tabs__tablist > li'));
  // Find the tab panels (in order)
  const tabPanels = Array.from(element.querySelectorAll('[role="tabpanel"]'));

  // Compose the header row as per block guidelines
  const headerRow = ['Tabs (tabs22)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent.trim() || '';
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Prefer the contentfragment/article if present
      const article = panel.querySelector('article');
      if (article) {
        // Exclude the h3 title (which is always the same)
        const children = Array.from(article.children).filter(el => el.tagName !== 'H3');
        if (children.length === 1) {
          contentCell = children[0];
        } else if (children.length > 1) {
          contentCell = children;
        } else {
          contentCell = '';
        }
      } else {
        // If no article, use all children of the panel
        const children = Array.from(panel.children);
        if (children.length === 1) {
          contentCell = children[0];
        } else if (children.length > 1) {
          contentCell = children;
        } else {
          contentCell = '';
        }
      }
    }
    rows.push([label, contentCell]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
