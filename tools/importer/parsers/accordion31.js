/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block expects: header row, then 2 columns: title, content
  const headerRow = ['Accordion (accordion31)', ''];
  const rows = [];

  // Edge case: If element is empty, do nothing
  if (!element || !element.children || element.children.length === 0) return;

  // Get all direct children that could be accordion rows
  // We'll use :scope > div for robustness
  const childDivs = Array.from(element.querySelectorAll(':scope > div'));

  // For a typical accordion, each row is a div with 2 direct children:
  //  - the title (e.g. a <div> or <span> or <p>, often with question text)
  //  - the content (e.g. a <div>, <p>, <ul>, etc.)
  for (const div of childDivs) {
    // Get all element children
    const children = Array.from(div.children).filter(e => e.nodeType === 1);
    if (children.length === 2) {
      // Usual case: first is title, second is content
      rows.push([children[0], children[1]]);
      continue;
    }
    // Fallback: if only 1 child, maybe text node is used for title, rest is content
    if (children.length === 1) {
      // If first child is a heading or strong/b, treat as title
      const titleCandidate = children[0].matches('h1, h2, h3, h4, h5, h6, strong, b, .accordion-title')
        ? children[0]
        : null;
      if (titleCandidate) {
        // Content: rest of div excluding the title
        const contentEls = Array.from(div.childNodes).filter(
          n => n !== titleCandidate && (n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()))
        );
        // If contentEls array is not empty, use it
        if (contentEls.length) {
          rows.push([titleCandidate, contentEls]);
        }
      }
    }
    // Fallback: if no element children but div has text, treat first part as title
    if (children.length === 0 && div.textContent.trim()) {
      // Try to get first text node as the title, rest as content
      const textNodes = Array.from(div.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim());
      if (textNodes.length) {
        const titleText = document.createElement('span');
        titleText.textContent = textNodes[0].textContent.trim();
        const restNodes = Array.from(div.childNodes).filter((n, i) => i !== 0 && (n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())));
        rows.push([titleText, restNodes]);
      }
    }
  }

  // If no rows found, try generic fallback: treat every two child elements as one row (title, content)
  if (rows.length === 0) {
    const directChildren = Array.from(element.children).filter(e => e.nodeType === 1);
    for (let i = 0; i < directChildren.length - 1; i += 2) {
      rows.push([directChildren[i], directChildren[i + 1]]);
    }
  }

  // Final fallback: if only one column, treat each child as a single row with two columns: title (text), empty content
  if (rows.length === 0) {
    const directChildren = Array.from(element.children).filter(e => e.nodeType === 1);
    for (const child of directChildren) {
      rows.push([child, '']);
    }
  }

  // If still no rows, abort
  if (rows.length === 0) return;

  // Compose the cells array
  // Ensure we always have exactly 2 columns per row
  const cells = [headerRow, ...rows.map(row => {
    // Defensive: Make sure every row is an array of 2 items
    if (!Array.isArray(row)) return ['', ''];
    if (row.length === 2) return row;
    if (row.length === 1) return [row[0], ''];
    // If more than 2, join extra elements into content cell
    return [row[0], row.slice(1)];
  })];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}