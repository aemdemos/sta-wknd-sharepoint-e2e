/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs root within the element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Header row with the exact block name and variant as shown in the task
  const headerRow = ['Tabs (tabs25)'];

  // Get all the tab labels (li elements)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get all tab panels (divs that are role="tabpanel")
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('div[role="tabpanel"]')
  );

  // Assemble table rows for each tab
  const rows = tabLabels.map((tab, idx) => {
    // Tab label is always first cell
    const tabLabel = tab.textContent.trim();
    let tabContent = [];
    const panel = tabPanels[idx];
    if (panel) {
      // Prefer the main contentfragment/article inside the panel, else the panel itself
      const article = panel.querySelector('article');
      if (article) {
        tabContent.push(article);
      } else {
        // If no article, include all panel children
        tabContent = Array.from(panel.childNodes).filter(node => !(node.nodeType === 3 && !node.textContent.trim()));
      }
    }
    return [tabLabel, tabContent];
  });

  const cells = [headerRow, ...rows];
  // Create table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the table
  tabsRoot.replaceWith(table);
}
