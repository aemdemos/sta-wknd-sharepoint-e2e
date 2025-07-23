/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .cmp-tabs element.
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels from the tablist
  const tabList = tabs.querySelector('ol.cmp-tabs__tablist');
  const tabEls = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];

  // Get all tabpanel containers (one per tab) in DOM order
  const tabPanels = Array.from(tabs.querySelectorAll('div[role="tabpanel"]'));

  // Table header as specified
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // For each tab, extract its label and content
  for (let i = 0; i < tabEls.length; i++) {
    const tabEl = tabEls[i];
    const label = tabEl ? tabEl.textContent.trim() : '';
    let content = null;
    const panel = tabPanels[i];
    if (panel) {
      // Try to reference a single meaningful child, use the article if present
      const article = panel.querySelector('article.cmp-contentfragment');
      if (article) {
        content = article;
      } else {
        // fallback: use the whole tabpanel div
        content = panel;
      }
    } else {
      // If missing, create an empty cell
      content = document.createTextNode('');
    }
    rows.push([label, content]);
  }

  // Create and replace the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
