/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by its known class
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all the tab labels from the tablist
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );
  // Get all the tab panels (content sections), in order
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only create rows for as many panels/labels as both exist
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Compose the header row: Tabs (tabs5)
  const headerRow = ['Tabs (tabs5)'];

  // Compose the tab label row: one cell for each label, bolded (strong)
  const tabLabelRow = [];
  for (let i = 0; i < numTabs; i++) {
    const strong = document.createElement('strong');
    strong.textContent = tabLabels[i].textContent.trim();
    tabLabelRow.push(strong);
  }

  // Compose the tab content row: one cell for each panel, containing its content
  const tabContentRow = [];
  for (let i = 0; i < numTabs; i++) {
    const panel = tabPanels[i];
    // Try to find the main content wrapper
    // Typically: .contentfragment > article, fallback to panel
    let contentRoot = panel.querySelector('.contentfragment > article') ||
      panel.querySelector('.contentfragment') ||
      panel;
    // Get all meaningful children (skip blank text nodes and empty grid divs)
    let nodes = Array.from(contentRoot.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('aem-Grid')) {
        return false;
      }
      // Also skip empty Divs
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV' && node.childNodes.length === 0) {
        return false;
      }
      return true;
    });
    // If only one node, use it directly; else, use as array
    if (nodes.length === 1) {
      tabContentRow.push(nodes[0]);
    } else {
      tabContentRow.push(nodes);
    }
  }

  // Create the table as described: header row, labels row, content row
  const cells = [
    headerRow,
    tabLabelRow,
    tabContentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(table);
}
