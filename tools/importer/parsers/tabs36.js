/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element by class
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from tablist (in order)
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }
  if (!tabLabels.length) return;

  // Get tab panels (in order)
  const tabPanels = tabsBlock.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]');
  if (!tabPanels.length) return;

  // Header row from spec
  const headerRow = ['Tabs (tabs36)'];
  const cells = [headerRow];

  // Tab labels row, each formatted as a bold span
  const labelRow = tabLabels.map(label => {
    const span = document.createElement('span');
    span.textContent = label;
    span.style.fontWeight = 'bold';
    return span;
  });
  cells.push(labelRow);

  // Tab content row, each cell is the content for the corresponding tab
  const contentRow = [];
  tabPanels.forEach(panel => {
    // Reference the direct contentfragment/article (not clone)
    let content;
    const fragment = panel.querySelector('.cmp-contentfragment');
    if (fragment) {
      // Skip any h3 title within fragment
      const fragmentParts = [];
      Array.from(fragment.children).forEach(child => {
        if (child.tagName.toLowerCase() === 'h3') return;
        fragmentParts.push(child);
      });
      if (fragmentParts.length === 1) {
        content = fragmentParts[0];
      } else if (fragmentParts.length > 1) {
        content = document.createElement('div');
        fragmentParts.forEach(part => content.appendChild(part));
      }
    } 
    if (!content) {
      // If no contentfragment, use panel's children
      if (panel.children.length) {
        if (panel.children.length === 1) {
          content = panel.children[0];
        } else {
          content = document.createElement('div');
          Array.from(panel.children).forEach(child => content.appendChild(child));
        }
      } else {
        // fallback to panel innerText if truly empty
        content = document.createElement('div');
        content.textContent = panel.textContent;
      }
    }
    contentRow.push(content);
  });
  cells.push(contentRow);

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(block);
}
