/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the image-list section for All Articles
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;
  
  // Table structure: header row, then one row per card
  const rows = [['Cards (cards4)']];

  // For each card (li)
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // ----- IMAGE -----
    const img = li.querySelector('img');
    // Reference the real img element or null
    const imageEl = img || '';

    // ----- TEXT CONTENT -----
    const content = li.querySelector('article.cmp-image-list__item-content');
    const textContent = [];
    // Title (linked)
    const titleLink = content && content.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // use the original <a> element, but make it heading-like by wrapping contents in <strong>
      const a = titleLink;
      const span = a.querySelector('.cmp-image-list__item-title');
      if (span) {
        // Remove any children to avoid duplicate text
        while(a.firstChild) a.removeChild(a.firstChild);
        const strong = document.createElement('strong');
        strong.textContent = span.textContent.trim();
        a.appendChild(strong);
        textContent.push(a);
        textContent.push(document.createElement('br'));
      }
    }
    // Description (may exist)
    const desc = content && content.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      textContent.push(document.createTextNode(desc.textContent.trim()));
    }
    // Cards4 block has no CTA in this case

    rows.push([imageEl, textContent]);
  });

  // Create and replace the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  imageList.parentElement.replaceWith(table);
}
