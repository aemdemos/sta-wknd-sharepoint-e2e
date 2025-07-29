/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the 'All Articles' title to anchor the cards section
  const allArticlesTitle = Array.from(element.querySelectorAll('h2.cmp-title__text'))
    .find(h2 => h2.textContent.trim().toLowerCase() === 'all articles');
  if (!allArticlesTitle) return;
  const allArticlesTitleBlock = allArticlesTitle.closest('.cmp-title')?.parentElement;
  if (!allArticlesTitleBlock) return;

  // 2. Find the image-list block that represents the cards
  let cardsBlock = allArticlesTitleBlock.nextElementSibling;
  while (cardsBlock && !(cardsBlock.classList && cardsBlock.classList.contains('image-list'))) {
    cardsBlock = cardsBlock.nextElementSibling;
  }
  if (!cardsBlock) return;

  // 3. Build the header row (single cell, exact match to example)
  const rows = [['Cards (cards4)']];

  // 4. Extract each card from the image list
  const cards = Array.from(cardsBlock.querySelectorAll('li.cmp-image-list__item'));
  for (const card of cards) {
    // --- IMAGE (first cell) ---
    // Reference the .cmp-image-list__item-image directly (div that contains the .cmp-image)
    const imageCell = card.querySelector('.cmp-image-list__item-image');

    // --- TEXT (second cell) ---
    const textFragments = [];
    // Title
    const titleLink = card.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleText = titleLink.textContent.trim();
      if (titleText) {
        const strong = document.createElement('strong');
        strong.textContent = titleText;
        textFragments.push(strong);
      }
    }
    // Description
    const desc = card.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      if (textFragments.length) textFragments.push(document.createElement('br'));
      textFragments.push(document.createTextNode(desc.textContent.trim()));
    }
    // CTA (as in example, always 'Read More' if a link exists)
    if (titleLink && titleLink.getAttribute('href')) {
      const cta = document.createElement('a');
      cta.href = titleLink.getAttribute('href');
      cta.textContent = 'Read More';
      if (textFragments.length) textFragments.push(document.createElement('br'));
      textFragments.push(cta);
    }
    // In case both title and desc are missing, fallback to all visible text
    if (!textFragments.length) {
      const allText = card.textContent.trim();
      if (allText) textFragments.push(document.createTextNode(allText));
    }
    rows.push([
      imageCell,
      textFragments.length === 1 ? textFragments[0] : textFragments
    ]);
  }

  // 5. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
