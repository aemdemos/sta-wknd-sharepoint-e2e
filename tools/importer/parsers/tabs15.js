/* global WebImporter */
export default function parse(element, { document }) {
  // Find the primary tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Header as required
  const headerRow = ['Tabs (tabs15)'];
  const rows = [headerRow];

  // Tab labels (in order)
  const tabLabelEls = tabsBlock.querySelectorAll('.cmp-tabs__tablist > li');
  // Tab panels (in order as in DOM)
  const tabPanels = tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // For each tab, find the associated panel
  for (let i = 0; i < tabLabelEls.length; i++) {
    const labelEl = tabLabelEls[i];
    const tabLabel = labelEl.textContent.trim();
    let panel = null;
    for (const p of tabPanels) {
      if (p.getAttribute('aria-labelledby') === labelEl.id) {
        panel = p;
        break;
      }
    }
    if (!panel) continue;
    // Prefer article for content, else all children
    const contentEl = panel.querySelector('article') || panel;
    rows.push([tabLabel, contentEl]);
  }
  
  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
