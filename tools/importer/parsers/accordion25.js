/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header (EXACTLY per example)
  const headerRow = ['Accordion (accordion25)', ''];

  // Prepare rows array
  const rows = [];

  // Find all immediate accordion item containers
  // For robustness: look for all immediate children that could represent an accordion item
  const accordionItems = Array.from(element.querySelectorAll(':scope > div'));

  for (const item of accordionItems) {
    // Each item is expected to have a title/question and content.
    // Title: find the first direct child with non-empty text, prioritizing <p>, <b>, <strong>, etc.
    let titleEl = null;
    let contentEls = [];

    const directChildren = Array.from(item.children);

    // Find title: first child with text content (not just whitespace)
    for (const child of directChildren) {
      if (child.textContent && child.textContent.trim().length > 0) {
        titleEl = child;
        break;
      }
    }
    // If none found, fallback to item itself if it has text
    if (!titleEl && item.textContent && item.textContent.trim().length > 0) {
      titleEl = item;
    }
    // If not found, skip this item
    if (!titleEl) continue;

    // Content: all siblings after titleEl
    if (titleEl.parentElement === item) {
      let foundTitle = false;
      for (const child of directChildren) {
        if (child === titleEl) {
          foundTitle = true;
          continue;
        }
        if (foundTitle) {
          contentEls.push(child);
        }
      }
      // If nothing after title, and title is not just a question, treat title as both
      if (contentEls.length === 0) {
        // For some structures, content is part of the title itself
        contentEls = [];
      }
    } else {
      // fallback: use all children except titleEl (if possible)
      contentEls = directChildren.filter((child) => child !== titleEl);
    }

    // If content is empty, provide empty string for second cell
    const contentCell = contentEls.length > 0 ? contentEls : '';

    // Push a row: always two columns
    rows.push([titleEl, contentCell]);
  }

  // If there are no rows, do nothing
  if (rows.length === 0) return;

  // Build accordion table
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);

  // Replace the element with the new block table
  element.replaceWith(table);
}
