import React from 'react';

export const RawMarkdownView = ({ markdown = '' }) => {
  const lines = markdown.split('\n');

  return (
    <div className="w-full bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto min-h-[480px]">
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((line, idx) => (
            <tr key={idx} className="hover:bg-slate-900/60 leading-5">
              <td className="pr-4 text-right text-slate-600 select-none w-10 text-[11px] align-top">
                {idx + 1}
              </td>
              <td className="whitespace-pre-wrap break-all text-slate-300 font-mono">
                {line || ' '}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
