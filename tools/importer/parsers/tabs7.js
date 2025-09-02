/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsContainer = element.querySelector('.tabs');
  if (!tabsContainer) return;
  const tabsBlock = tabsContainer.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the list of tab labels (in order)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist [role="tab"]'));
  // Get all tab panel containers (in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare the header row
  const headerRow = ['Tabs (tabs7)']; // Block name, matches example
  const rows = [headerRow];

  // For each tab, add one row with [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    let contentCell = null;
    if (panel) {
      // The content is the .contentfragment/article inside each tabpanel
      const article = panel.querySelector('article');
      if (article) {
        contentCell = article;
      } else {
        // fallback: include everything in the tabpanel
        // If there are multiple children, put them all in an array
        const children = Array.from(panel.childNodes).filter(n => {
          // Only include element nodes (skip empty text nodes)
          return n.nodeType === 1;
        });
        if (children.length === 1) {
          contentCell = children[0];
        } else if (children.length > 1) {
          contentCell = children;
        } else {
          // fallback: include panel itself
          contentCell = panel;
        }
      }
    } else {
      // fallback: just show label
      contentCell = document.createTextNode(label);
    }
    rows.push([label, contentCell]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsContainer.parentNode.replaceChild(block, tabsContainer);
}
