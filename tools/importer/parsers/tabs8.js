/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (tab triggers)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure same number of labels and panels
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Table header row
  const headerRow = ['Tabs (tabs8)'];

  // Build rows for each tab only (no sidebar, no main title)
  const rows = [];
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Tab label text
    const tabLabelText = label.textContent.trim();

    // Tab content: grab all direct children of the panel
    let tabContent;
    const cf = panel.querySelector('.cmp-contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // Compose a fragment with all direct children
      const frag = document.createDocumentFragment();
      Array.from(panel.childNodes).forEach(node => {
        if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
          frag.appendChild(node.cloneNode(true));
        }
      });
      tabContent = frag;
    }

    // Each row: [Tab Label, Tab Content]
    rows.push([
      tabLabelText,
      tabContent
    ]);
  }

  // Compose final table data
  const tableData = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace original element
  element.replaceWith(block);
}
