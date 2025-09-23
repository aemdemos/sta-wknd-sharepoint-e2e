/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs block
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare header row
  const headerRow = ['Tabs (tabs36)'];

  // Prepare rows for each tab
  const rows = tabLabels.map((tab, idx) => {
    // Tab label text
    const label = tab.textContent.trim();

    // Defensive: Find the corresponding tabpanel
    const panel = tabPanels[idx];
    if (!panel) return [label, ''];

    // Tab content: Use the entire tabpanel content
    // Defensive: Find the main contentfragment/article inside the tabpanel
    let tabContent = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // For the first tab (Overview), include image and description
      if (idx === 0) {
        // Find image
        const imageDiv = contentFragment.querySelector('.cmp-image');
        // Find description paragraph (first <p> inside cmp-contentfragment__elements)
        const descDiv = contentFragment.querySelector('.cmp-contentfragment__elements p');
        // Compose content array
        const contentArr = [];
        if (imageDiv) contentArr.push(imageDiv);
        if (descDiv) contentArr.push(descDiv);
        tabContent = contentArr.length ? contentArr : contentFragment;
      } else {
        // For other tabs, use the contentfragment's main content (paragraph or list)
        // Try to find <p> or <ul> inside cmp-contentfragment__elements
        const elementsDiv = contentFragment.querySelector('.cmp-contentfragment__elements');
        if (elementsDiv) {
          const p = elementsDiv.querySelector('p');
          const ul = elementsDiv.querySelector('ul');
          tabContent = p || ul || elementsDiv;
        } else {
          tabContent = contentFragment;
        }
      }
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }
    return [label, tabContent];
  });

  // Compose cells array
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabsContainer with the block table
  tabsContainer.replaceWith(block);
}
