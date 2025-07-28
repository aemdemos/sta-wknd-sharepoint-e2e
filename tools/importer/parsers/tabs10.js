/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  let tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels
  const tabList = tabsBlock.querySelector('ol.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li.cmp-tabs__tab')) : [];
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Find all tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div.cmp-tabs__tabpanel'));

  // Build table rows
  const headerRow = ['Tabs (tabs10)'];
  const cells = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let panel = tabPanels[i];
    if (!panel && tabLabelEls[i]) {
      // Fallback: match panel by aria-controls
      const ariaControls = tabLabelEls[i].getAttribute('aria-controls');
      panel = ariaControls ? tabsBlock.querySelector(`#${ariaControls}`) : null;
    }

    let tabContent = null;
    if (panel) {
      // In this HTML, <article> holds the main tab content, reference it directly
      const article = panel.querySelector('article');
      tabContent = article || panel;
    } else {
      tabContent = document.createTextNode('');
    }
    cells.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  
  // Replace the original tabs block with the table
  tabsBlock.parentNode.replaceChild(table, tabsBlock);
}
