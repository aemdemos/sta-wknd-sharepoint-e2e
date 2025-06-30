/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return; // No tabs block found

  // Find all tab labels
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li')
  );
  // Find all tab panels
  const tabPanels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tabpanel')
  );
  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Create the header row (block name)
  const cells = [['Tabs (tabs14)']];

  // For each tab, add a row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const labelText = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Try to reference the innermost .cmp-contentfragment__elements if possible
    let content = null;
    const cfElements = panel.querySelector('.cmp-contentfragment__elements');
    if (cfElements) {
      // Remove empty grid wrappers and empty divs (as they are just layout)
      const cleanFragment = document.createDocumentFragment();
      Array.from(cfElements.childNodes).forEach(node => {
        // Only append if it has meaningful content
        if (
          (node.nodeType === Node.ELEMENT_NODE &&
            (node.textContent.trim() ||
             node.querySelector('img,video,iframe,ul,ol,p,h1,h2,h3,h4,h5,h6')))
        ) {
          cleanFragment.appendChild(node);
        }
      });
      // If we have content, use as content; otherwise, fallback
      if (cleanFragment.childNodes.length > 0) {
        // If only one element, use it directly
        if (cleanFragment.childNodes.length === 1) {
          content = cleanFragment.firstChild;
        } else {
          // Wrap in a div to preserve content
          const wrapper = document.createElement('div');
          wrapper.append(...Array.from(cleanFragment.childNodes));
          content = wrapper;
        }
      }
    }
    if (!content) {
      // Fallback: use everything inside the .cmp-tabs__tabpanel except empty grid wrappers/divs
      const meaningful = [];
      Array.from(panel.children).forEach(child => {
        if (
          (child.textContent.trim() ||
            child.querySelector('img,video,iframe,ul,ol,p,h1,h2,h3,h4,h5,h6'))
        ) {
          meaningful.push(child);
        }
      });
      if (meaningful.length === 1) {
        content = meaningful[0];
      } else if (meaningful.length > 1) {
        const wrapper = document.createElement('div');
        wrapper.append(...meaningful);
        content = wrapper;
      }
    }
    cells.push([
      labelText,
      content || document.createTextNode('') // fallback to blank if no content
    ]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs element with the new block table
  tabs.parentNode.replaceChild(table, tabs);
}
