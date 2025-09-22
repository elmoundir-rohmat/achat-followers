// Parser Markdown optimisé pour le SEO
export interface ParsedMarkdown {
  html: string;
  headings: Array<{
    level: number;
    text: string;
    id: string;
  }>;
  wordCount: number;
  readingTime: number;
}

/**
 * Convertit le Markdown en HTML optimisé pour le SEO
 */
export function parseMarkdownToHTML(markdown: string): ParsedMarkdown {
  const headings: Array<{ level: number; text: string; id: string }> = [];
  let wordCount = 0;

  // Nettoyer le markdown
  let html = markdown
    // Titre principal H1
    .replace(/^# (.+)$/gm, (match, title) => {
      const id = generateHeadingId(title);
      headings.push({ level: 1, text: title, id });
      return `<h1 id="${id}" class="text-4xl font-bold text-gray-900 mb-6 mt-8">${title}</h1>`;
    })
    // Sous-titres H2
    .replace(/^## (.+)$/gm, (match, title) => {
      const id = generateHeadingId(title);
      headings.push({ level: 2, text: title, id });
      return `<h2 id="${id}" class="text-3xl font-bold text-gray-900 mb-4 mt-8">${title}</h2>`;
    })
    // Sous-titres H3
    .replace(/^### (.+)$/gm, (match, title) => {
      const id = generateHeadingId(title);
      headings.push({ level: 3, text: title, id });
      return `<h3 id="${id}" class="text-2xl font-bold text-gray-900 mb-3 mt-6">${title}</h3>`;
    })
    // Sous-titres H4
    .replace(/^#### (.+)$/gm, (match, title) => {
      const id = generateHeadingId(title);
      headings.push({ level: 4, text: title, id });
      return `<h4 id="${id}" class="text-xl font-bold text-gray-900 mb-2 mt-4">${title}</h4>`;
    })
    // Paragraphes
    .replace(/^(?!<[h1-6])(.+)$/gm, (match, content) => {
      if (content.trim()) {
        wordCount += content.split(/\s+/).length;
        return `<p class="mb-4 leading-relaxed text-gray-800">${content}</p>`;
      }
      return content;
    })
    // Listes à puces
    .replace(/^[\s]*[-*+] (.+)$/gm, '<li class="mb-2 ml-4">$1</li>')
    .replace(/(<li class="mb-2 ml-4">.*<\/li>)/gs, '<ul class="list-disc list-inside mb-4 space-y-2">$1</ul>')
    // Listes numérotées
    .replace(/^[\s]*\d+\. (.+)$/gm, '<li class="mb-2 ml-4">$1</li>')
    .replace(/(<li class="mb-2 ml-4">.*<\/li>)/gs, '<ol class="list-decimal list-inside mb-4 space-y-2">$1</ol>')
    // Texte en gras
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    // Texte en italique
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    // Liens
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Code inline
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
    // Blocs de code
    .replace(/```([^`]+)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code class="text-sm">$1</code></pre>')
    // Citations
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-400 pl-4 py-2 mb-4 bg-blue-50 italic">$1</blockquote>')
    // Lignes horizontales
    .replace(/^---$/gm, '<hr class="my-8 border-gray-300">')
    // Nettoyer les balises vides
    .replace(/<p class="mb-4 leading-relaxed text-gray-800"><\/p>/g, '')
    // Nettoyer les espaces multiples
    .replace(/\n\s*\n/g, '\n');

  // Calculer le temps de lecture (mots par minute)
  const readingTime = Math.ceil(wordCount / 200); // 200 mots par minute

  return {
    html,
    headings,
    wordCount,
    readingTime
  };
}

/**
 * Génère un ID unique pour les titres (pour les ancres)
 */
function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Génère une table des matières
 */
export function generateTableOfContents(headings: Array<{ level: number; text: string; id: string }>): string {
  if (headings.length === 0) return '';

  const toc = headings
    .map(heading => {
      const indent = '  '.repeat(heading.level - 1);
      return `${indent}- [${heading.text}](#${heading.id})`;
    })
    .join('\n');

  return `<div class="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Table des matières</h3>
    <nav class="space-y-1">
      ${headings
        .map(heading => {
          const indent = 'ml-' + (heading.level - 1) * 4;
          return `<a href="#${heading.id}" class="block text-blue-600 hover:text-blue-800 text-sm ${indent}">${heading.text}</a>`;
        })
        .join('')}
    </nav>
  </div>`;
}

/**
 * Optimise le contenu pour le SEO
 */
export function optimizeForSEO(html: string, title: string): string {
  // Ajouter des balises sémantiques
  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/g, `<article><header><h1 class="text-4xl font-bold text-gray-900 mb-6 mt-8">$1</h1></header>`)
    .replace(/<\/div>$/, '</div></article>')
    // Ajouter des sections pour chaque H2
    .replace(/<h2[^>]*>(.*?)<\/h2>/g, '</section><section><h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">$1</h2>')
    .replace(/<section><h2/, '<section><h2')
    .replace(/<\/div>$/, '</section></div></article>');
}
