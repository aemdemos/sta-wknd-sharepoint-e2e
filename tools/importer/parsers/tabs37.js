/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels and panels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []);
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  if (!tabLabels.length || !tabPanels.length) return;

  // Prepare cells: first row is header, then each row is [Tab Label, Tab Content]
  const cells = [
    ['Tabs (tabs37)'],
  ];
  for (let i = 0; i < tabLabels.length; i++) {
    const tab = tabLabels[i];
    const panel = tabPanels[i];
    // Tab label as <strong>
    const labelEl = document.createElement('strong');
    labelEl.textContent = tab.textContent.trim();
    // Content: prefer article.cmp-contentfragment, else first div with children, else panel
    let contentEl = panel.querySelector('article.cmp-contentfragment');
    if (!contentEl) {
      const nonEmptyDiv = Array.from(panel.children).find(child => child.tagName === 'DIV' && child.childElementCount > 0);
      contentEl = nonEmptyDiv || panel;
    }
    cells.push([labelEl, contentEl]);
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
