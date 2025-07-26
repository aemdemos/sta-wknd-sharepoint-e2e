/* global WebImporter */
export default function parse(element, { document }) {
  // Find all accordion items: each as a row with 2 cells: [title, content]
  // The structure is implied by the Markdown example, not explicit in the HTML,
  // so we must use the provided HTML's content and headings for section logic.

  // We'll search for a sequence of accordion items: these consist of a heading (or question)
  // and a content body, possibly with formatting or links.
  // We'll look for h2/h3/h4/h5/h6 or <p> with a question mark at the end, then their content.

  // For demonstration, let's look for a plausible matching pattern in the provided HTML.
  // Since the example in the prompt is not in the given HTML, but instead a generic accordion FAQ,
  // we must generalize the parser for an FAQ structure (for the Accordion block type),
  // so this code is reusable for any similar FAQ/Accordion HTML snippet.

  const headerRow = ['Accordion (accordion31)'];
  const rows = [headerRow];

  // Find all direct children that might be accordion items
  // Accept headings (h1-h6) or <p> that look like questions, as title cell
  const children = Array.from(element.children);
  let i = 0;
  while (i < children.length) {
    const el = children[i];

    // Accept as accordion title: <p> ending with ?, or heading
    let isQuestion = false;
    let titleElement = null;
    if (/^H[1-6]$/.test(el.tagName)) {
      titleElement = el;
      isQuestion = true;
    } else if (el.tagName === 'P' && el.textContent.trim().endsWith('?')) {
      titleElement = el;
      isQuestion = true;
    }
    if (isQuestion && titleElement) {
      // Next sibling(s) up to next question/heading is content
      const contentElements = [];
      let j = i + 1;
      while (j < children.length) {
        const next = children[j];
        // Stop at next question/heading
        if (/^H[1-6]$/.test(next.tagName) || (next.tagName === 'P' && next.textContent.trim().endsWith('?'))) {
          break;
        }
        contentElements.push(next);
        j++;
      }
      rows.push([
        titleElement,
        contentElements.length === 1 ? contentElements[0] : contentElements
      ]);
      i = j;
    } else {
      i++;
    }
  }

  // If not found, fallback: look for FAQ-like .accordion-item or similar
  if (rows.length === 1) {
    // Try .accordion-item
    const items = element.querySelectorAll('.accordion-item');
    items.forEach(item => {
      const title = item.querySelector('.accordion-title, .faq-question, h3, h4, h5, h6, p');
      const content = item.querySelector('.accordion-content, .faq-answer, .answer, .content, div, p');
      if (title && content) {
        rows.push([title, content]);
      }
    });
  }

  // As a last fallback, if no dynamic rows found, do nothing
  if (rows.length === 1) return;

  // Create and replace with accordion table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
