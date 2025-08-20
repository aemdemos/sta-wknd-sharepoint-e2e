/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels in order
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('li').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get all tab panels (in order)
  const tabPanels = tabs.querySelectorAll('.cmp-tabs__tabpanel');

  // Build the table rows: first row header, next rows: [label, tab-panel]
  const cells = [];
  // Header row, per block name exactly
  cells.push(['Tabs (tabs33)']);

  // For each tab panel, create a row [label, content]
  tabPanels.forEach((panel, i) => {
    // Tab label (from tablist, order matches)
    const label = tabLabels[i] || `Tab ${i + 1}`;
    // Tab content - per guideline, reference the article if present, else contentfragment, else panel
    let content;
    // Prefer the article inside .contentfragment
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      const article = cf.querySelector('article');
      if (article) {
        content = article;
      } else {
        content = cf;
      }
    } else {
      content = panel;
    }
    // Add the row
    cells.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs element in the DOM
  tabs.replaceWith(block);
}
