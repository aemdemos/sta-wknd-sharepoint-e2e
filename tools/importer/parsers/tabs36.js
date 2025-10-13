/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer');
  if (!tabsRoot) return;

  // Find the actual tabs component
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab headers (in order)
  const tabHeaders = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (in order)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure headers and panels match
  if (tabHeaders.length !== tabPanels.length || tabHeaders.length === 0) return;

  // Table header row: must be a single cell
  const headerRow = ['Tabs (tabs36)'];

  // Helper to extract only meaningful content from a panel
  function extractPanelContent(panel) {
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    let contentElements = [];
    if (contentFragment) {
      // Only keep semantic content (p, ul, ol, img, h2, etc.)
      // Remove grid wrappers and empty divs
      const keepTags = ['P', 'UL', 'OL', 'IMG', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TABLE', 'FIGURE', 'BLOCKQUOTE'];
      const fragmentChildren = Array.from(contentFragment.querySelectorAll('*'))
        .filter(child => keepTags.includes(child.tagName) && child.textContent.trim() || child.tagName === 'IMG');
      if (fragmentChildren.length) {
        contentElements = fragmentChildren;
      } else {
        // Fallback: get all children except the title
        contentElements = Array.from(contentFragment.children).filter(child => {
          return !(child.tagName === 'H3' && child.classList.contains('cmp-contentfragment__title'));
        });
      }
    } else {
      // Fallback: use all direct children of the panel, but only semantic content
      const keepTags = ['P', 'UL', 'OL', 'IMG', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TABLE', 'FIGURE', 'BLOCKQUOTE'];
      contentElements = Array.from(panel.querySelectorAll('*')).filter(child => keepTags.includes(child.tagName) && child.textContent.trim() || child.tagName === 'IMG');
    }
    return contentElements.length ? contentElements : [''];
  }

  // Build rows: each row is [Tab Label, Tab Content]
  const rows = tabHeaders.map((header, idx) => {
    const panel = tabPanels[idx];
    const contentElements = extractPanelContent(panel);
    return [header, contentElements];
  });

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(block);
}
