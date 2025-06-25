/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab label elements (li)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all tab panels in their DOM order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Build the rows for the table
  const rows = [];
  // The header row: block name as in specification
  rows.push(['Tabs (tabs31)']);

  // Loop through labels/panels in order
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent.trim() || '';
    const panel = tabPanels[i];
    let contentCell = null;
    if (panel) {
      // Usually, the content is within an article.cmp-contentfragment > .cmp-contentfragment__elements
      const article = panel.querySelector('article.cmp-contentfragment');
      if (article) {
        const elements = article.querySelector('.cmp-contentfragment__elements');
        if (elements) {
          contentCell = elements;
        } else {
          // Fallback: Use the whole article if elements not found
          contentCell = article;
        }
      } else {
        // Fallback: Use the panel directly
        contentCell = panel;
      }
    } else {
      // Panel missing, use empty cell
      contentCell = '';
    }
    rows.push([label, contentCell]);
  }

  // Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
