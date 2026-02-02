
import React, { useState, useEffect } from 'react';
import { analyzeMarketTrends } from './services/geminiService';
import { ProductTrend, MarketAnalysisResponse, DemandLevel, TrendDirection } from './types';
import { TrendChart } from './components/TrendChart';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  ShoppingBag, 
  Search, 
  AlertCircle,
  RefreshCw,
  Globe,
  Zap,
  Briefcase
} from 'lucide-react';

// Mocked keywords representative of Angola's current search trends
const MOCK_KEYWORDS = [
  "iphone 15 pro max luanda", "preço de fuba de milho", "venda de carros usados angola", 
  "roupas de fardo atacado", "perucas humanas baratas", "melhores paineis solares", 
  "venda de geradores a diesel", "cremes clareadores para pele", "cursos de marketing digital angola",
  "smart tv samsung 55 polegadas", "sapatilhas nike originais", "materiais de construção preços"
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MarketAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeMarketTrends(MOCK_KEYWORDS);
      setData(result);
    } catch (err) {
      setError("Não foi possível carregar os dados. Verifique sua conexão ou chave de API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getTrendColor = (trend: TrendDirection) => {
    switch (trend) {
      case TrendDirection.UP: return 'text-emerald-600 bg-emerald-50';
      case TrendDirection.DOWN: return 'text-rose-600 bg-rose-50';
      default: return 'text-amber-600 bg-amber-50';
    }
  };

  const getDemandBadge = (level: DemandLevel) => {
    switch (level) {
      case DemandLevel.HIGH: return 'bg-indigo-600 text-white';
      case DemandLevel.MEDIUM: return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <BarChart3 className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Kizua<span className="text-indigo-600">Trends</span></span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-sm text-slate-500 font-medium">Mercado: Angola (Luanda)</span>
              <button 
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all font-medium text-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Analisando...' : 'Atualizar Dados'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Market Overview Header */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Monitoramento de Tendências</h1>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {data?.marketOverview || "Aguardando análise da IA sobre o mercado angolano..."}
                </p>
              </div>
              <div className="w-full md:w-64 space-y-4">
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Status do Sistema</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-semibold text-slate-700">IA Conectada</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Região Principal</p>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">Angola</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-8 flex items-center gap-3 bg-rose-50 border border-rose-100 p-4 rounded-xl text-rose-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Top Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {data?.topOpportunities.slice(0, 3).map((opp, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="relative">
                <Zap className="w-6 h-6 text-indigo-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">Oportunidade #{idx + 1}</h3>
                <p className="text-slate-600 text-sm">{opp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Products Table/Grid */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-indigo-600" />
          Produtos Identificados
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))
          ) : data?.trends.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getDemandBadge(product.demandLevel)}`}>
                      Procura {product.demandLevel}
                    </span>
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getTrendColor(product.trend)}`}>
                      {product.trend === TrendDirection.UP ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {product.trend}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{product.category}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-600">+{product.growthPercentage}%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Crescimento Est.</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Search className="w-3 h-3" /> Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.keywords.map((kw, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{kw}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> Análise IA
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed italic">"{product.reasoning}"</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Histórico 30 Dias</h4>
                  <TrendChart 
                    data={product.history} 
                    color={product.trend === TrendDirection.UP ? '#059669' : '#e11d48'} 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Score de Oportunidade:</span>
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full" 
                      style={{ width: `${product.opportunityScore}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-indigo-600">{product.opportunityScore}/100</span>
                </div>
                <button className="text-indigo-600 font-bold text-xs hover:underline uppercase tracking-wider">Ver Fornecedores →</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer / Architecture Details */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white font-bold text-lg mb-4">Arquitetura Técnica do Kizua Trends</h4>
            <p className="text-sm leading-relaxed mb-6">
              Este sistema foi projetado para startups de Big Data e Business Intelligence focadas no mercado da SADC.
              Combina extração de sinais do Google Trends com o motor de raciocínio Gemini 3 Flash para filtragem categórica 
              e análise de sentimento econômico.
            </p>
            <div className="flex gap-4">
              <span className="bg-slate-800 text-[10px] text-white px-2 py-1 rounded font-mono uppercase tracking-tighter">TypeScript</span>
              <span className="bg-slate-800 text-[10px] text-white px-2 py-1 rounded font-mono uppercase tracking-tighter">Gemini 3 Flash</span>
              <span className="bg-slate-800 text-[10px] text-white px-2 py-1 rounded font-mono uppercase tracking-tighter">Tailwind CSS</span>
              <span className="bg-slate-800 text-[10px] text-white px-2 py-1 rounded font-mono uppercase tracking-tighter">React 18</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase mb-4 tracking-widest">Estrutura de Dados</h4>
            <ul className="text-xs space-y-2">
              <li><span className="text-indigo-400 font-bold">Inbound:</span> keywords_angola_v1</li>
              <li><span className="text-indigo-400 font-bold">Process:</span> gemini-market-classifier</li>
              <li><span className="text-indigo-400 font-bold">Storage:</span> timescaledb_trends</li>
              <li><span className="text-indigo-400 font-bold">Cache:</span> redis_realtime_heat</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase mb-4 tracking-widest">Fluxo IA</h4>
            <ul className="text-xs space-y-2">
              <li>1. Ingestão Bruta</li>
              <li>2. Deduplicação Semântica</li>
              <li>3. Validação de Produtos</li>
              <li>4. Projeção de Crescimento</li>
              <li>5. Geração de Insights Biz</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-8 text-center text-xs">
          © 2024 Kizua Trends Tech. Desenvolvido para o ecossistema empreendedor de Angola.
        </div>
      </footer>
    </div>
  );
};

export default App;
