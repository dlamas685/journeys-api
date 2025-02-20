import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import OpenAI from 'openai'

@Injectable()
export class AssistantService {
	private openai: OpenAI

	constructor(private config: ConfigService) {
		this.openai = new OpenAI({
			apiKey: this.config.get('OPENAI_API_KEY'),
		})
	}

	// async generateSuggestions(prompt: string): Promise<string> {
	// 	try {
	// 		const response = this.openai.chat.completions.create({
	// 			model: 'gpt-4o',
	// 		})
	// 	} catch (error) {}
	// }
}
