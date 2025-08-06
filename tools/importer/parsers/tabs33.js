/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels: the <li> elements inside <ol role="tablist">
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  const tabLabels = Array.from(tabList ? tabList.children : []).map(li => li.textContent.trim());

  // Get tab content panels: <div role="tabpanel" data-cmp-hook-tabs="tabpanel">
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Compose the cells array for the table block
  const headerRow = ['Tabs (tabs33)'];
  const cells = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: If there are fewer panels than labels, skip
    if (!panel) continue;

    // For content, we want to reference the main content inside the tab panel.
    // The actual content is typically inside an <article> which we reference directly.
    // If not present, fallback to the entire panel.
    let tabContent = null;
    const article = panel.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      // fallback to the panel content itself
      tabContent = panel;
    }

    cells.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the block table
  tabsBlock.replaceWith(block);
}
