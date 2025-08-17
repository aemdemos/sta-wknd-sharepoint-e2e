/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the given element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels in order
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tab'));
  // Get all tab panel elements in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build header row: use block name as per instructions
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // For each tab, extract the label and corresponding panel content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!panel) continue;

    // Find the main tab content area (the .contentfragment article)
    let tabContent;
    // Often the tabpanel has a single child div.contentfragment, which contains an article
    if (panel.children.length === 1 && panel.firstElementChild.classList.contains('contentfragment')) {
      // Contentfragment usually has one article
      const cf = panel.firstElementChild;
      if (cf.children.length === 1 && cf.firstElementChild.tagName.toLowerCase() === 'article') {
        tabContent = cf.firstElementChild;
      } else {
        tabContent = cf;
      }
    } else {
      // fallback: all children of panel
      tabContent = document.createElement('div');
      Array.from(panel.children).forEach(child => tabContent.appendChild(child));
    }
    rows.push([label, tabContent]);
  }

  // Create tabs block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace tabs block with the new table
  tabsBlock.parentNode.replaceChild(table, tabsBlock);
}
