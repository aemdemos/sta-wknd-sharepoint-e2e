/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by looking for the main tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get the tab labels (li elements inside the tablist)
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li') : []);

  // Get the tab panels (divs with class cmp-tabs__tabpanel)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table header as specified by the block name
  const headerRow = ['Tabs (tabs38)'];

  // Prepare the rows for each tab
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent.trim() || '';
    let contentCell = '';
    // The corresponding tab panel by index
    const panel = tabPanels[i];
    if (panel) {
      // Move all children from panel into a new container div for the cell
      const containerDiv = document.createElement('div');
      while (panel.firstChild) {
        containerDiv.appendChild(panel.firstChild);
      }
      contentCell = containerDiv;
    }
    rows.push([label, contentCell]);
  }

  const cells = [headerRow, ...rows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  
  // Replace the original tabs block with the new table
  tabsContainer.replaceWith(table);
}
