/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels and tab panels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tab'));
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs14)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: Find the main content fragment/article inside the panel
    let tabContent = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;

    // Create a fragment and append meaningful children
    const frag = document.createDocumentFragment();
    Array.from(tabContent.children).forEach(child => {
      // Skip empty grid divs
      if (child.classList && child.classList.contains('aem-Grid')) return;
      // Skip empty wrappers
      if (child.childNodes.length === 0 && child.textContent.trim() === '') return;
      frag.appendChild(child);
    });

    // If fragment is empty, fallback to tabContent itself
    const contentCell = frag.childNodes.length ? frag : tabContent;
    rows.push([label, contentCell]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
