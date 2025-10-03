/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure labels and panels match
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Table header row
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: find the main content inside the tabpanel
    // Usually a <article> or <div class="contentfragment">
    let tabContent = null;
    // Prefer the article element if present
    tabContent = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;

    // For resilience, reference the contentfragment's children (not the wrapper)
    // But if the contentfragment is the only child, use it directly
    let contentElements = [];
    if (tabContent) {
      // If tabContent is an article, use its children except the title
      const children = Array.from(tabContent.children);
      // Remove the h3 title if present
      const filtered = children.filter(child => !(child.tagName === 'H3' && child.classList.contains('cmp-contentfragment__title')));
      if (filtered.length > 0) {
        contentElements = filtered;
      } else {
        // fallback: use tabContent itself
        contentElements = [tabContent];
      }
    } else {
      // fallback: use panel itself
      contentElements = [panel];
    }

    // Defensive: flatten arrays and remove empty wrappers
    contentElements = contentElements.filter(el => {
      // Remove empty grid wrappers
      if (el.classList && el.classList.contains('aem-Grid')) return false;
      // Remove empty divs
      if (el.tagName === 'DIV' && el.children.length === 0 && el.textContent.trim() === '') return false;
      return true;
    });

    // If only one element, use it directly; else, use array
    const cellContent = contentElements.length === 1 ? contentElements[0] : contentElements;

    rows.push([label, cellContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsContainer.replaceWith(block);
}
