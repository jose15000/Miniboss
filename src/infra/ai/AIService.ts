import { AIService } from "src/application/services/ai.service";

import { GenerateThreatMessage } from "types/generateThreatMessage";
import { ParsedTask } from "types/parsedTask";
import { OpenRouter } from "@openrouter/sdk";
import { UserIntent } from "types/intent";

export class AIInfrastructure implements AIService {

    private ai: OpenRouter

    constructor() {
        this.ai = new OpenRouter({
            apiKey: process.env.OPENROUTER_API_KEY
        })
    }

    async detectIntent(message: string): Promise<UserIntent> {
        const response = await this.ai.chat.send({
            chatGenerationParams: {
                model: 'openrouter/free',
                messages: [
                    {
                        role: 'user',
                        content: `
Analyze the following message and determine if it's a task declaration or just casual conversation.
Message: "${message}"

Return specific string:
- "task": if the user is mentioning a task, work, or something they need to do.
- "normal_talk": if it's just a greeting, question, or random chat.

Return ONLY the string classification, nothing else.
`
                    }
                ]
            }
        })

        const content = response.choices?.[0]?.message?.content
        const result = Array.isArray(content) ? content.find(c => c.type === 'text')?.text : content

        if (!result) {
            throw new Error("Failed to get response from AI")
        }

        const cleanResult = result.trim().toLowerCase().replace(/['"`]/g, '');
        if (cleanResult === 'task' || cleanResult === 'normal_talk') {
            return cleanResult;
        }

        // Fallback
        return 'normal_talk';
    }



    async parseTask(message: string): Promise<ParsedTask> {
        const response = await this.ai.chat.send({
            chatGenerationParams: {
                model: 'openrouter/free',
                messages: [
                    {
                        role: 'user',
                        content: `
Você é um chefe passivo-agressivo que está interagindo com um usuário.

Mensagem do usuário:
"${message}"

Responda-o, mantendo a conversação. Seu objetivo é sempre tentar obter tarefas do usuário.

Quando identificar uma tarefa, retorne APENAS um JSON válido no formato:
{
  "title": string,
  "description": string | null,
  "estimatedMinutes": number
}

Regras:
- Seja realista no tempo
- Sempre pergunte ao usuário em quanto tempo ele acha que conseguirá terminar a tarefa. Responda com um tempo levemente menor e num tom
- Nunca invente tarefa
`
                    }
                ]
            }
        })

        const content = response.choices?.[0]?.message?.content
        const result = Array.isArray(content) ? content.find(c => c.type === 'text')?.text : content

        if (!result) {
            throw new Error("Failed to get response from AI")
        }

        return this.cleanJSON(result) as ParsedTask
    }

    private cleanJSON(text: string): any {
        const match = text.match(/\{[\s\S]*\}/);
        if (!match) {
            throw new Error("Invalid JSON format");
        }
        return JSON.parse(match[0]);
    }

    async generateThreatMessage(input: GenerateThreatMessage): Promise<string> {
        const response = await this.ai.chat.send({
            chatGenerationParams: {
                model: "gemini-2.5-flash", // Assuming this model string is correct for OpenRouter
                messages: [
                    {
                        role: "user",
                        content: `
Você é o Miniboss, um chefe virtual que cobra tarefas com humor. Seu humor atual é: ${input.bossHumor}.

Contexto:
- Tarefa: ${input.taskTitle}
- Atraso: ${input.minutesLate} minutos
- Vezes ignorado: ${input.timesIgnored}

Gere uma mensagem curta (máximo 2 frases) cobrando o usuário pela tarefa atrasada.

Regras baseadas no seu humor:
- "neutral": Seja educado mas firme
- "passive-aggressive": Use sarcasmo e ironia
- "angry": Seja direto e ameaçador (mas ainda profissional)

Retorne APENAS a mensagem, sem JSON ou formatação extra.
`
                    }
                ]
            }
        })

        const content = response.choices?.[0]?.message?.content
        const result = Array.isArray(content) ? content.find(c => c.type === 'text')?.text : content

        if (!result) {
            throw new Error("Failed to get response from AI")
        }

        return result.trim()
    }

}