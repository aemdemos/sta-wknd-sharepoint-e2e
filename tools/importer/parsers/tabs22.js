/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get the tab panels (content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: only process if we have matching label/content count
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Header row
  const headerRow = ['Tabs (tabs22)'];
  const rows = [headerRow];

  // For each tab, add label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // Grab the contentfragment/article inside the tabpanel
      const cf = panel.querySelector('article.cmp-contentfragment');
      if (cf) {
        // Remove the title (h3) if present, as the tab already has a label
        const cfClone = cf.cloneNode(true);
        const h3 = cfClone.querySelector('h3.cmp-contentfragment__title');
        if (h3) h3.remove();
        content = cfClone;
      } else {
        // fallback: use the whole panel content
        content = panel.cloneNode(true);
      }
    } else {
      content = '';
    }
    rows.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsRoot.replaceWith(table);
}
