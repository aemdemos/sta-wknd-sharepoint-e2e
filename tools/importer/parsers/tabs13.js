/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;

  // Find the tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList.querySelectorAll('li')).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows: first row is header
  const headerRow = ['Tabs (tabs13)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  tabLabels.forEach((label, idx) => {
    // Defensive: get the panel for this tab
    const panel = tabPanels[idx];
    let tabContent = '';
    if (panel) {
      // Find the main contentfragment inside the panel
      const cf = panel.querySelector('.cmp-contentfragment');
      if (cf) {
        // Use the contentfragment's elements as the tab content
        // Defensive: get all children except the title
        const cfTitle = cf.querySelector('.cmp-contentfragment__title');
        const cfElements = cf.querySelector('.cmp-contentfragment__elements');
        if (cfElements) {
          // We'll collect all direct children of cfElements that are not empty grids
          const contentNodes = [];
          Array.from(cfElements.children).forEach(child => {
            // Filter out empty grid wrappers
            if (child.classList.contains('aem-Grid')) return;
            // If child is a div with only aem-Grid inside, skip
            if (child.tagName === 'DIV' && child.children.length === 1 && child.children[0].classList.contains('aem-Grid')) return;
            // If child is a div with only whitespace, skip
            if (child.tagName === 'DIV' && child.textContent.trim() === '' && child.children.length === 0) return;
            contentNodes.push(child);
          });
          // If cfTitle exists and isn't duplicated in contentNodes, add it first
          if (cfTitle && !contentNodes.includes(cfTitle)) {
            contentNodes.unshift(cfTitle);
          }
          // Defensive: If nothing found, fallback to the whole panel
          tabContent = contentNodes.length ? contentNodes : [cf];
        } else {
          tabContent = [cf];
        }
      } else {
        tabContent = [panel];
      }
    }
    rows.push([label, tabContent]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the table
  tabsBlock.replaceWith(table);
}
