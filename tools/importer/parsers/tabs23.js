/* global WebImporter */
export default function parse(element, { document }) {
  // Define header row as in the example
  const headerRow = ['Tabs (tabs23)'];

  // Find the tabs block in the element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels
  const tabLabels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get panels (tab contents)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Only keep panels that have a corresponding label (edge case handling)
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    // Tab label
    const label = tabLabels[i].textContent.trim();
    // Tab panel content
    // Try to get the main contentfragment, fallback to entire panel if needed
    let tabContent = null;
    const contentFrag = tabPanels[i].querySelector('.contentfragment');
    if (contentFrag) {
      tabContent = contentFrag;
    } else {
      // fallback: use all children in panel
      // If there's more than just whitespace, use content
      if (tabPanels[i].children.length > 0) {
        tabContent = document.createElement('div');
        Array.from(tabPanels[i].childNodes).forEach(node => tabContent.appendChild(node));
      } else {
        tabContent = document.createTextNode(tabPanels[i].textContent.trim());
      }
    }
    rows.push([label, tabContent]);
  }

  // Create and replace the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.parentNode.replaceChild(block, element);
}
