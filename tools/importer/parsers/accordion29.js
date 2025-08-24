/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion Block Table for Accordion (accordion29)
  // Header row: Exactly matches the required name
  const headerRow = ['Accordion (accordion29)'];

  // Prepare rows for the accordion block
  // Each row: [Title, Content]
  const rows = [];

  // Find all direct children (accordion items)
  // For robustness: look for a collection of immediate children that are NOT style/layout wrappers
  // We'll look for possible containers and treat each as a possible accordion item
  const directChildren = Array.from(element.querySelectorAll(':scope > *'));

  directChildren.forEach((child) => {
    // For each child, try to find a title and content
    // Title: The first element or text node that looks like a heading, bold, or summary
    // Content: The rest
    // This covers examples like <div><div>Title</div><div>Content</div></div>
    let title = null;
    let content = null;
    // If child has only 2 children, treat those as title/content
    const subChildren = Array.from(child.children);
    if (subChildren.length === 2) {
      title = subChildren[0];
      content = subChildren[1];
    } else {
      // Try to find a heading or summary for title
      title = child.querySelector(
        ':scope > .accordion-title, :scope > .cmp-accordion__title, :scope > .cmp-accordion__header, :scope > summary, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > b, :scope > strong'
      );
      // If not found, fallback to first child or first text node
      if (!title && child.childNodes.length > 0) {
        // Find a text node
        title = Array.from(child.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
        // If still not found, fallback to first element
        if (!title) {
          title = child.children[0];
        }
      }
      // Content: all other nodes except title
      const filtered = Array.from(child.childNodes).filter(n => n !== title && (n.nodeType !== Node.TEXT_NODE || n.textContent.trim() !== ''));
      if (filtered.length === 1) {
        content = filtered[0];
      } else if (filtered.length > 1) {
        content = filtered;
      } else {
        // If no content found, fallback to the child itself (if it has inner HTML)
        if (!title && child.innerHTML.trim()) {
          content = child;
        }
      }
    }
    // If both title and content are found and title is not empty
    if (title && content && (
      (title.nodeType === Node.ELEMENT_NODE && title.textContent.trim()) ||
      (title.nodeType === Node.TEXT_NODE && title.textContent.trim())
    )) {
      rows.push([title, content]);
    }
  });

  // Edge case: If no rows found, fallback to children with text nodes (for resilience)
  if (rows.length === 0) {
    directChildren.forEach((child) => {
      if (child.textContent && child.textContent.trim()) {
        rows.push([child.textContent.trim(), '']);
      }
    });
  }

  // Final fallback: If still nothing, do not create a block
  if (rows.length === 0) return;

  // Compose the full table (header + rows)
  const tableCells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
