/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabList = tabs.querySelector('ol.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li.cmp-tabs__tab') : []);

  // Get tab panels in order
  const tabPanels = Array.from(
    tabs.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  const rows = [];
  // Header row: block name, single column
  rows.push(['Tabs (tabs36)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent.trim() || '';
    const panel = tabPanels[i];
    let tabContent = null;
    if (panel) {
      // Try to extract the main article/contentfragment for semantic clarity
      const contentFragment = panel.querySelector('article');
      if (contentFragment) {
        tabContent = contentFragment;
      } else if (
        panel.children.length === 1 &&
        panel.firstElementChild.classList.contains('contentfragment')
      ) {
        tabContent = panel.firstElementChild;
      } else {
        // fallback: just use all children inside the panel (flattened)
        tabContent = Array.from(panel.children);
      }
    }
    rows.push([label, tabContent]);
  }

  // Create the table and replace the tabs element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(table);
}
