/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabList = tabsBlock.querySelector('ol.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Get tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: ensure same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Header row as required
  const headerRow = ['Tabs (tabs32)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: find the main content fragment/article inside the panel
    let tabContent = null;
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      // Use the contentfragment's .cmp-contentfragment__elements if present, else the article itself
      const cfElements = cf.querySelector('.cmp-contentfragment__elements');
      if (cfElements) {
        // Reference existing element, do not clone
        tabContent = cfElements;
      } else {
        tabContent = cf;
      }
    } else {
      // Fallback: use the panel's children
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach((n) => tabContent.appendChild(n));
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the table
  tabsBlock.replaceWith(table);
}
