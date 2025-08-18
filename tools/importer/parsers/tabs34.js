/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find all tab labels (li elements)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Find all tab panels (in DOM order)
  const tabPanels = Array.from(
    tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Header row as specified
  const headerRow = ['Tabs (tabs34)'];

  // Compose tab rows
  const tabRows = tabLabels.map((tabLabel, i) => {
    // Tab label text
    const label = tabLabel.textContent.trim();
    // Corresponding tab panel
    const panel = tabPanels[i];
    let content;
    if (panel) {
      // Find .contentfragment or article or .cmp-contentfragment
      const frag = panel.querySelector('.contentfragment, .cmp-contentfragment, article');
      if (frag) {
        content = frag;
      } else {
        // Fallback: collect all non-empty children
        const children = Array.from(panel.childNodes).filter(n =>
          n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim() !== '')
        );
        if (children.length === 1) {
          content = children[0];
        } else if (children.length > 1) {
          content = children;
        } else {
          // Fallback to text if nothing else
          content = document.createTextNode(panel.textContent.trim());
        }
      }
    } else {
      // No panel for this tab
      content = '';
    }
    return [label, content];
  });

  // Build cells for block table
  const cells = [headerRow, ...tabRows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace tabs block in DOM
  tabs.replaceWith(block);
}
