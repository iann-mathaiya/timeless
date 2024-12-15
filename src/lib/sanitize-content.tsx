import sanitizeHtml from 'sanitize-html';

export function sanitizeContent(htmlContent: string): string {
    return sanitizeHtml(htmlContent, {
        allowedTags: [
            'p', 'b', 'i', 'em', 'strong', 'input', 'a', 'ul', 'ol', 'li', 'br', 'span', 'img',
        ],
        allowedAttributes: {
            '*': ['class', 'style'],
            a: ['href', 'title', 'target'],
            img: ['src', 'alt', 'width', 'height'],
            input: ['type', 'checked', 'name', 'value'],
        },
        allowedSchemes: ['http', 'https', 'mailto'], // Prevent dangerous protocols
        selfClosing: ['img', 'br'],
        enforceHtmlBoundary: true, // Prevent breaking out of the parent HTML
        disallowedTagsMode: 'discard', // Remove disallowed tags completely
        transformTags: {
            // Add rel="noopener noreferrer" to all anchor tags for security
            a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
        },
    });
};
