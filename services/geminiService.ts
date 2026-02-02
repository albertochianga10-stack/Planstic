
import { GoogleGenAI, Type } from "@google/genai";
import { ProductTrend, DemandLevel, TrendDirection, MarketAnalysisResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Você é um Analista de Mercado Especialista na economia de Angola. 
Sua tarefa é analisar palavras-chave brutas do Google Trends (Região Angola) e transformá-las em insights de negócios.
1. Filtre apenas produtos físicos e serviços comercializáveis (ignore celebridades, notícias políticas ou buscas sem valor comercial).
2. Agrupe termos semelhantes (ex: "tenis nike", "sapatos de corrida", "calçado desportivo" -> "Calçados Desportivos").
3. Determine o nível de procura (Baixa, Média, Alta) com base no volume relativo.
4. Identifique a tendência (Subindo, Estável, Caindo).
5. Estime o crescimento percentual e atribua um "Opportunity Score" de 0 a 100.
6. Forneça uma breve explicação (reasoning) do porquê esse produto é uma oportunidade em Angola agora.
`;

export async function analyzeMarketTrends(rawKeywords: string[]): Promise<MarketAnalysisResponse> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analise as seguintes palavras-chave coletadas do Google Trends Angola: ${rawKeywords.join(", ")}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          trends: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                demandLevel: { type: Type.STRING, enum: ["Baixa", "Média", "Alta"] },
                trend: { type: Type.STRING, enum: ["Subindo", "Estável", "Caindo"] },
                growthPercentage: { type: Type.NUMBER },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunityScore: { type: Type.NUMBER },
                reasoning: { type: Type.STRING },
                history: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      date: { type: Type.STRING },
                      value: { type: Type.NUMBER }
                    }
                  }
                }
              },
              required: ["id", "name", "category", "demandLevel", "trend", "growthPercentage", "opportunityScore", "reasoning", "history"]
            }
          },
          marketOverview: { type: Type.STRING },
          topOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["trends", "marketOverview", "topOpportunities"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim()) as MarketAnalysisResponse;
  } catch (error) {
    console.error("Erro ao processar resposta da IA:", error);
    throw new Error("Falha na análise de dados.");
  }
}
