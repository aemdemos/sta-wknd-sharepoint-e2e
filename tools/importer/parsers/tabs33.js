/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li')) : [];
  if (!tabLabelEls.length) return;

  // Get all tab panels in order (content)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (!tabPanels.length) return;

  // Create the header row (single cell, block name)
  const headerRow = ['Tabs (tabs33)'];

  // Create a row for each tab: [label, content]
  const tabRows = tabLabelEls.map((tabEl, idx) => {
    // Tab label in first cell
    const tabLabel = tabEl.textContent.trim();
    // Tab content in second cell
    let tabContent;
    if (tabPanels[idx]) {
      const cf = tabPanels[idx].querySelector('.contentfragment > article');
      if (cf) {
        tabContent = cf;
      } else {
        // Fallback: use all children as a fragment
        const frag = document.createDocumentFragment();
        Array.from(tabPanels[idx].childNodes).forEach(child => {
          frag.appendChild(child);
        });
        tabContent = frag;
      }
    } else {
      tabContent = '';
    }
    return [tabLabel, tabContent];
  });

  // Compose the table: header row, then one row per tab (label, content)
  const cells = [headerRow, ...tabRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
