/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Accordion (accordion33)'];
  const rows = [headerRow];

  // Find the main article content block to process for accordion sections
  const mainContent = element.querySelector('main.container.responsivegrid.aem-GridColumn--tablet--12');
  if (!mainContent) return;
  // Find contentfragment article
  const cfArticle = mainContent.querySelector('article.contentfragment article.cmp-contentfragment');
  if (!cfArticle) return;
  // Find the contentfragment elements (contains the main body)
  const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Helper: Get all child nodes, preserving order
  const nodes = Array.from(cfElements.childNodes);

  // Only h2 sections are valid accordion items; intro before first h2 is not part of accordion
  let i = 0;
  while (i < nodes.length) {
    // Find next h2 as section title
    while (i < nodes.length && !(nodes[i].tagName && nodes[i].tagName.toLowerCase() === 'h2')) {
      i++;
    }
    if (i >= nodes.length) break;
    const titleNode = nodes[i];
    i++;
    // Gather content for this section until next h2
    const sectionContent = [];
    while (i < nodes.length && !(nodes[i].tagName && nodes[i].tagName.toLowerCase() === 'h2')) {
      // Filter out empty grid divs and empty text nodes
      if (
        nodes[i].nodeType === 3 && nodes[i].textContent.trim() === ''
      ) {
        i++; continue;
      }
      if (
        nodes[i].tagName === 'DIV' &&
        nodes[i].classList.contains('aem-Grid') &&
        nodes[i].children.length === 0
      ) {
        i++; continue;
      }
      sectionContent.push(nodes[i]);
      i++;
    }
    // If we found real content, add accordion row
    if (sectionContent.length > 0) {
      rows.push([
        titleNode,
        sectionContent.length === 1 ? sectionContent[0] : sectionContent
      ]);
    }
  }

  // Only build the table if we have at least a header and one item
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
