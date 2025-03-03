import OpenAI from 'openai'

interface Options {
	threadId: string
	content: string
}

export const createMessageUseCase = (openai: OpenAI, options: Options) => {
	const { threadId, content } = options

	const message = openai.beta.threads.messages.create(threadId, {
		role: 'user',
		content,
	})

	return message
}
