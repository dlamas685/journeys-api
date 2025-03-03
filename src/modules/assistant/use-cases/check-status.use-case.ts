import OpenAI from 'openai'

interface Options {
	threadId: string
	runId: string
}

export const checkStatusUseCase = async (openai: OpenAI, options: Options) => {
	const { threadId, runId } = options

	const run = await openai.beta.threads.runs.retrieve(threadId, runId)

	if (run.status === 'completed') {
		return run
	}

	await new Promise(resolve => setTimeout(resolve, 1000))

	return await checkStatusUseCase(openai, options)
}
