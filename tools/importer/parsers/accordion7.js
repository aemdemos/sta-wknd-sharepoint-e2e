/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: 2 columns, multiple rows, each row = [title, content]
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Find the main contentfragment/article that contains the surf spots
  const cf = element.querySelector('.cmp-contentfragment');
  if (!cf) return;

  // Get the container with the surf spots content (inside .cmp-contentfragment__elements)
  const cfEls = cf.querySelector('.cmp-contentfragment__elements');
  if (!cfEls) return;

  // We'll build a list of accordion items: each with a title and content
  // The pattern is: h2 (title), then everything until the next h2 is content
  let currentTitle = null;
  let currentContent = [];
  const children = Array.from(cfEls.children);

  // Helper to push an accordion row if valid
  function pushAccordionRow(titleEl, contentEls) {
    if (!titleEl || contentEls.length === 0) return;
    // Title cell: use textContent only (not the element)
    const titleCell = titleEl.textContent.trim();
    // Content cell: group all content elements in a div
    const contentDiv = document.createElement('div');
    contentEls.forEach((el) => contentDiv.appendChild(el));
    rows.push([titleCell, contentDiv]);
  }

  for (let i = 0; i < children.length; i++) {
    const el = children[i];
    if (el.tagName === 'H2') {
      pushAccordionRow(currentTitle, currentContent);
      currentTitle = el;
      currentContent = [];
    } else {
      // Only skip empty grids (DIVs with no meaningful children)
      if (
        el.tagName === 'DIV' &&
        el.children.length === 1 &&
        el.children[0].classList.contains('aem-Grid') &&
        el.children[0].children.length === 0
      ) {
        continue;
      }
      currentContent.push(el);
    }
  }
  // Push the last item
  pushAccordionRow(currentTitle, currentContent);

  // Only output if there is at least one accordion row
  if (rows.length === 1) return;

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
