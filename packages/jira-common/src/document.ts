import {JiraDocument, JiraDocumentInlineNode, JiraDocumentTopLevelNode} from './types';

export function formatJiraDocumentToPlainString(document: JiraDocument): string {
  return document.content.map((contentElement) => formatJiraTopLevelNodeToPlainText(contentElement, '')).join('\n');
}

export function formatJiraTopLevelNodeToPlainText(node: JiraDocumentTopLevelNode, indent: string): string {
  switch (node.type) {
    case 'paragraph':
      return node.content.map((i) => formatJiraInlineNodeToPlainText(i, indent)).join(' ');

    case 'bulletList':
      return node.content
        .map((i) => {
          const contentText = i.content.map((j) => formatJiraTopLevelNodeToPlainText(j, indent + '    ')).join('\n');
          return `${indent}  ・${contentText}`;
        })
        .join('\n');

    case 'orderedList':
      return node.content
        .map((i, index) => {
          const contentText = i.content.map((j) => formatJiraTopLevelNodeToPlainText(j, indent + '    ')).join('\n');
          return `${indent}  ${index}.${contentText}`;
        })
        .join('\n');
  }
}

function formatJiraInlineNodeToPlainText(node: JiraDocumentInlineNode, indent: string): string {
  switch (node.type) {
    case 'text':
      return `${indent}${node.text}`;

    case 'hardBreak':
      return '\n';
  }
}
