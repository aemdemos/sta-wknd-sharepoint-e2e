/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block: .cmp-tabs inside the provided element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels in order
  const tablist = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll('li'));
  
  // Get the tabpanels in DOM order (these match tab order)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );
  
  // Build the rows array for the block table.
  // First row: header with exact block name as specified
  const rows = [['Tabs (tabs11)']];

  // For each tab, create a row with [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Use the actual <li> element as label for semantic meaning
    // But strip classes to avoid presentational artifacts
    const labelEl = document.createElement('span');
    labelEl.textContent = tabLabels[i].textContent.trim();
    labelEl.style.fontWeight = 'bold';

    // Grab the actual tab panel content (usually a .contentfragment or similar)
    let panelContent = null;
    if (tabPanels[i]) {
      // If there is a <article> inside, use that, otherwise use all children
      const fragment = tabPanels[i].querySelector('article');
      if (fragment) {
        panelContent = fragment;
      } else {
        // If not, grab all children and put into a wrapper
        if (tabPanels[i].children.length > 0) {
          const wrapper = document.createElement('div');
          Array.from(tabPanels[i].children).forEach(child => 
            wrapper.appendChild(child)
          );
          panelContent = wrapper;
        } else {
          // fallback: empty
          panelContent = document.createTextNode('');
        }
      }
    } else {
      // fallback: empty
      panelContent = document.createTextNode('');
    }

    rows.push([
      labelEl,
      panelContent
    ]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element (tabsContainer's parent is tabs block) with the new block
  tabsContainer.replaceWith(block);
}
