/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tablist (keep their text only)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelElements = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const tabLabels = tabLabelElements.map(tabEl => tabEl.textContent.trim());

  // Get all tabpanel elements in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build header row as per block name, exactly matching spec
  const headerRow = ['Tabs (tabs39)'];
  const rows = [headerRow];

  // For each tab, fetch label/content, reference existing contentfragment or container
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    // Use direct reference to the contentfragment/article for the tab content if available
    let tabContent;
    // There is always a single .contentfragment > article within each panel
    const cfArticle = panel.querySelector('article.cmp-contentfragment');
    if (cfArticle) {
      tabContent = cfArticle;
    } else {
      // fallback: reference the panel itself
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Create the table block and replace the element in DOM
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
