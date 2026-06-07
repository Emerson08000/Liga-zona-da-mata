import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { useState } from 'react';

export function Historia() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('inicio');
  const [activeLeague, setActiveLeague] = useState<'futsal' | 'campo'>('futsal');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} activeLeague={activeLeague} setActiveLeague={setActiveLeague} />
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#0f4c2e] hover:underline mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-10 bg-[#d4af37] rounded-full" />
            <h1 className="text-2xl md:text-3xl font-bold text-[#0f4c2e]">Nossa História</h1>
          </div>

          <div className="text-gray-700 space-y-5 text-sm md:text-base leading-relaxed">
            <p>
              A <strong>Liga Zona da Mata de Futebol</strong> nasceu em <strong>2019</strong> com o nome de <strong>Liga Desportiva Lajense</strong>, fruto do esforço de pessoas apaixonadas pelo esporte e comprometidas com o desenvolvimento do futebol regional.
            </p>
            <p>
              Com o crescimento das competições e a adesão de equipes de diferentes municípios, a entidade expandiu seus horizontes e passou a representar toda a Zona da Mata Alagoana, assumindo o nome pelo qual é conhecida hoje.
            </p>
            <p>
              Ao longo dos anos, a Liga organizou torneios e campeonatos nas modalidades de <strong>Futebol de Campo</strong>, <strong>Futebol 7</strong> e <strong>Futsal</strong>, sempre com foco na qualidade, na inclusão e no incentivo à prática esportiva.
            </p>
            <p>
              Sob a presidência de <strong>Edjunior de Macena Barbosa</strong>, a Liga segue firme no propósito de fortalecer o futebol regional, descobrir novos talentos e escrever, a cada campeonato, mais um capítulo de sua trajetória vitoriosa.
            </p>
          </div>

          {/* Linha do tempo */}
          <div className="mt-10">
            <h2 className="text-lg font-bold text-[#0f4c2e] mb-6">Linha do Tempo</h2>
            <div className="relative border-l-2 border-[#d4af37] pl-6 space-y-8">
              {[
                { ano: '2019', evento: 'Fundação da Liga Desportiva Lajense.' },
                { ano: '2020–2022', evento: 'Expansão das competições para municípios da região.' },
                { ano: '2023', evento: 'Mudança para o nome Liga Zona da Mata de Futebol.' },
                { ano: '2024', evento: 'Consolidação como principal entidade esportiva da Zona da Mata Alagoana.' },
                { ano: '2025', evento: 'Nova temporada com recorde de equipes participantes.' },
              ].map(item => (
                <div key={item.ano} className="relative">
                  <div className="absolute -left-[30px] w-3.5 h-3.5 bg-[#d4af37] rounded-full border-2 border-white" />
                  <div className="text-xs font-bold text-[#d4af37] mb-1">{item.ano}</div>
                  <div className="text-sm text-gray-700">{item.evento}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
