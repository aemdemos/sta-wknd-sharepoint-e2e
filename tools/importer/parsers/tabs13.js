/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root element
  const tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) return;
  const tabsRoot = tabsWrapper.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));
  // Get tab panels (content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Header row as required
  const headerRow = ['Tabs (tabs13)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // For tab content, extract the main contentfragment/article inside the tabpanel
    let content = null;
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      // Use a clone so we don't move the node from its parent
      content = cf.cloneNode(true);
    } else {
      // fallback: grab all panel children
      content = Array.from(panel.childNodes).map((node) => node.cloneNode(true));
    }

    rows.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsWrapper.replaceWith(table);
}
