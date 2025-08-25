/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by class
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab list and tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;

  const tabLabels = Array.from(tabList.querySelectorAll('li'));
  if (!tabLabels.length) return;

  // Get all tab panels. Only direct children with role="tabpanel" (for robustness)
  const tabPanels = Array.from(tabsBlock.querySelectorAll(':scope > div[role="tabpanel"]'));

  // Validate: number of labels = number of panels
  if (tabPanels.length !== tabLabels.length) {
    // fallback: try all tabpanels
    const altPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));
    if (altPanels.length === tabLabels.length) {
      tabPanels.length = 0;
      tabPanels.push(...altPanels);
    }
  }

  // Table header row as required
  const headerRow = ['Tabs (tabs7)'];

  // Build tab rows
  const rows = tabLabels.map((labelEl, idx) => {
    const label = labelEl.textContent.trim();
    let content = '';
    const panelEl = tabPanels[idx];
    if (panelEl) {
      // The main tab content is typically inside .contentfragment > article
      const article = panelEl.querySelector('article');
      if (article) {
        content = article;
      } else {
        // fallback: use all children
        const children = Array.from(panelEl.children);
        if (children.length === 1) {
          content = children[0];
        } else if (children.length > 1) {
          content = children;
        }
      }
    }
    return [label, content];
  });

  // Compose cells
  const cells = [headerRow, ...rows];
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
