/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (accordion source)
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Get all tab labels and tab panels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Header row
  const headerRow = ['Accordion (accordion31)'];
  const rows = [headerRow];

  // Build each accordion row
  tabLabels.forEach((tabLabel, idx) => {
    // Defensive: Find the corresponding panel
    const panel = tabPanels[idx];
    if (!panel) return;

    // Title cell: use the tab label text
    const titleText = tabLabel.textContent.trim();
    const titleEl = document.createElement('div');
    titleEl.textContent = titleText;

    // Content cell: gather all main content inside the panel
    // Find the contentfragment article inside the panel
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    let contentCell;
    if (contentFragment) {
      // Use everything inside the contentfragment's elements container
      const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (elementsContainer) {
        // Instead of only direct children, collect all visible content recursively
        const contentParts = [];
        // Helper to collect all content except empty grid wrappers
        function collectContent(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Skip empty grid wrappers
            if (node.classList.contains('aem-Grid')) return;
            // If image, include
            if (node.classList.contains('cmp-image')) {
              contentParts.push(node);
              return;
            }
            // If paragraph, heading, list, etc, include
            if ([
              'P', 'UL', 'OL', 'LI', 'IMG', 'FIGURE', 'TABLE', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DIV', 'SPAN'
            ].includes(node.tagName)) {
              // If div, check if it's just a grid wrapper
              if (node.tagName === 'DIV' && node.children.length === 1 && node.children[0].classList.contains('aem-Grid')) {
                // Dive into the grid
                collectContent(node.children[0]);
                return;
              }
              // Otherwise, include and recurse
              contentParts.push(node);
              Array.from(node.children).forEach(collectContent);
              return;
            }
          }
        }
        Array.from(elementsContainer.children).forEach(collectContent);
        // Defensive: If nothing found, fallback to the whole elementsContainer
        contentCell = contentParts.length ? contentParts : [elementsContainer];
      } else {
        // Fallback: use the whole contentfragment
        contentCell = [contentFragment];
      }
    } else {
      // Fallback: use the whole panel
      contentCell = [panel];
    }

    rows.push([titleEl, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the block
  tabs.replaceWith(block);
}
