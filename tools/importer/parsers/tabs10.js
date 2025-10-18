/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container (cmp-tabs)
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (li.cmp-tabs__tab)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );
  // Get tab panels (div[role="tabpanel"])
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('div[role="tabpanel"]')
  );

  // Defensive: Only proceed if we have matching labels/panels
  if (!tabLabels.length || !tabPanels.length) return;

  // Table header row: must have exactly one column
  const headerRow = ['Tabs (tabs10)'];
  const rows = [headerRow];

  // For each tab, pair label and content
  tabLabels.forEach((labelEl, i) => {
    // Tab label text
    const labelText = labelEl.textContent.trim();
    // Tab panel content
    const panelEl = tabPanels[i];
    let tabContent = null;
    if (panelEl) {
      // Defensive: Only grab the actual tab content, not the wrapper
      // We'll grab all direct children except for script/style/meta and empty grid wrappers
      const contentChildren = Array.from(panelEl.children).filter(
        (child) => child.nodeType === 1 &&
          !['SCRIPT', 'STYLE', 'META'].includes(child.tagName) &&
          !(child.classList.contains('aem-Grid') && child.children.length === 0)
      );
      // If only one child, use it directly; else, use array
      tabContent = contentChildren.length === 1 ? contentChildren[0] : contentChildren;
    } else {
      tabContent = '';
    }
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
