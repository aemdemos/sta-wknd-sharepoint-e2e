/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the provided element
  const tabsEl = element.querySelector('.tabs .cmp-tabs');
  if (!tabsEl) return;

  // Get tab labels from tablist
  const tabLabels = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(tabsEl.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows: each row is [Tab Label, Tab Content]
  const rows = tabLabels.map((tabLabelEl, i) => {
    // Defensive: find corresponding panel
    const panelEl = tabPanels[i];
    let tabContent = null;
    if (panelEl) {
      // For resilience, reference the whole tabpanel content
      tabContent = panelEl;
    } else {
      tabContent = document.createTextNode('');
    }
    return [tabLabelEl.textContent.trim(), tabContent];
  });

  // Table header: block name
  const headerRow = ['Tabs (tabs16)'];
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsEl.parentNode.replaceChild(block, tabsEl);
}
