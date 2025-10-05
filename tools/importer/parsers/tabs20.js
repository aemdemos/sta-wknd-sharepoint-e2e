/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row must match block name exactly
  const headerRow = ['Tabs (tabs20)'];
  const rows = tabLabels.map((tabLabel, idx) => {
    const label = tabLabel.textContent.trim();
    const panel = tabPanels[idx];
    // Defensive: get the main content fragment/article inside the panel, else the panel itself
    let tabContent = panel.querySelector('.contentfragment, article.cmp-contentfragment') || panel;
    return [label, tabContent];
  });
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
