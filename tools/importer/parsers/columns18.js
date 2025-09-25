/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: flatten and clean column content for block (no nested blocks)
  function flattenContent(nodes) {
    const result = [];
    nodes.forEach(node => {
      // Only keep content elements: images, headings, paragraphs, blockquotes, lists, hr (if needed), links
      if (node.nodeType === 1) {
        // Remove grid/layout/container/experiencefragment/contentfragment wrappers
        if (
          node.classList.contains('aem-Grid') ||
          node.classList.contains('cmp-container') ||
          node.classList.contains('responsivegrid') ||
          node.classList.contains('experiencefragment') ||
          node.classList.contains('cmp-experiencefragment') ||
          node.classList.contains('contentfragment') ||
          node.classList.contains('cmp-contentfragment')
        ) {
          // Recursively flatten children
          result.push(...flattenContent(Array.from(node.children)));
        } else {
          // Only keep allowed content
          if (
            node.matches('img, h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote, hr, a, figure, figcaption')
          ) {
            result.push(node.cloneNode(true));
          } else {
            // For divs/spans, flatten their children
            if (node.matches('div, span')) {
              result.push(...flattenContent(Array.from(node.children)));
            }
          }
        }
      } else if (node.nodeType === 3) {
        // Text node: only if not whitespace
        if (node.textContent.trim()) {
          result.push(document.createTextNode(node.textContent));
        }
      }
    });
    return result;
  }

  // Header row
  const headerRow = ['Columns (columns18)'];

  // Find main content and sidebar columns
  const mainCol = element.querySelector('main.container.aem-GridColumn--default--8');
  const sidebarCol = element.querySelector('aside.container.cmp-layoutcontainer--sidebar');

  // Compose columns: flatten and clean content
  const columns = [];
  if (mainCol) {
    const mainContent = flattenContent(Array.from(mainCol.children));
    if (mainContent.length > 0) columns.push(mainContent);
  }
  if (sidebarCol) {
    const sidebarContent = flattenContent(Array.from(sidebarCol.children));
    if (sidebarContent.length > 0) columns.push(sidebarContent);
  }

  // Fallback: if no columns found, try top-level main/aside
  if (columns.length === 0) {
    const fallbackMain = element.querySelector('main.container .cmp-container');
    if (fallbackMain) {
      const mainContent = flattenContent(Array.from(fallbackMain.children));
      if (mainContent.length > 0) columns.push(mainContent);
    }
    const fallbackSidebar = element.querySelector('aside.container .cmp-container');
    if (fallbackSidebar) {
      const sidebarContent = flattenContent(Array.from(fallbackSidebar.children));
      if (sidebarContent.length > 0) columns.push(sidebarContent);
    }
  }

  // Only build a row with as many columns as have content (no empty columns)
  if (columns.length === 0) return;
  const cells = [headerRow, columns];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
