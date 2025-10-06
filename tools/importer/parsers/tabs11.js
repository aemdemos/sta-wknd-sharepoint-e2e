/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (li elements in tablist)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: ensure same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Header row as required
  const headerRow = ['Tabs (tabs11)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label text
    const label = tabLabels[i].textContent.trim();

    // Tab content: get the contentfragment/article inside the tabpanel
    const panel = tabPanels[i];
    let tabContent = null;
    // Try to find the main contentfragment/article
    const article = panel.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      // Fallback: use the whole panel
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs container with the block
  tabsContainer.replaceWith(block);
}
