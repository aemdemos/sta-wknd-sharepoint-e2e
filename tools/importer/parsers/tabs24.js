/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs component
  const tabsCmp = element.querySelector('.cmp-tabs');
  if (!tabsCmp) return;

  // Find the tab labels in order
  const tabLabels = [];
  const tablist = tabsCmp.querySelector('ol[role=tablist]');
  if (tablist) {
    tablist.querySelectorAll('li[role=tab]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Find all tabpanels in the correct order
  const tabPanels = [];
  tabLabels.forEach((label) => {
    const li = Array.from(tablist.querySelectorAll('li[role=tab]')).find(
      el => el.textContent.trim() === label
    );
    if (li) {
      const controls = li.getAttribute('aria-controls');
      if (controls) {
        const panel = tabsCmp.querySelector(`#${controls}`);
        if (panel) tabPanels.push(panel);
      }
    }
  });

  // Prepare the rows: first row is a single header cell, others are two columns
  const rows = [ ['Tabs (tabs24)'] ];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Try to reference the contentfragment's elements block
      let contentFragment = panel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        let elements = contentFragment.querySelector('.cmp-contentfragment__elements');
        if (elements) {
          // Remove structural wrappers and grid artifacts
          const fragment = document.createDocumentFragment();
          Array.from(elements.children).forEach(child => {
            if (
              child.classList && (
                child.classList.contains('aem-Grid') ||
                child.classList.contains('aem-Grid--12') ||
                child.classList.contains('aem-Grid--default--12')
              )
            ) {
              return;
            }
            if (child.tagName === 'DIV' && child.children.length === 1 && child.firstElementChild.classList && child.firstElementChild.classList.contains('aem-Grid')) {
              return;
            }
            fragment.appendChild(child);
          });
          if (fragment.childNodes.length > 0) {
            contentCell = Array.from(fragment.childNodes);
          } else {
            contentCell = Array.from(elements.childNodes);
          }
        } else {
          contentCell = [contentFragment];
        }
      } else {
        // fallback: use all children of panel
        contentCell = Array.from(panel.childNodes);
      }
    }
    rows.push([label, contentCell]);
  }
  // Create and insert the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
