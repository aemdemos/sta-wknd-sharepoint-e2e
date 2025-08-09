/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs component
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Extract tab labels
  const tabLabels = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tablist > li')).map(li => li.textContent.trim());
  // Extract all tab panels (each has role=tabpanel)
  const tabPanels = Array.from(tabsEl.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build table rows
  const rows = [['Tabs (tabs7)']];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let content = null;
    if (tabPanels[i]) {
      // Per block guidelines, tab content is often an entire article element
      // Place the first <article> in tabPanel if available, otherwise use the full tabPanel
      const article = tabPanels[i].querySelector('article');
      if (article) {
        content = article;
      } else {
        // fallback: reference the tabPanel directly (should be resilient)
        content = tabPanels[i];
      }
    } else {
      // If no tabPanel, just leave cell empty
      content = '';
    }
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element only (not the full input element!)
  tabsEl.replaceWith(block);
}