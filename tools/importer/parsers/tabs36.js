/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get tab label and content from tab panel
  function getTabInfo(tabEl, panelEl) {
    // Tab label
    const label = tabEl.textContent.trim();
    // Tab content: find the contentfragment article inside the panel
    let contentFragment = panelEl.querySelector('article.cmp-contentfragment');
    let content;
    if (contentFragment) {
      // For "Overview" tab, include image and description
      // For others, include all content inside contentfragment
      // We'll include the entire article for resilience
      content = contentFragment;
    } else {
      // Fallback: use panelEl itself
      content = panelEl;
    }
    return [label, content];
  }

  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only keep tabs with both label and panel
  const tabRows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const tabEl = tabLabels[i];
    const panelEl = tabPanels[i];
    if (tabEl && panelEl) {
      tabRows.push(getTabInfo(tabEl, panelEl));
    }
  }

  // Table header row (block name)
  const headerRow = ['Tabs (tabs36)'];
  // Table body: each row is [Tab Label, Tab Content]
  const tableRows = tabRows.map(([label, content]) => [label, content]);

  // Build table cells
  const cells = [headerRow, ...tableRows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block
  element.replaceWith(block);
}
