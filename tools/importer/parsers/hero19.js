/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: must match example exactly
  const headerRow = ['Hero (hero19)'];

  // 2. Image row: prominent hero image (background for block)
  // Try to find the first visible .cmp-image img (not a portrait/byline, but the main hero image)
  let heroImage = null;
  // Search all .cmp-image img; pick the first one that's not inside .byline
  const allImages = element.querySelectorAll('.cmp-image img');
  for (const img of allImages) {
    if (!img.closest('.byline')) {
      heroImage = img;
      break;
    }
  }
  // Fallback: just the first .cmp-image img
  if (!heroImage && allImages.length) heroImage = allImages[0];
  const imageRow = [heroImage ? heroImage : ''];

  // 3. Text row: headline, subheading, intro text
  // Goal: include all text elements that appear visually at the top of the page (headline, byline, intro/lead, not sidebar or lists)
  // We'll use the main content container (8-column) for this
  const textElements = [];
  // Find the main 8-column container (should have main headline and intro)
  let mainContent = element.querySelector('.container.responsivegrid.aem-GridColumn--default--8');
  if (!mainContent) {
    // fallback: the first responsivegrid main container
    mainContent = element.querySelector('.container.responsivegrid');
  }
  if (mainContent) {
    // 3.1. Headline (first h1)
    const headline = mainContent.querySelector('h1.cmp-title__text');
    if (headline) textElements.push(headline);
    // 3.2. Subheading (first h4 in main section)
    const subheading = mainContent.querySelector('h4.cmp-title__text');
    if (subheading) textElements.push(subheading);
    // 3.3. Intro/lead text (first .cmp-contentfragment p or mainContent p)
    const mainArticle = mainContent.querySelector('.cmp-contentfragment');
    let introPara = null;
    if (mainArticle) {
      introPara = mainArticle.querySelector('p');
    }
    if (!introPara) {
      // fallback: first p in mainContent not inside .cmp-byline or .byline
      const allPs = mainContent.querySelectorAll('p');
      for (const p of allPs) {
        if (!p.closest('.byline') && !p.closest('.cmp-byline')) {
          introPara = p;
          break;
        }
      }
    }
    if (introPara) textElements.push(introPara);
  }
  // Fallback: if above missed, add h1, h4, p from anywhere (but not in sidebar or byline)
  if (textElements.length === 0) {
    const addIfNotByline = sel => {
      element.querySelectorAll(sel).forEach(el => {
        if (!el.closest('.byline') && !el.closest('.cmp-byline')) {
          textElements.push(el);
        }
      });
    };
    addIfNotByline('h1.cmp-title__text');
    addIfNotByline('h4.cmp-title__text');
    addIfNotByline('p');
  }

  // 4. Compose single text row
  const textRow = [textElements.length ? textElements : ''];

  // 5. Create table
  const cells = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element with the block table
  element.replaceWith(table);
}
