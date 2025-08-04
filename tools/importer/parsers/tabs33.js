/* global WebImporter */
export default function parse(element, { document }) {
  // Look for the main tabs block (by class)
  const tabsSection = element.querySelector('.tabs .cmp-tabs');
  if (!tabsSection) return;

  // Extract the tab labels (from tablist li)
  const tablist = tabsSection.querySelector('ol.cmp-tabs__tablist');
  const tabEls = tablist ? Array.from(tablist.querySelectorAll('li[role="tab"]')) : [];
  const labels = tabEls.map(li => li.textContent.trim());

  // For each tab panel, extract panel content
  const panels = Array.from(tabsSection.querySelectorAll('.cmp-tabs__tabpanel[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows for each tab
  const tabRows = labels.map((label, idx) => {
    // Try to match by index, else fallback to aria-labelledby
    let panel = panels[idx];
    if (!panel && tabEls[idx] && tabEls[idx].id) {
      panel = tabsSection.querySelector(`.cmp-tabs__tabpanel[aria-labelledby="${tabEls[idx].id}"]`);
    }
    // Defensive: fallback to blank if no panel
    let cellContent = '';
    if (panel) {
      // Prefer the main article if it exists
      const article = panel.querySelector('article');
      if (article) {
        cellContent = article;
      } else {
        // fallback to .contentfragment, else panel itself
        cellContent = panel.querySelector('.contentfragment') || panel;
      }
    }
    return [label, cellContent];
  });

  // Block header row exactly as required
  const headerRow = ['Tabs (tabs33)'];
  const tableData = [headerRow, ...tabRows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
