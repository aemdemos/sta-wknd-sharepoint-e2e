/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs6)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: Find the main content fragment/article inside the tab panel
    let contentFragment = tabPanels[i].querySelector('article');
    let content;
    if (contentFragment) {
      // Use all children of the article as content
      const frag = document.createElement('div');
      Array.from(contentFragment.children).forEach(child => {
        // If image, reference the actual element
        if (child.classList.contains('cmp-contentfragment__elements')) {
          // Look for image inside
          const imgEl = child.querySelector('.cmp-image');
          if (imgEl) {
            frag.appendChild(imgEl);
          }
        }
        // Otherwise, append all content
        frag.appendChild(child);
      });
      content = frag;
    } else {
      // Use all children of the tabPanel itself
      const frag = document.createElement('div');
      Array.from(tabPanels[i].children).forEach(child => {
        frag.appendChild(child);
      });
      content = frag;
    }
    rows.push([
      label,
      content
    ]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the table
  tabsBlock.replaceWith(blockTable);
}
