import React from "react";
import { ChartExhibit } from "@/types/charts";
import ExhibitTable from "./ExhibitTable";
import ExhibitChart from "./ExhibitChart";

/**
 * Heller "Slide" im Case-Interview-Look auf dunklem App-Hintergrund:
 * Titelzeile, 1–2 Exhibits (Tabelle/Diagramm), optional Additional-Info-Panel.
 */
interface ExhibitSlideProps {
  title?: string | null;
  exhibits: ChartExhibit[];
  additionalInfo?: string[] | null;
}

const ExhibitSlide: React.FC<ExhibitSlideProps> = ({ title, exhibits, additionalInfo }) => {
  const hasInfo = !!additionalInfo && additionalInfo.length > 0;

  const exhibitsBlock = (
    <div className={`grid min-w-0 gap-5 ${exhibits.length > 1 && !hasInfo ? "md:grid-cols-2" : "grid-cols-1"}`}>
      {exhibits.map((e, i) =>
        e.type === "table" ? <ExhibitTable key={i} spec={e} /> : <ExhibitChart key={i} spec={e} />
      )}
    </div>
  );

  return (
    <div className="rounded-xl border border-black/10 bg-[#FDFDFC] p-5 text-[#1A1A18] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {title && (
        <div className="mb-4 border-b border-dotted border-[#C3C2B7] pb-2">
          <h3 className="text-[15px] font-bold tracking-tight text-[#1A1A18]">{title}</h3>
        </div>
      )}

      {hasInfo ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
          {exhibitsBlock}
          <aside className="lg:border-l lg:border-[#E1E0D9] lg:pl-5">
            <h4 className="mb-2 border-b border-dotted border-[#C3C2B7] pb-1 text-[12px] font-semibold uppercase tracking-wider text-[#52514E]">
              Zusatzinformationen
            </h4>
            <ul className="space-y-2.5">
              {additionalInfo!.map((b, i) => (
                <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-[#3A3934]">
                  <span className="mt-[1px] shrink-0 text-[#52514E]">&bull;</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      ) : (
        exhibitsBlock
      )}
    </div>
  );
};

export default ExhibitSlide;
