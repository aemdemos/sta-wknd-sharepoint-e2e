/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block only in the current element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (tabpanel)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Table header: exact block name from example
  const rows = [['Tabs (tabs8)']];

  // Collect each tab's label and content (reference tabPanel element directly for resilience)
  tabLabels.forEach((labelEl) => {
    const label = labelEl.textContent.trim();
    // Find corresponding tabpanel via aria-labelledby
    const panelId = labelEl.id;
    let tabPanel = tabPanels.find((panel) => panel.getAttribute('aria-labelledby') === panelId);
    if (!tabPanel) return;
    // Add row: label, direct reference to tabPanel as content
    rows.push([
      label,
      tabPanel
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
