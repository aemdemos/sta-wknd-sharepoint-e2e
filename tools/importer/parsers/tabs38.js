/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block within the element
  const tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) return;

  // Get the tab labels from the tablist (li elements with role=tab)
  const tabList = tabsWrapper.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);
  if (!tabLabelEls.length) return;

  // Find all tabpanels
  const panelEls = Array.from(tabsWrapper.querySelectorAll('.cmp-tabs__tabpanel'));
  if (!panelEls.length) return;
  
  // Prepare the table rows
  const rows = [
    ['Tabs (tabs38)']
  ];

  for (let i = 0; i < tabLabelEls.length; i++) {
    const tabLabel = tabLabelEls[i];
    // Extract label text, preserving formatting if any
    let labelContent = tabLabel.textContent.trim();

    // Find the corresponding tabpanel
    let panel = null;
    const ariaControls = tabLabel.getAttribute('aria-controls');
    if (ariaControls) {
      panel = tabsWrapper.querySelector(`#${ariaControls}`);
    }
    if (!panel && panelEls[i]) {
      panel = panelEls[i];
    }
    if (!panel) {
      rows.push([labelContent, '']);
      continue;
    }

    // Find the main contentfragment inside the panel if present
    const contentFragment = panel.querySelector('article.cmp-contentfragment') || panel;

    // Insert the tab row: [tab label, tab panel content]
    rows.push([
      labelContent,
      contentFragment
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsWrapper.parentNode.replaceChild(table, tabsWrapper);
}
