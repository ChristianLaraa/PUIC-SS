import Image from "next/image";
import { ExternalLink, Award } from "lucide-react";

export default function InstitutionalHeader() {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#E2DACB] relative shadow-xs z-20">
      {/* Listón Conmemorativo 475+ (Inspirado en el cartel oficial) */}
      <div className="absolute top-0 right-6 sm:right-10 hidden lg:block z-30 drop-shadow-md">
        <div className="bg-[#C68A2C] text-white px-3.5 pt-2 pb-4 text-center ribbon-475 relative flex flex-col items-center min-w-[100px]">
          <span className="text-[13px] font-serif font-black tracking-tight leading-none">
            475+
          </span>
          <span className="text-[7.5px] uppercase tracking-widest font-sans font-bold mt-0.5 whitespace-nowrap opacity-95">
            Universidad de México
          </span>
          <div className="w-8 h-px bg-white/40 my-1" />
          <span className="text-[6.5px] tracking-tight font-serif italic text-white/90">
            UNAM rumbo al medio milenio
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-2.5 sm:py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Identidad Institucional Principal */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Símbolo Escudo UNAM */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-11 w-11 rounded-full border border-[#C68A2C]/60 bg-[#0A1E42] p-1 flex items-center justify-center shrink-0 shadow-sm">
              <Image
                src="/unam.png"
                alt="Escudo UNAM"
                width={38}
                height={40}
                className="h-8 w-auto object-contain brightness-110"
              />
            </div>
            <div className="h-8 w-px bg-[#E2DACB] hidden sm:block" />
            <div className="h-9 w-16 hidden sm:flex items-center justify-center">
              <Image
                src="/puic.png"
                alt="Logo PUIC"
                width={65}
                height={35}
                className="h-7 w-auto object-contain"
              />
            </div>
          </div>

          <div className="border-l border-[#E2DACB] pl-3 sm:pl-4">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-sm sm:text-base md:text-lg font-bold text-[#0A1E42] leading-tight tracking-tight">
                Universidad Nacional Autónoma de México
              </h1>
              <span className="hidden xl:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#C68A2C]/15 text-[#9E6B1D] border border-[#C68A2C]/30">
                <Award size={11} /> 475 Años
              </span>
            </div>
            <p className="font-serif text-xs text-[#5C6779] italic font-medium">
              Programa Universitario de Estudios de la Diversidad Cultural y la Interculturalidad (PUIC)
            </p>
          </div>
        </div>

        {/* Bloque Secundario: Dependencias y Enlaces */}
        <div className="flex items-center gap-3 self-end md:self-auto text-xs pr-0 lg:pr-32">
          <div className="hidden sm:flex flex-col text-right border-r border-[#E2DACB] pr-3.5">
            <span className="font-serif font-bold text-[#0A1E42] text-xs">
              Coordinación de Humanidades
            </span>
            <span className="text-[11px] text-[#5C6779]">
              Servicio Social y Prácticas
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-[#E0F2F1] text-[#008A7C] font-bold border border-[#008A7C]/30 text-xs tracking-wide">
              PUIC Digital
            </span>
            <a
              href="https://www.nacionmulticultural.unam.mx"
              target="_blank"
              rel="noreferrer"
              className="text-[#5C6779] hover:text-[#0A1E42] transition-colors p-1"
              title="Portal oficial PUIC"
            >
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
