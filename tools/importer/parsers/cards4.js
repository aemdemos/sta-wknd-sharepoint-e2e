/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'All Articles' section
  const allArticlesTitleDiv = Array.from(element.querySelectorAll('.cmp-title'))
    .find(div => {
      const h = div.querySelector('h2.cmp-title__text');
      return h && h.textContent.trim().toLowerCase() === 'all articles';
    });
  if (!allArticlesTitleDiv) return;
  // Find the image-list block after the All Articles title
  let imageListDiv = allArticlesTitleDiv.closest('.aem-GridColumn').nextElementSibling;
  while (imageListDiv && !imageListDiv.classList.contains('image-list')) {
    imageListDiv = imageListDiv.nextElementSibling;
  }
  if (!imageListDiv) return;

  const list = imageListDiv.querySelector('ul.cmp-image-list');
  if (!list) return;
  
  // Table header exactly as in the example
  const cells = [['Cards (cards4)']];

  // For each card in the image list
  list.querySelectorAll('li.cmp-image-list__item').forEach(li => {
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: reference to the existing <img>
    const img = article.querySelector('.cmp-image-list__item-image img');
    const imageCell = img ? img : '';

    // Text cell: structure is strong (title, linked), then description
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleText = article.querySelector('.cmp-image-list__item-title');
    const desc = article.querySelector('.cmp-image-list__item-description');
    const textCellContent = [];

    if (titleText) {
      // Create a <strong> containing the title text, wrap in link if needed
      const strong = document.createElement('strong');
      strong.textContent = titleText.textContent.trim();
      if (titleLink) {
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.appendChild(strong);
        textCellContent.push(a);
      } else {
        textCellContent.push(strong);
      }
    }

    if (desc && desc.textContent.trim()) {
      // Add a <div> for description to ensure separation
      const descDiv = document.createElement('div');
      descDiv.textContent = desc.textContent.trim();
      textCellContent.push(descDiv);
    }
    
    cells.push([imageCell, textCellContent]);
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  imageListDiv.replaceWith(table);
}
