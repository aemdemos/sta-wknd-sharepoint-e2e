/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs component
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels (first row after header)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabBtns = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));
  const tabLabels = tabBtns.map(btn => btn.textContent.trim());

  // Get tab panels and match to labels by aria-labelledby
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));
  // Build a map from tab id to panel
  const tabIdToPanel = {};
  tabPanels.forEach(panel => {
    const labelledBy = panel.getAttribute('aria-labelledby');
    if (labelledBy) tabIdToPanel[labelledBy] = panel;
  });

  // Build tab label header row (one row with all labels, each in their own cell)
  const tabHeaderRow = tabLabels;

  // Build tab content rows (each row: one cell per tab, in label order)
  const tabContentRow = tabBtns.map((btn) => {
    const tabId = btn.id;
    let content = null;
    // Get corresponding panel
    const panel = tabIdToPanel[tabId];
    if (panel) {
      // If the panel contains a contentfragment or article, use that element; else, use the panel itself
      let contentFragment = panel.querySelector('article.cmp-contentfragment, .contentfragment');
      if (contentFragment) {
        content = contentFragment;
      } else {
        // If nothing else, use all children of the panel in a fragment
        const frag = document.createDocumentFragment();
        Array.from(panel.childNodes).forEach(n => frag.appendChild(n));
        content = frag;
      }
    } else {
      // If no panel found, create an empty div
      content = document.createElement('div');
    }
    return content;
  });

  // Construct the cells for the block table
  const cells = [
    ['Tabs (tabs37)'], // Block header row
    tabHeaderRow,      // Tab labels row
    tabContentRow      // Tab content row (one cell per tab, in order)
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
