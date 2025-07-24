/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract the tab labels
  const tabLabelEls = tabs.querySelectorAll('.cmp-tabs__tablist > li');
  const tabLabels = Array.from(tabLabelEls).map(li => li.textContent.trim());

  // Extract the tab panels in order
  const tabPanelEls = tabs.querySelectorAll('.cmp-tabs__tabpanel');
  
  // Prepare the header row as in the example
  const cells = [['Tabs (tabs3)']];

  // For each tab, extract the label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panelEl = tabPanelEls[i];
    let contentCell = '';
    if (panelEl) {
      // The visible content is the .contentfragment or all of panelEl if not present
      // Use direct reference to avoid unnecessary clones
      let mainContent = panelEl.querySelector('.contentfragment') || panelEl;
      contentCell = mainContent;
    }
    cells.push([label, contentCell]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
