/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels (li elements inside ol.cmp-tabs__tablist)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  );

  // Get the tabpanel divs (content for each tab)
  const tabPanels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Sanity check: number of labels and tabpanels should match
  if (tabLabels.length !== tabPanels.length) {
    return;
  }

  // Compose header row: block name and variant
  const headerRow = ['Tabs (tabs31)'];

  // Each row: [tab label, tab content]
  const rows = tabLabels.map((tabLabel, idx) => {
    // Tab label text (preserve formatting if present)
    let label = '';
    if (tabLabel.childNodes.length === 1 && tabLabel.childNodes[0].nodeType === Node.TEXT_NODE) {
      label = tabLabel.textContent.trim();
    } else {
      // If label contains formatting, move all children
      const labelFragment = document.createDocumentFragment();
      Array.from(tabLabel.childNodes).forEach((child) => {
        labelFragment.appendChild(child);
      });
      label = labelFragment;
    }

    // Tab content element (the tabpanel)
    const contentPanel = tabPanels[idx];
    // We'll want the content from inside the tabpanel, not the panel container itself.
    // Reference the first child (should be .contentfragment)
    let content = null;
    if (contentPanel.childNodes.length === 1 && contentPanel.firstElementChild) {
      content = contentPanel.firstElementChild;
    } else {
      // If contentPanel has more than one node, reference all children as an array
      content = Array.from(contentPanel.childNodes).filter(
        node => node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')
      );
    }
    return [label, content];
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
