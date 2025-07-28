/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block (cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist (li elements)
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll('li'));

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: skip if no tabs or panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Header row as in the example (single cell)
  const headerRow = ['Tabs (tabs37)'];
  const cells = [headerRow];

  // For each tab, create a row with two cells: label and content
  tabLabels.forEach((tabLabel, idx) => {
    const label = tabLabel.textContent.trim();
    let panel = tabPanels[idx] || null;
    let tabContent = null;
    if (panel) {
      // Prefer .contentfragment > article > .cmp-contentfragment__elements as main content
      let mainContent = null;
      const article = panel.querySelector('article');
      if (article) {
        // Try to find cmp-contentfragment__elements inside the article
        const elementsContainer = article.querySelector('.cmp-contentfragment__elements');
        if (elementsContainer) {
          // Sometimes the container has only one significant child
          // We'll collect all non-empty direct children
          const candidates = Array.from(elementsContainer.children).filter(child => {
            // Exclude divs that are just grid wrappers with no real content
            if (child.classList.contains('aem-Grid')) {
              // only count if contains more than just empty divs
              return Array.from(child.querySelectorAll('*')).some(e => e.textContent.trim());
            }
            return child.textContent.trim();
          });
          if (candidates.length === 1) {
            mainContent = candidates[0];
          } else if (candidates.length > 1) {
            // Create a fragment to append all significant children
            const frag = document.createDocumentFragment();
            candidates.forEach(child => frag.appendChild(child));
            mainContent = frag;
          } else {
            // fallback: use the whole elementsContainer
            mainContent = elementsContainer;
          }
        } else {
          // Fallback: use the whole article
          mainContent = article;
        }
      } else {
        // fallback: just use the panel's children
        const frag = document.createDocumentFragment();
        Array.from(panel.childNodes).forEach(node => frag.appendChild(node));
        mainContent = frag;
      }
      tabContent = mainContent;
    } else {
      tabContent = document.createTextNode('');
    }
    cells.push([label, tabContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
