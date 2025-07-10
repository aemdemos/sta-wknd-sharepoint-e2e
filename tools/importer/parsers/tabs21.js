/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block - look for the first .cmp-tabs
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (order matters)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get the tab panels (in the same order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the header row: block name
  const headerRow = ['Tabs (tabs21)'];
  const cells = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // Get main tab content: try to find .contentfragment > article, otherwise fallback to panel's children
    let tabContent = null;
    const cf = panel.querySelector('.contentfragment > article');
    if (cf) {
      // Use all children except the <h3> title (to avoid duplication)
      const cfContent = Array.from(cf.children).filter(child => child.tagName.toLowerCase() !== 'h3');
      tabContent = (cfContent.length === 1) ? cfContent[0] : cfContent;
    } else {
      // Fallback: use all relevant children
      const panelContent = Array.from(panel.children);
      tabContent = (panelContent.length === 1) ? panelContent[0] : panelContent;
    }
    cells.push([label, tabContent]);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
