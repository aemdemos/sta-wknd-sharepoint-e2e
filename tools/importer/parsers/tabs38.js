/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Get the tabs container
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements)
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Defensive: Only keep tabs with both label and panel
  const tabs = tabLabels.map((label) => {
    // Try to match tabpanel by aria-controls
    const panelId = label.getAttribute('aria-controls');
    const panel = cmpTabs.querySelector(`#${panelId}`);
    return { label, panel };
  }).filter(tab => tab.label && tab.panel);

  // Build the table rows
  const headerRow = ['Tabs (tabs38)'];
  const rows = [headerRow];

  tabs.forEach(({ label, panel }) => {
    // Tab label text
    const tabLabelText = label.textContent.trim();

    // Tab content: use the main content fragment/article inside the panel
    let tabContent;
    // Find the contentfragment/article inside the panel
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use all children of panel
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => tabContent.append(node.cloneNode(true)));
    }
    rows.push([tabLabelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
