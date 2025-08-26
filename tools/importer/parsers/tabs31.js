/* global WebImporter */
export default function parse(element, { document }) {
  // Find the correct tabs block. The tabs block is identified by class 'cmp-tabs'
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabList = tabsBlock.querySelector('[role="tablist"]');
  const tabItems = Array.from(tabList ? tabList.children : []);
  // Defensive: if there are no tab items, exit
  if (tabItems.length === 0) return;
  const labels = tabItems.map(li => li.textContent.trim());

  // Get all tab panels (order matters)
  const panels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  if (panels.length === 0) return;

  // Collect tab content elements from each panel
  // For each panel, find the main content area
  // Try to find article.cmp-contentfragment > .cmp-contentfragment__elements, fallback to panel
  const contents = panels.map(panel => {
    let contentBlock = panel.querySelector('article.cmp-contentfragment .cmp-contentfragment__elements');
    if (!contentBlock) {
      // Some tabs may have direct content
      contentBlock = panel;
    }
    return contentBlock;
  });

  // Table structure: first row is header, second row is tab labels, third row is tab contents
  // The Tabs block wants 2 columns, first row is header, second row tab labels, third row: tab content
  // But in the markdown example, the header is one cell spanning columns, then following rows are per tab

  // So, for this implementation, emulate the example: first row is ['Tabs (tabs31)'], next row: [label1, label2, label3...], next row: [content1, content2, content3...]

  const cells = [];
  cells.push(['Tabs (tabs31)']);
  cells.push(labels);
  cells.push(contents);

  // Create the table block using WebImporter helper
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with our block table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
