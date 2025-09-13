/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the image-list block
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;

  // Build header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // For each card (li)
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Defensive: find the article content
    const article = li.querySelector('.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: find the image inside the image-link
    let imageCell = '';
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        const cmpImage = imageDiv.querySelector('.cmp-image');
        if (cmpImage) {
          const img = cmpImage.querySelector('img');
          if (img) {
            imageCell = img;
          }
        }
      }
    }

    // Text cell: title, description, link
    const textCellContent = [];
    // Title
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use the span inside the link as heading
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Wrap in strong for heading effect
        const strong = document.createElement('strong');
        strong.append(titleSpan.textContent);
        textCellContent.push(strong);
      }
    }
    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc) {
      // Add as paragraph
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textCellContent.push(p);
    }
    // CTA (link)
    if (titleLink) {
      // Only add CTA if the link is not just for the image
      // (in this structure, the title link is the CTA)
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read More';
      textCellContent.push(cta);
    }

    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original image-list block
  element.querySelector('.image-list').replaceWith(table);
}
