import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  
  let currentTable: string[][] = [];
  let inTable = false;
  let currentList: string[] = [];
  let inList = false;
  
  const flushTable = (key: number) => {
    if (currentTable.length === 0) return null;
    
    let hasHeader = false;
    let headers: string[] = [];
    let rows: string[][] = [];
    
    if (currentTable.length >= 2) {
      const secondRow = currentTable[1];
      const isSeparator = secondRow.every(cell => cell.trim().match(/^-+$/) || cell.trim() === "");
      if (isSeparator) {
        hasHeader = true;
        headers = currentTable[0];
        rows = currentTable.slice(2);
      } else {
        rows = currentTable;
      }
    } else {
      rows = currentTable;
    }
    
    currentTable = [];
    inTable = false;
    
    return (
      <div key={`table-${key}`} className="my-3 overflow-x-auto rounded-xl border border-border/50 bg-secondary/15 backdrop-blur-sm">
        <table className="w-full text-left text-xs border-collapse">
          {hasHeader && (
            <thead className="bg-secondary/40 border-b border-border/40 text-[9.5px] uppercase font-600 tracking-wider text-muted-foreground">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-3.5 py-2.5 border-r border-border/20 last:border-r-0">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-border/20">
            {rows.map((row, ri) => (
              <tr key={ri} className="hover:bg-secondary/25 transition-colors">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3.5 py-2 border-r border-border/20 last:border-r-0 text-[10.5px] text-foreground font-400">
                    {renderInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const flushList = (key: number) => {
    if (currentList.length === 0) return null;
    const listItems = [...currentList];
    currentList = [];
    inList = false;
    return (
      <ul key={`list-${key}`} className="list-disc pl-5 my-2 space-y-1 text-[11px] text-foreground/90">
        {listItems.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ul>
    );
  };

  const renderInline = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = text.trim();
    let idx = 0;
    
    while (remaining) {
      const boldMatch = remaining.match(/^([^\*]*)\*\*([^\*]+)\*\*(.*)$/);
      const codeMatch = remaining.match(/^([^`]*)`([^`]+)`(.*)$/);
      
      if (boldMatch && (!codeMatch || boldMatch[1].length < codeMatch[1].length)) {
        if (boldMatch[1]) parts.push(<span key={idx++}>{boldMatch[1]}</span>);
        parts.push(<strong key={idx++} className="font-600 text-foreground">{boldMatch[2]}</strong>);
        remaining = boldMatch[3];
      } else if (codeMatch) {
        if (codeMatch[1]) parts.push(<span key={idx++}>{codeMatch[1]}</span>);
        parts.push(<code key={idx++} className="bg-secondary/60 text-accent px-1.5 py-0.5 rounded font-mono text-[10px]">{codeMatch[2]}</code>);
        remaining = codeMatch[3];
      } else {
        parts.push(<span key={idx++}>{remaining}</span>);
        break;
      }
    }
    
    return parts.length > 0 ? parts : [text];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Handle tables
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (inList) {
        blocks.push(flushList(i));
      }
      inTable = true;
      const cells = line.split("|").slice(1, -1).map(c => c.trim());
      currentTable.push(cells);
      continue;
    } else if (inTable) {
      blocks.push(flushTable(i));
    }
    
    // Handle list items
    const listMatch = trimmed.match(/^[\*\-•]\s+(.*)$/);
    if (listMatch) {
      inList = true;
      currentList.push(listMatch[1]);
      continue;
    } else if (inList) {
      const nextLine = lines[i + 1]?.trim();
      const nextIsList = nextLine && (nextLine.startsWith("* ") || nextLine.startsWith("- ") || nextLine.startsWith("• "));
      if (!nextIsList) {
        blocks.push(flushList(i));
      }
    }
    
    // Handle headings
    if (trimmed.startsWith("###")) {
      blocks.push(<h4 key={i} className="text-xs font-700 mt-3 mb-1 text-foreground">{renderInline(trimmed.replace(/^###\s*/, ""))}</h4>);
    } else if (trimmed.startsWith("##")) {
      blocks.push(<h3 key={i} className="text-sm font-700 mt-4 mb-1.5 text-foreground border-b border-border/30 pb-0.5">{renderInline(trimmed.replace(/^##\s*/, ""))}</h3>);
    } else if (trimmed.startsWith("#")) {
      blocks.push(<h2 key={i} className="text-base font-800 mt-4 mb-2 text-foreground">{renderInline(trimmed.replace(/^#\s*/, ""))}</h2>);
    } else if (trimmed === "---") {
      blocks.push(<hr key={i} className="border-border/40 my-3" />);
    } else if (trimmed !== "") {
      blocks.push(<p key={i} className="my-1.5 leading-relaxed text-[11.5px] text-foreground/90">{renderInline(line)}</p>);
    }
  }
  
  if (inTable) {
    blocks.push(flushTable(lines.length));
  }
  if (inList) {
    blocks.push(flushList(lines.length));
  }
  
  return <div className="space-y-0.5 break-words">{blocks}</div>;
}
