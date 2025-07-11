/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li elements in .cmp-tabs__tablist)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get the tab panels (elements with .cmp-tabs__tabpanel)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare header row as specified in the block info
  const headerRow = ['Tabs (tabs10)'];
  const rows = [headerRow];

  // For each tab: extract label and corresponding tabpanel content
  tabLabelEls.forEach((tabLabelEl, idx) => {
    const label = tabLabelEl.textContent.trim();
    let content = null;

    // Try to find the right content panel for this label
    const panel = tabPanels[idx];
    if (panel) {
      // Find the main content element inside the panel
      // Typically a .cmp-contentfragment or .contentfragment in these examples
      let cf = panel.querySelector('article.cmp-contentfragment')
        || panel.querySelector('.cmp-contentfragment')
        || panel.querySelector('.contentfragment');
      // Fallback: use the whole panel
      if (!cf) cf = panel;
      content = cf;
    } else {
      // If no panel, just use an empty text node
      content = document.createTextNode('');
    }
    rows.push([label, content]);
  });

  // Create the block table and replace the tabs element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(table);
}
