/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tab block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Tab labels (the tab list is an <ol> with <li>s)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('li'));

  // Tab panels: each tab panel has data-cmp-hook-tabs="tabpanel"
  const tabPanels = Array.from(
    tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Compose the header row for the block table
  const headerRow = ['Tabs (tabs38)'];

  // Compose the tab rows: [Tab Label, Tab Content]
  const tabRows = tabLabelEls.map((tabLabelEl, idx) => {
    const label = tabLabelEl.textContent.trim();
    let panelContent = '';
    if (tabPanels[idx]) {
      // prefer the article if present for clean content
      const article = tabPanels[idx].querySelector('article');
      if (article) {
        panelContent = article;
      } else {
        // fallback: the whole panel
        panelContent = tabPanels[idx];
      }
    }
    return [label, panelContent];
  });

  // Compose the table
  const cells = [headerRow, ...tabRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the entire tab block with the new table
  tabs.replaceWith(block);
}
