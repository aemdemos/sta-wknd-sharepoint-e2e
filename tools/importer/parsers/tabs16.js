/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs, .panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer;
  if (!cmpTabs || !cmpTabs.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab headers (labels)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs16)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((labelEl, idx) => {
    // Tab label text
    const labelText = labelEl.textContent.trim();
    // Tab panel content
    const panel = tabPanels[idx];
    // Defensive: if panel is missing, skip
    if (!panel) return;

    // For robustness, take the entire panel content
    // Usually the contentfragment/article inside the panel
    let tabContent = null;
    // Find main contentfragment/article
    const contentFragment = panel.querySelector('.cmp-contentfragment, article');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use panel's children
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach((node) => {
        tabContent.appendChild(node.cloneNode(true));
      });
    }
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs container with the block table
  tabsContainer.replaceWith(block);
}
