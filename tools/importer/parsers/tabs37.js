/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (li elements inside ol[role="tablist"])
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Find all tab panels (div[role="tabpanel"])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));

  // Build the table header
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, get the label and content
  tabLabels.forEach((tabLabel, i) => {
    // Defensive: Find the corresponding tab panel by aria-controls
    const panelId = tabLabel.getAttribute('aria-controls');
    const tabPanel = tabsBlock.querySelector(`#${panelId}`);
    if (!tabPanel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: find the main content fragment/article inside the panel
    // Usually it's a .contentfragment > article, but fallback to panel itself
    let tabContent = tabPanel.querySelector('article') || tabPanel;

    // For robustness, if the article contains only a heading and a .cmp-contentfragment__elements,
    // use the .cmp-contentfragment__elements as the main content
    const elementsBlock = tabContent.querySelector('.cmp-contentfragment__elements');
    if (elementsBlock) {
      // If the elements block contains only one child and that child is a div,
      // and that div contains another div.aem-Grid, skip empty grid wrappers
      // Otherwise, use the whole elementsBlock
      // We'll just use elementsBlock for resilience
      tabContent = elementsBlock;
    }

    // Defensive: If tabContent is empty, fallback to tabPanel
    if (!tabContent || !tabContent.textContent.trim()) {
      tabContent = tabPanel;
    }

    // Add row: [Tab Label, Tab Content]
    rows.push([
      labelText,
      tabContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
