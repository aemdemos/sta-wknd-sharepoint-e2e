/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: extract each section as a row
  // Header row must match block name exactly
  const headerRow = ['Accordion (accordion24)'];
  const rows = [headerRow];

  // Find the main content area (the article)
  const article = element.querySelector('article.contentfragment');
  if (!article) return;

  // Find all h2 headings (accordion item titles)
  const sectionHeadings = article.querySelectorAll('h2');

  sectionHeadings.forEach((heading) => {
    // Title cell: reference the heading element
    const titleCell = heading;
    const contentElements = [];
    let sibling = heading.nextElementSibling;
    while (sibling && sibling.tagName !== 'H2') {
      // Collect all content until next h2
      // Collect everything: paragraphs, images, blockquotes, quotes, divs, etc.
      if (sibling.tagName === 'P' || sibling.tagName === 'IMG' || sibling.tagName === 'BLOCKQUOTE') {
        contentElements.push(sibling);
      } else if (sibling.tagName === 'DIV' || sibling.tagName === 'SECTION') {
        // Push the whole block if it's a div/section (to preserve nested structure)
        contentElements.push(sibling);
      } else if (sibling.classList && sibling.classList.contains('cmp-text--quote')) {
        Array.from(sibling.children).forEach(child => contentElements.push(child));
      } else if (sibling.classList && sibling.classList.contains('image')) {
        sibling.querySelectorAll('img').forEach(img => contentElements.push(img));
      }
      sibling = sibling.nextElementSibling;
    }
    // Defensive: if no content, add empty string
    if (contentElements.length === 0) contentElements.push('');
    rows.push([titleCell, contentElements]);
  });

  // Replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
