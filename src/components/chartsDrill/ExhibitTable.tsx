import React from "react";
import { ExhibitTableSpec } from "@/types/charts";

/**
 * Case-Exhibit-Tabelle im Casebook-Stil auf hellem Slide:
 * dunkles Header-Band, Einrückungs-Hierarchie, Summenzeilen, de-DE-Zahlen.
 */

const fmt = (v: number | string): string =>
  typeof v === "number" ? v.toLocaleString("de-DE") : v;

const ExhibitTable: React.FC<{ spec: ExhibitTableSpec }> = ({ spec }) => {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-end justify-between gap-3">
        <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#52514E]">
          {spec.title}
        </h4>
        {spec.unit_note && (
          <span className="shrink-0 text-[11px] italic text-[#898781]">{spec.unit_note}</span>
        )}
      </div>
      <div className="overflow-x-auto rounded-lg border border-[#E1E0D9]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-[#334155] text-white">
              <th className="px-3 py-2 text-left text-[12px] font-semibold" />
              {spec.columns.map((col, i) => (
                <th key={i} className="px-3 py-2 text-right text-[12px] font-semibold whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {spec.rows.map((row, ri) => {
              const isTotal = row.style === "total";
              const isBold = row.style === "bold" || isTotal;
              const indent = row.indent ?? 0;
              return (
                <tr
                  key={ri}
                  className={`border-b border-[#EEEDE8] last:border-b-0 ${
                    isTotal ? "border-t-2 border-t-[#52514E] bg-[#F7F6F2]" : ""
                  }`}
                >
                  <td
                    className={`px-3 py-1.5 text-left leading-snug ${
                      isBold ? "font-semibold text-[#1A1A18]" : indent > 0 ? "text-[#52514E]" : "text-[#1A1A18]"
                    }`}
                    style={{ paddingLeft: `${12 + indent * 16}px` }}
                  >
                    {row.label}
                  </td>
                  {row.values.map((v, ci) => (
                    <td
                      key={ci}
                      className={`px-3 py-1.5 text-right tabular-nums whitespace-nowrap ${
                        isBold ? "font-semibold text-[#1A1A18]" : indent > 0 ? "text-[#52514E]" : "text-[#1A1A18]"
                      }`}
                    >
                      {fmt(v)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {spec.footnote && (
        <p className="text-[11px] italic leading-snug text-[#898781]">{spec.footnote}</p>
      )}
    </div>
  );
};

export default ExhibitTable;
