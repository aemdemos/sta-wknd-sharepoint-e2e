/* global WebImporter */
export default function parse(element, { document }) {
  // Only proceed if this is a tabs block
  if (!element.classList.contains('tabs')) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs34)'];
  const cells = [headerRow];

  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels
  const tabLabels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const labelText = tabLabels[i].textContent.trim();
    // Find the main content inside the tab panel
    const cf = tabPanels[i].querySelector('.cmp-contentfragment');
    let contentBlock;
    if (cf) {
      // Use only the inner content of the contentfragment
      contentBlock = document.createElement('div');
      Array.from(cf.childNodes).forEach(child => {
        if (!(child.classList && child.classList.contains('cmp-contentfragment__title'))) {
          contentBlock.appendChild(child.cloneNode(true));
        }
      });
    } else {
      // Fallback: clone all children of the tab panel
      contentBlock = document.createElement('div');
      Array.from(tabPanels[i].childNodes).forEach(child => {
        contentBlock.appendChild(child.cloneNode(true));
      });
    }
    cells.push([labelText, contentBlock]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
