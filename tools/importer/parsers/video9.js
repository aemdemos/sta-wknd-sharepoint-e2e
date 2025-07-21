/* global WebImporter */
export default function parse(element, { document }) {
  // Collect all child nodes that are visible (element or significant text nodes)
  const content = [];

  element.childNodes.forEach((node) => {
    // Element node
    if (node.nodeType === 1) {
      content.push(node);
    }
    // Text node (non-empty)
    else if (node.nodeType === 3 && node.textContent.trim()) {
      // Wrap the text in a span to keep it as an element (so createTable accepts it)
      const span = document.createElement('span');
      span.textContent = node.textContent;
      content.push(span);
    }
  });

  // If just one element, pass it as a single element, else as array
  const cellContent = content.length === 1 ? content[0] : content;
  const cells = [
    ['Video'],
    [cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
