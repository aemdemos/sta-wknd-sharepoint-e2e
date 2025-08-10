/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container (by class 'cmp-tabs') in the given element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get the tab labels (li elements inside ol[role=tablist])
  const tabList = tabsContainer.querySelector('ol[role="tablist"]');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get the tab panels (div[data-cmp-hook-tabs="tabpanel"])
  const tabPanels = Array.from(tabsContainer.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]'));

  // For each tab, get its label and content
  const cells = [];
  // Header
  cells.push(['Tabs (tabs8)']);

  // Loop through the tabs and build the rows
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentEl = null;
    if (panel) {
      // Use the contentfragment child, if present, otherwise use the panel itself
      const cf = panel.querySelector('article.cmp-contentfragment');
      if (cf) {
        contentEl = cf;
      } else {
        // fallback: reference panel itself
        contentEl = panel;
      }
    } else {
      // No panel for this tab: leave cell empty
      contentEl = '';
    }
    cells.push([label, contentEl]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
