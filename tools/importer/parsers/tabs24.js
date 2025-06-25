/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find the tab labels (these are typically <li role="tab"> children in a single <ol>)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
  if (tabLabelEls.length === 0) return;
  const labels = tabLabelEls.map(el => el.textContent.trim());

  // Find the tab panels (content for each tab) -- must be in the same order as the tab labels
  const tabPanelEls = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));
  if (tabPanelEls.length === 0) return;

  // If there is a mismatch in counts, do not proceed (format problem)
  if (tabPanelEls.length !== tabLabelEls.length) return;

  // For each tab, extract its main content block (preferably the <article> or all its content)
  // We'll reference the first main element inside the tabpanel as the content, or fallback to all its children
  const tabContents = tabPanelEls.map(panel => {
    // Prefer an <article> if it exists
    const article = panel.querySelector('article');
    if (article) {
      return article;
    }
    // Otherwise, collect all child nodes (elements and text), removing empty whitespace
    return Array.from(panel.childNodes).filter(
      node => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())
    );
  });

  // Build the block table
  // First row: [ 'Tabs (tabs24)' ]
  // Second row: [ label1, label2, label3, ... ]
  // Third row: [ content1, content2, content3, ... ]

  const headerRow = ['Tabs (tabs24)'];
  const labelRow = labels;
  const contentRow = tabContents;

  // Compose the table cells array
  const cells = [headerRow, labelRow, contentRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the cmp-tabs block in the DOM with the new table
  tabsRoot.replaceWith(table);
}
