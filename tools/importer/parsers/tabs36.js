/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li')).map(li => li.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    if (!panel) return;

    // Find the contentfragment inside the panel
    const cf = panel.querySelector('.cmp-contentfragment');
    let tabContent = [];
    if (cf) {
      // Find the main content area inside contentfragment
      const elementsRoot = cf.querySelector('.cmp-contentfragment__elements');
      if (elementsRoot) {
        // Instead of filtering for specific tags, just collect all content nodes (including text)
        tabContent = Array.from(elementsRoot.childNodes).filter(n => {
          // Include element nodes and text nodes with non-whitespace content
          return (n.nodeType === 1) || (n.nodeType === 3 && n.textContent.trim());
        });
      } else {
        // Fallback: use all children of cf
        tabContent = Array.from(cf.childNodes).filter(n => (n.nodeType === 1) || (n.nodeType === 3 && n.textContent.trim()));
      }
    } else {
      // Fallback: use all children of panel
      tabContent = Array.from(panel.childNodes).filter(n => (n.nodeType === 1) || (n.nodeType === 3 && n.textContent.trim()));
    }
    // Defensive: if no content found, use label only
    if (!tabContent || tabContent.length === 0) {
      tabContent = [document.createTextNode('')];
    }
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
