import { GenerateConversation } from "types/generateConversation";
import { GenerateThreatMessage } from "types/generateThreatMessage";
import { UserIntent } from "types/intent";
import { ParsedTask } from "types/parsedTask"

export interface AIService {
    parseTask(message: string): Promise<ParsedTask>;
    detectIntent(message: string): Promise<UserIntent>
    generateThreatMessage(input: GenerateThreatMessage): Promise<string>
}