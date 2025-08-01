/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: safely get an element inside a parent by class
  function getByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList && el.classList.contains(className));
  }

  // Table header as in the example
  const rows = [["Carousel (carousel40)"]];

  // There is one slide in the provided HTML (teaser block), with image and text
  // Extract image (must reference the original img element)
  let imgEl = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    imgEl = teaserImageDiv.querySelector('img');
  }

  // Prepare text cell content as a single <div>, referencing original children where possible
  const cmpContent = element.querySelector('.cmp-teaser__content');
  let textCellContent = '';
  if (cmpContent) {
    const textDiv = document.createElement('div');
    // Add pretitle if present
    const pretitle = cmpContent.querySelector('.cmp-teaser__pretitle');
    if (pretitle) {
      textDiv.appendChild(pretitle);
    }
    // Add title (as heading) if present
    const title = cmpContent.querySelector('.cmp-teaser__title');
    if (title) {
      textDiv.appendChild(title);
    }
    // Add description if present
    const desc = cmpContent.querySelector('.cmp-teaser__description');
    if (desc) {
      textDiv.appendChild(desc);
    }
    // Add CTA (link) if present
    const ctaDiv = cmpContent.querySelector('.cmp-teaser__action-container');
    if (ctaDiv) {
      const link = ctaDiv.querySelector('a');
      if (link) {
        // To keep formatting, wrap CTA link in a <p>
        const p = document.createElement('p');
        p.appendChild(link);
        textDiv.appendChild(p);
      }
    }
    // Only use textDiv if it actually has content
    textCellContent = textDiv.childNodes.length > 0 ? textDiv : '';
  }

  // Add the row: [image, text content]
  rows.push([imgEl, textCellContent]);

  // Create the table block and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
