import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import ModuleCard, { ModuleCardProps } from "@/components/ModuleCard";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useUserEmail } from "@/hooks/useUserEmail";
import {
  IconMentalMath,
  IconCaseMath,
  IconCreativity,
  IconMarketSizing,
} from "@/components/drillIcons";

const modules: Omit<ModuleCardProps, "emailParam">[] = [
  {
    title: "Mental Math",
    description: "Trainiere Kopfrechnen unter Zeitdruck mit Consulting-Shortcuts.",
    icon: <IconMentalMath size={80} />,
    status: "active",
    href: "/mental-math-drill",
    drillType: "mental_math",
  },
  {
    title: "Case Math",
    description: "Löse realistische Rechenaufgaben aus echten Case-Interviews.",
    icon: <IconCaseMath size={80} />,
    status: "active",
    href: "/case-math-drill",
    drillType: "case_math",
  },
  {
    title: "Market Sizing",
    description: "Schätze Marktgrößen mit Struktur, Annahmen & KI-Bewertung.",
    icon: <IconMarketSizing size={80} />,
    status: "active",
    href: "/market-sizing-drill",
    drillType: "market_sizing",
  },
  {
    title: "Creativity",
    description: "Entwickle kreative Lösungen und schärfe deinen Geschäftssinn.",
    icon: <IconCreativity size={80} />,
    status: "coming_soon",
    href: "/creativity-drill",
    drillType: "creativity",
  },
];

const ClientDrillsCarousel: React.FC = () => {
  const userEmail = useUserEmail();
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Brand bar */}
      <header className="flex h-[52px] items-center justify-between border-b border-border px-4">
        <span className="w-24" />
        <span className="font-logo text-[28px] leading-none text-foreground">pumpkin.</span>
        <div className="flex w-24 justify-end">
          {userEmail && (
            <Link
              to={`/fortschritt?email=${encodeURIComponent(userEmail)}`}
              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Fortschritt"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Fortschritt</span>
            </Link>
          )}
        </div>
      </header>

      {/* Carousel */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-6">
        <div className="w-full max-w-[560px]">
          <Carousel
            opts={{ align: "center", loop: true }}
            setApi={setApi}
            className="relative"
          >
            <CarouselContent>
              {modules.map((module, i) => (
                <CarouselItem key={i} className="basis-full">
                  <ModuleCard {...module} emailParam={userEmail} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1 top-1/2 h-10 w-10 -translate-y-1/2 bg-background/90 backdrop-blur" />
            <CarouselNext className="right-1 top-1/2 h-10 w-10 -translate-y-1/2 bg-background/90 backdrop-blur" />
          </Carousel>

          {/* Dots */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {modules.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => api?.scrollTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  selectedIndex === i
                    ? "w-6 bg-primary"
                    : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDrillsCarousel;
