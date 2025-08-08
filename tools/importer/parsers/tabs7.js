/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li elements in ol.cmp-tabs__tablist)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get all tab panels (divs with .cmp-tabs__tabpanel)
  const tabPanels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Build the header row as in the example
  const headerRow = ['Tabs (tabs7)'];
  const cells = [headerRow];

  // Build the rows for each tab
  // Tab label goes in the first cell, tab content in the second cell
  for (let i = 0; i < tabLabels.length; i++) {
    let label = tabLabels[i]?.textContent?.trim() || '';
    let panel = tabPanels[i];
    if (!panel) continue; // skip if no corresponding panel

    // Find the FIRST child that looks like the main tab content
    // Usually a <div class="contentfragment"> or <article>
    // We'll include the full panel content to preserve all formatting and structure
    // But if there's a <article> inside, that's the actual content
    let content = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel.children[0] || panel;

    // If content is a wrapper (like .contentfragment), but contains only one child (the article), extract it
    if (
      content.classList &&
      content.classList.contains('contentfragment') &&
      content.children.length === 1 &&
      content.firstElementChild.tagName.toLowerCase() === 'article'
    ) {
      content = content.firstElementChild;
    }

    // Push the row [Tab Label, Tab Content]
    cells.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the table
  tabs.replaceWith(table);
}
