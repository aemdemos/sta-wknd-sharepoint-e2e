/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  // Defensive: If not found, try to find a cmp-tabs inside element
  const cmpTabs = tabsBlock || element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab titles (li elements inside tablist)
  const tabTitles = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Only build rows for tabs that have both title and panel
  const tabRows = tabTitles.map((title, idx) => {
    // Defensive: If panel missing, skip
    const panel = tabPanels[idx];
    if (!panel) return null;
    // Collect all direct children of the tabpanel that are meaningful
    // We'll use the contentfragment/article if present, otherwise all children
    let tabContent;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use all children
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => {
        if (node.nodeType === 1) tabContent.appendChild(node);
      });
    }
    // Return row: [Tab Title, Tab Content]
    return [title, tabContent];
  }).filter(Boolean);

  // Table header row (block name)
  const headerRow = ['Tabs (tabs34)'];
  const cells = [headerRow, ...tabRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs block with the new table
  cmpTabs.replaceWith(block);
}
