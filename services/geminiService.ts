
import { GoogleGenAI, Type } from "@google/genai";
import { LogEntry } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function formatLogsForPrompt(logs: LogEntry[]): string {
  if (logs.length === 0) return "لا توجد سجلات بعد.";
  return logs.map(log => 
    `- اليوم ${log.day}: شعرت بـ'${log.feeling}' بسبب '${log.trigger}'. ${log.succeeded ? 'نجحت في المقاومة.' : 'لم أنجح.'}`
  ).join('\n');
}

export const analyzeJournal = async (logs: LogEntry[]): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const logsText = formatLogsForPrompt(logs);
  const prompt = `
    أنت مرشد نفسي متخصص في الإقلاع عن العادات. 
    حلل هذه الملاحظات اليومية من مستخدم يحاول الإقلاع عن عادة سيئة. 
    قدم له رؤية بسيطة ومحفزة في فقرة قصيرة واحدة (سطرين أو ثلاثة). 
    ركز على الأنماط في المشاعر والمحفزات التي قد لا يلاحظها. كن إيجابياً وداعماً.
    
    ملاحظات المستخدم:
    ${logsText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing journal with Gemini:", error);
    return "حدث خطأ أثناء تحليل ملاحظاتك. يرجى المحاولة مرة أخرى.";
  }
};

export const getPersonalizedSuggestion = async (logs: LogEntry[]): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const logsText = formatLogsForPrompt(logs);
  const commonTrigger = logs.length > 0 ? logs[logs.length-1].trigger : "الملل"; // a sensible default
  
  const prompt = `
    أنت مرشد ذكي ومبدع. بناءً على سجل المستخدم هذا، اقترح عليه بديلاً واحداً محدداً وفعالاً يمكنه تجربته في المرة القادمة التي يواجه فيها محفز '${commonTrigger}'.
    يجب أن يكون الاقتراح بسيطاً وعملياً.
    
    سجل المستخدم:
    ${logsText}
  `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting suggestion from Gemini:", error);
    return "جرّب أخذ 3 أنفاس عميقة.";
  }
};

export const getSurpriseTestAlternatives = async (logs: LogEntry[]): Promise<string[]> => {
    const model = 'gemini-2.5-flash';
    const logsText = formatLogsForPrompt(logs);
    const prompt = `بناءً على سجل المستخدم هذا، اقترح 3 بدائل قصيرة جداً (كلمة أو كلمتين) ومختلفة يمكنه القيام بها الآن لمواجهة الرغبة.
    السجل: ${logsText}
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        alternatives: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse.alternatives || ['تنفس بعمق', 'تحرك قليلاً', 'اشرب ماء'];
    } catch (error) {
        console.error("Error getting alternatives from Gemini:", error);
        return ['تنفس بعمق', 'تحرك قليلاً', 'اشرب ماء'];
    }
};
