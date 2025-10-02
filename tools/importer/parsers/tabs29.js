/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Header row as per block requirements
  const headerRow = ['Tabs (tabs29)'];
  const rows = [headerRow];

  // Get tab labels from the tablist
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all tab panels (content for each tab)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only process as many panels as there are labels
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    if (!panel) continue;

    // Grab the full content of the tab panel
    // Find the main contentfragment/article inside the panel
    let content = null;
    const cf = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (cf) {
      // Remove the title h3 if present (to avoid duplicate titles)
      const h3 = cf.querySelector('h3.cmp-contentfragment__title');
      if (h3) h3.remove();
      content = cf;
    } else {
      // fallback to all children
      content = document.createElement('div');
      Array.from(panel.childNodes).forEach((n) => content.appendChild(n.cloneNode(true)));
    }

    rows.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new table
  tabsBlock.replaceWith(table);
}
