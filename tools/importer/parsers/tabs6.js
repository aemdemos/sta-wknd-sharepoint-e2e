/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));
  // Get all tabpanel elements
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare the table header row according to specification
  const cells = [['Tabs (tabs6)']];

  // For each tab label, create a row with its content
  for (let i = 0; i < tabLabels.length; i++) {
    const labelEl = tabLabels[i];
    const tabLabel = labelEl.textContent.trim();
    // Find the corresponding tabpanel (by order)
    const panel = tabPanels[i];
    let tabContent;
    if (panel) {
      // For semantic accuracy, try to reference the main content fragment/article if present
      const cfArticle = panel.querySelector('article.cmp-contentfragment');
      if (cfArticle) {
        tabContent = cfArticle;
      } else {
        // Use all tabpanel children for robustness
        tabContent = Array.from(panel.childNodes);
      }
    } else {
      // If no panel, leave cell blank
      tabContent = '';
    }
    cells.push([tabLabel, tabContent]);
  }

  // Create the tabs block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  // Replace only the tabs block (not the parent container)
  tabsBlock.parentNode.replaceChild(blockTable, tabsBlock);
}
