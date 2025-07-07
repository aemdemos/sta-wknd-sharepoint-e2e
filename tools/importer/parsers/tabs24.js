/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs component inside element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get all tab labels (tab <li> elements)
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li')) : [];

  // Get all tab panels
  const tabPanels = Array.from(tabsEl.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));
  if (tabLabelEls.length !== tabPanels.length || tabLabelEls.length === 0) return;

  // Compose the header row exactly as required
  const headerRow = ['Tabs (tabs24)'];

  // Each tab row is: [Tab Label, Tab Contents]
  const tabRows = tabLabelEls.map((tabLabelEl, i) => {
    const tabLabel = tabLabelEl.textContent.trim();
    const tabPanel = tabPanels[i];
    // Get the first .cmp-contentfragment, else fall back to all children
    let contentElement;
    const cf = tabPanel.querySelector('.cmp-contentfragment');
    if (cf) {
      // Find the .cmp-contentfragment__elements container in cf
      const cfElements = cf.querySelector('.cmp-contentfragment__elements');
      if (cfElements) {
        // Create a fragment to hold useful content
        const frag = document.createDocumentFragment();
        // Extract only non-structural children (skip empty grids etc)
        Array.from(cfElements.children).forEach(child => {
          // Skip .aem-Grid wrappers (layout only, always empty)
          if (child.classList.contains('aem-Grid')) return;
          // For <div>s, check if only child is .aem-Grid and empty, skip
          if (
            child.tagName === 'DIV' &&
            child.children.length === 1 &&
            child.firstElementChild &&
            child.firstElementChild.classList.contains('aem-Grid')
          ) {
            return;
          }
          frag.appendChild(child);
        });
        // If fragment is empty, fallback to cfElements textContent
        if (!frag.childNodes.length) {
          const span = document.createElement('span');
          span.textContent = cfElements.textContent;
          contentElement = span;
        } else {
          // If fragment only has one node, use it directly
          if (frag.childNodes.length === 1) {
            contentElement = frag.firstChild;
          } else {
            // Otherwise, wrap in a <div>
            const div = document.createElement('div');
            div.appendChild(frag);
            contentElement = div;
          }
        }
      } else {
        // If no cfElements, use cf's children
        if (cf.childNodes.length === 1) {
          contentElement = cf.firstChild;
        } else {
          const div = document.createElement('div');
          Array.from(cf.childNodes).forEach(child => div.appendChild(child));
          contentElement = div;
        }
      }
    } else {
      // No .cmp-contentfragment, use tabPanel's children
      if (tabPanel.childNodes.length === 1) {
        contentElement = tabPanel.firstChild;
      } else {
        const div = document.createElement('div');
        Array.from(tabPanel.childNodes).forEach(child => div.appendChild(child));
        contentElement = div;
      }
    }
    return [tabLabel, contentElement];
  });

  // Compose the final cells array
  const cells = [headerRow, ...tabRows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabsEl with the table
  tabsEl.replaceWith(table);
}
