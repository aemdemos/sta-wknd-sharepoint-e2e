/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find the cmp-tabs element (actual tabs container)
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs') || tabsRoot;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row (block name)
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label (text only)
    const label = tabLabels[i].textContent.trim();

    // Tab content: clone the panel content, but remove the tab title (if present)
    const panel = tabPanels[i];
    // Defensive: find the main content inside the panel
    let content = null;
    // Usually there's a contentfragment/article inside
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      // Remove the .cmp-contentfragment__title (duplicate of tab label)
      const cfClone = cf.cloneNode(true);
      const title = cfClone.querySelector('.cmp-contentfragment__title');
      if (title) title.remove();
      content = cfClone;
    } else {
      // Fallback: use the whole panel
      content = panel.cloneNode(true);
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(table);
}
