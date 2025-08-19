/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : [];
  const tabLabels = Array.from(tabLabelEls).map(el => el.textContent.trim());

  // Extract tab panels in order
  const tabPanels = tabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Header row as specified
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, extract label and tab content
  for (let i = 0; i < tabPanels.length; i++) {
    const label = tabLabels[i] || '';
    const panel = tabPanels[i];
    // Find content element: prefer single non-empty child which is an article, otherwise fallback
    let contentEl = null;
    // Look for first non-empty direct descendant (prefer article)
    for (const child of panel.children) {
      if (child.nodeType === 1 && child.innerHTML.trim().length > 0) {
        if (child.tagName.toLowerCase() === 'article') {
          contentEl = child;
          break;
        } else {
          // If not article, see if it contains an article
          const article = child.querySelector('article');
          if (article) {
            contentEl = article;
            break;
          } else {
            // Otherwise use the non-empty child div
            contentEl = child;
            break;
          }
        }
      }
    }
    // Fallback: if no child found, use the panel itself
    if (!contentEl) contentEl = panel;
    rows.push([label, contentEl]);
  }

  // Create and insert the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
