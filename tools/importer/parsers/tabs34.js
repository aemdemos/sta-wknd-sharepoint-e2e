/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get tab labels
  const tablist = tabsEl.querySelector('ol[role="tablist"]');
  const tabItems = tablist ? Array.from(tablist.querySelectorAll('li[role="tab"]')) : [];
  if (!tabItems.length) return;

  // Get all tab panels in order
  const panels = Array.from(tabsEl.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (!panels.length) return;

  // === Build cells array === //
  const cells = [];
  // 1. Header row
  cells.push(['Tabs (tabs34)']);

  // 2. First row: all tab labels, each as <strong> element
  const tabLabelsRow = tabItems.map(tab => {
    const strong = document.createElement('strong');
    strong.textContent = tab.textContent.trim();
    return strong;
  });
  cells.push(tabLabelsRow);

  // 3. Each tab panel as a row, content in correct column, rest blank
  // Rows: one per tab, columns: one per tab
  panels.forEach((panel, i) => {
    // Find the main content fragment/article inside the panel
    const article = panel.querySelector('article');
    let tabContent = null;
    if (article) {
      // Exclude title h3 if present
      const children = Array.from(article.children).filter(child => {
        return !(child.tagName === 'H3' && child.classList.contains('cmp-contentfragment__title'));
      });
      // If only one child and it's a div, reference it
      if (children.length === 1 && children[0].tagName === 'DIV') {
        tabContent = children[0];
      } else if (children.length > 0) {
        tabContent = children;
      } else {
        tabContent = article;
      }
    } else {
      // Fallback: panel itself
      tabContent = panel;
    }
    // Create a row with N columns (N = tab count), only fill i-th column
    const row = Array(tabItems.length).fill('');
    row[i] = tabContent;
    cells.push(row);
  });

  // Create and replace block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  tabsEl.replaceWith(blockTable);
}
