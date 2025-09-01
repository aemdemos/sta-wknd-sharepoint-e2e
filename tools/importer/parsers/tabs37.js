/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block (parent of cmp-tabs)
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Extract the tab labels
  const tabLabelEls = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Extract the tab panels (order matters)
  const tabPanelEls = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare header row as per block description
  const headerRow = ['Tabs (tabs37)'];
  const tableRows = [headerRow];

  // For each tab, extract the label and the content
  for (let i = 0; i < tabLabelEls.length; i++) {
    const label = tabLabelEls[i]?.textContent?.trim() || '';
    let content = null;
    // Find the corresponding tab panel
    const panel = tabPanelEls[i];
    if (!panel) {
      tableRows.push([label, '']);
      continue;
    }
    // The main content in each tab panel is the contentfragment article, if present
    // Otherwise, use all panel children (for resilience)
    let article = panel.querySelector('article');
    if (!article) {
      // fallback: gather all panel children in a div
      const div = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => div.appendChild(node));
      content = div;
    } else {
      // use the article element directly (referencing, not cloning)
      content = article;
    }
    // Add to table
    tableRows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the tabs block with the table
  tabsBlock.replaceWith(table);
}
