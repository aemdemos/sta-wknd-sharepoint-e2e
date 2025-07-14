/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the current element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels and panels
  const tabLabels = Array.from(tabs.querySelectorAll('[role="tab"]'));
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Prepare the table array
  const cells = [];
  // The header row must match the example: Tabs (tabs3)
  cells.push(['Tabs (tabs3)']);

  // Helper: for each tab, find the corresponding panel by aria-labelledby
  for (let i = 0; i < tabLabels.length; i++) {
    const labelText = tabLabels[i].textContent.trim();
    const tabId = tabLabels[i].id;
    let panel = tabPanels.find(p => p.getAttribute('aria-labelledby') === tabId);
    if (!panel) {
      // fallback to index if not found by id
      panel = tabPanels[i];
    }
    // Find the main content node inside the panel to accurately reflect tab content
    // Use the existing panel's content node (not a clone)
    let content = null;
    // Prefer the .contentfragment or .cmp-contentfragment (most content is inside)
    let cf = panel && (panel.querySelector('.contentfragment') || panel.querySelector('.cmp-contentfragment'));
    if (cf) {
      // Get the .cmp-contentfragment__elements if present, else the content fragment
      const elements = cf.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        content = elements;
      } else {
        content = cf;
      }
    } else if(panel) {
      // fallback: use the panel content itself, but only its children
      if(panel.children.length === 1) {
        // use the sole child
        content = panel.children[0];
      } else {
        // use a fragment containing all children
        const frag = document.createDocumentFragment();
        Array.from(panel.childNodes).forEach(n => frag.appendChild(n));
        content = frag;
      }
    }
    cells.push([labelText, content]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the new table
  tabs.replaceWith(table);
}
