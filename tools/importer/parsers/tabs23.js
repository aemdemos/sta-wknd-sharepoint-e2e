/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the list of tab labels from the <ol> (tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children).map(li => li.textContent.trim());

  // Get all tab panels (cmp-tabs__tabpanel)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare the table header row
  const headerRow = ['Tabs (tabs23)'];

  // Each subsequent row: [tab label, tab content]
  const rows = [headerRow];

  // Ensure the number of panels matches number of labels
  for (let i = 0; i < tabLabels.length; i++) {
    // Defensive: tabPanels[i] could be undefined
    let contentCell = null;
    if (tabPanels[i]) {
      // Prefer the main contentfragment/article under tabPanel
      const article = tabPanels[i].querySelector('article');
      if (article) {
        contentCell = article;
      } else {
        // fallback: use all children except possibly empty grid wrappers
        // but for resilience, use tabPanels[i] itself
        contentCell = tabPanels[i];
      }
    } else {
      // Panel missing, use empty string
      contentCell = '';
    }
    rows.push([tabLabels[i], contentCell]);
  }

  // Create the block table using the structure
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}