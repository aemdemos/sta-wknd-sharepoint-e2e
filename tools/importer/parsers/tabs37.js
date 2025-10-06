/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels and tab panels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header must match block name exactly
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // Helper to collect all visible content elements in order
  function collectTabContent(panelEl) {
    // Find the main contentfragment inside the panel
    const contentFragment = panelEl.querySelector('.cmp-contentfragment');
    if (!contentFragment) return [panelEl];
    const elementsBlock = contentFragment.querySelector('.cmp-contentfragment__elements');
    if (!elementsBlock) return [contentFragment];
    // Collect all direct children except empty grid wrappers
    const content = [];
    Array.from(elementsBlock.children).forEach(child => {
      // Skip grid wrappers and empty divs
      if (
        child.classList.contains('aem-Grid') ||
        (child.tagName === 'DIV' && child.children.length === 1 && child.firstElementChild.classList.contains('aem-Grid'))
      ) {
        return;
      }
      // If child is a div, flatten its children (for nested structure)
      if (child.tagName === 'DIV' && child.children.length > 0) {
        Array.from(child.children).forEach(grandChild => {
          // Only add non-empty elements
          if (grandChild.textContent.trim() || grandChild.tagName === 'IMG' || grandChild.tagName === 'UL') {
            content.push(grandChild);
          }
        });
      } else {
        // Only add non-empty elements
        if (child.textContent.trim() || child.tagName === 'IMG' || child.tagName === 'UL') {
          content.push(child);
        }
      }
    });
    // Fallback: if nothing collected, use elementsBlock
    return content.length ? content : [elementsBlock];
  }

  // Iterate each tab
  tabLabels.forEach((labelEl, i) => {
    const tabLabel = labelEl.textContent.trim();
    const panelEl = tabPanels[i];
    const tabContentEls = collectTabContent(panelEl);
    rows.push([tabLabel, tabContentEls]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
