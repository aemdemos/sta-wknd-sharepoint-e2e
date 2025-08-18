/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element (the tabs block)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabLabelEls = tabsBlock.querySelectorAll('.cmp-tabs__tablist > .cmp-tabs__tab');
  const tabLabels = Array.from(tabLabelEls).map(li => li.textContent.trim());

  // Get tabpanel elements, matching their order as in tabLabelEls:
  // Get all immediate children of .cmp-tabs that have role="tabpanel"
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build the block table: header first, then one row per tab
  const cells = [];
  cells.push(['Tabs (tabs12)']);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Defensive: In case of mismatch, fallback
    const panel = tabPanels[i] || '';
    // The tab content cell should be the direct .contentfragment (if exists), otherwise all of the panel
    let content;
    const cf = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (cf) {
      content = cf;
    } else if (panel) {
      content = panel;
    } else {
      content = '';
    }
    cells.push([label, content]);
  }

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block in the DOM
  tabsBlock.replaceWith(block);
}
