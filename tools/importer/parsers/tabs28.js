/* global WebImporter */
export default function parse(element, { document }) {
  // Find the correct cmp-tabs root
  let tabsEl = element;
  if (!tabsEl.classList.contains('cmp-tabs')) {
    tabsEl = element.querySelector('.cmp-tabs');
    if (!tabsEl) return;
  }
  // Extract tab labels in order
  const tabLabels = Array.from(
    tabsEl.querySelectorAll('.cmp-tabs__tablist li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Extract tab panel elements in order
  const tabPanels = Array.from(
    tabsEl.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Guard: skip if mismatch
  if (tabLabels.length !== tabPanels.length) return;

  // Compose rows for the table
  const rows = [['Tabs (tabs28)']];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Get all meaningful children inside panel
    // Find the first child .contentfragment or .cmp-contentfragment or article if present, else fallback to all children
    let contentEl = null;
    let main = panel.querySelector('article.cmp-contentfragment, .contentfragment, .cmp-contentfragment');
    if (main) {
      // Use the elements section if present (contains main content)
      let elSection = main.querySelector('.cmp-contentfragment__elements');
      if (elSection && elSection.children.length > 0) {
        // If there's only one div direct child, unwrap it
        if (
          elSection.children.length === 1 &&
          elSection.children[0].tagName === 'DIV' &&
          elSection.children[0].children.length > 0
        ) {
          // If that DIV has multiple children, use those
          const frag = document.createElement('div');
          Array.from(elSection.children[0].children).forEach(child => frag.appendChild(child));
          contentEl = frag;
        } else {
          contentEl = elSection;
        }
      } else {
        contentEl = main;
      }
    } else {
      // fallback: use all children of panel
      // Remove script/style and empty text nodes
      const frag = document.createElement('div');
      Array.from(panel.childNodes).forEach(n => {
        if (
          n.nodeType === Node.ELEMENT_NODE &&
          n.tagName !== 'SCRIPT' &&
          n.tagName !== 'STYLE'
        ) {
          frag.appendChild(n);
        } else if (n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== '') {
          frag.appendChild(document.createTextNode(n.textContent));
        }
      });
      contentEl = frag;
    }
    // As per requirements, use direct reference
    rows.push([label, contentEl]);
  }
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
