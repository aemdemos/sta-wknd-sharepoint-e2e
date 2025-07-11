/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block in the provided element
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Step 1: Extract tab labels
  const tabLabelEls = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]'));
  if (!tabLabelEls.length) return;
  // Step 2: Extract tab panels (content)
  const tabPanelEls = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));
  if (!tabPanelEls.length) return;
  // Defensive: skip if mismatch count
  if (tabLabelEls.length !== tabPanelEls.length) return;

  // The header row for the block
  const headerRow = ['Tabs (tabs23)'];

  // The tab label row (one cell per label, always <strong>)
  const tabLabelRow = tabLabelEls.map(tabEl => {
    const strong = document.createElement('strong');
    strong.textContent = tabEl.textContent.trim();
    return strong;
  });

  // The tab content row (one cell per tab panel)
  const contentRow = tabPanelEls.map(tabPanelEl => {
    // Prefer to grab the main .contentfragment (article) inside each tab panel
    const article = tabPanelEl.querySelector('article');
    let tabContent;
    if (article) {
      tabContent = article; // Use the entire article (including all headings, images, etc.)
    } else {
      // Fallback: use all children of tabPanelEl
      const div = document.createElement('div');
      Array.from(tabPanelEl.childNodes).forEach(node => {
        // Only append non-empty nodes
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)) {
          div.appendChild(node);
        }
      });
      tabContent = div;
    }
    return tabContent;
  });

  // Compose final cells array
  const cells = [
    headerRow,
    tabLabelRow,
    contentRow
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  
  // Replace cmpTabs block with the new block table
  cmpTabs.replaceWith(block);
}
