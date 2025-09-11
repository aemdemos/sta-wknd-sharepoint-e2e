/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (li elements)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Find all tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare the table rows
  const headerRow = ['Tabs (tabs18)'];
  const rows = [headerRow];

  // For each tab, get label and content
  tabLabels.forEach((tabLabel, i) => {
    // Defensive: Find the corresponding tabpanel
    let tabPanel = null;
    const controlsId = tabLabel.getAttribute('aria-controls');
    if (controlsId) {
      tabPanel = tabsBlock.querySelector(`#${controlsId}`);
    } else {
      tabPanel = tabPanels[i];
    }
    if (!tabPanel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: find the main contentfragment/article inside the tabpanel
    let tabContent = null;
    const contentFragment = tabPanel.querySelector('article.cmp-contentfragment, .contentfragment');
    if (contentFragment) {
      // Use the whole contentfragment/article as the tab content
      tabContent = contentFragment;
    } else {
      // Fallback: use all children of tabPanel
      tabContent = document.createElement('div');
      Array.from(tabPanel.childNodes).forEach((node) => {
        tabContent.appendChild(node.cloneNode(true));
      });
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
