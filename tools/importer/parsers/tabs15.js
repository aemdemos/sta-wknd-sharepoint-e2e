/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map((li) => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure matching number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Tabs (tabs15)'];
  rows.push(headerRow);

  // Each tab: label, content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: clone the content to avoid moving it from DOM
    const panelContent = document.createElement('div');
    // Find the main content fragment/article inside the tabpanel
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      // We'll collect all content inside the .cmp-contentfragment__elements
      const elements = cf.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        // Clone all children of .cmp-contentfragment__elements
        Array.from(elements.children).forEach((child) => {
          panelContent.appendChild(child.cloneNode(true));
        });
      } else {
        // Fallback: clone all children of article
        Array.from(cf.children).forEach((child) => {
          panelContent.appendChild(child.cloneNode(true));
        });
      }
    } else {
      // Fallback: clone all children of tab panel
      Array.from(panel.children).forEach((child) => {
        panelContent.appendChild(child.cloneNode(true));
      });
    }

    rows.push([label, panelContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  element.replaceWith(table);
}
