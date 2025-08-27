/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  // The element given is the main container, find the .tabs.panelcontainer (.cmp-tabs is inside)
  let tabsContainer = element.querySelector('.tabs.panelcontainer');
  let cmpTabs;
  if (tabsContainer) {
    cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  } else {
    cmpTabs = element.querySelector('.cmp-tabs');
    tabsContainer = cmpTabs?.parentElement;
  }
  if (!cmpTabs) return;

  // Get tab labels (in order)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li')).map(li => li.textContent.trim());

  // Get tab panels (in order)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Table header row (EXACTLY as in the example, with variant)
  const headerRow = ['Tabs (tabs37)'];

  // Compose the rows: [Tab Label, Tab Content]
  const rows = tabLabels.map((label, i) => {
    // Get the content for this tab (same order)
    const tabPanel = tabPanels[i];
    let content;
    if (tabPanel) {
      // Use all direct children as the tab content, or the article/contentfragment if present
      // This ensures that images, paragraphs, lists, and other content are preserved and referenced, not cloned.
      let cf = tabPanel.querySelector('article.cmp-contentfragment');
      if (cf) {
        content = cf;
      } else {
        // If no article, use all children as fragment
        const frag = document.createDocumentFragment();
        Array.from(tabPanel.childNodes).forEach(n => frag.appendChild(n));
        content = frag;
      }
    } else {
      // No content, use empty text node
      content = document.createTextNode('');
    }
    return [label, content];
  });

  // Build the table cell structure
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabsContainer (the outermost .tabs.panelcontainer) with the new block table
  if (tabsContainer) {
    tabsContainer.replaceWith(block);
  } else if (cmpTabs) {
    cmpTabs.replaceWith(block);
  }
}
