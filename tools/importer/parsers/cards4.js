/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process the main magazine block
  if (!element || !document) return;

  // Find the 'Featured Article' teaser
  const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured .cmp-teaser');

  // Find the image-list block (All Articles)
  const imageList = element.querySelector('.image-list .cmp-image-list');

  // Find the two secure teasers (Members Only cards)
  const secureTeasers = Array.from(element.querySelectorAll('.teaser.cmp-teaser--list.cmp-teaser--secure .cmp-teaser'));

  // Helper to extract card content from a teaser block
  function extractTeaserCard(teaser) {
    if (!teaser) return [null, null];
    // Image
    const imageDiv = teaser.querySelector('.cmp-teaser__image .cmp-image');
    let img = imageDiv ? imageDiv.querySelector('img') : null;
    // Text
    const contentDiv = teaser.querySelector('.cmp-teaser__content');
    let textContent = [];
    // Pretitle (optional)
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textContent.push(pretitle);
    // Title (h2)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) textContent.push(title);
    // Description
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) textContent.push(desc);
    // CTA (action link)
    const action = contentDiv.querySelector('.cmp-teaser__action-link');
    if (action) textContent.push(action);
    else {
      // Sometimes CTA is just text
      const actionContainer = contentDiv.querySelector('.cmp-teaser__action-container');
      if (actionContainer && actionContainer.textContent.trim()) {
        // Make a button if it looks like a CTA
        const btn = document.createElement('span');
        btn.textContent = actionContainer.textContent.trim();
        textContent.push(btn);
      }
    }
    return [img, textContent];
  }

  // Helper to extract card content from image-list li
  function extractImageListCard(li) {
    if (!li) return [null, null];
    const article = li.querySelector('article');
    // Image
    let img = article.querySelector('.cmp-image-list__item-image img');
    // Text
    let textContent = [];
    // Title (linked)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) textContent.push(titleLink);
    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc) textContent.push(desc);
    return [img, textContent];
  }

  // Compose the table rows
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Featured Article card
  if (featuredTeaser) {
    const [img, textContent] = extractTeaserCard(featuredTeaser);
    rows.push([
      img,
      textContent
    ]);
  }

  // All Articles cards
  if (imageList) {
    const lis = Array.from(imageList.querySelectorAll(':scope > li'));
    lis.forEach(li => {
      const [img, textContent] = extractImageListCard(li);
      rows.push([
        img,
        textContent
      ]);
    });
  }

  // Members Only cards (secure teasers)
  secureTeasers.forEach(teaser => {
    const [img, textContent] = extractTeaserCard(teaser);
    rows.push([
      img,
      textContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
