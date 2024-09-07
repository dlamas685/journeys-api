import {
	Body,
	Button,
	Column,
	Container,
	Font,
	Head,
	Heading,
	Html,
	Img,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from '@react-email/components'
import * as React from 'react'
import tailwindConfig from 'src/common/modules/mails/config/tailwind.config'

type Props = {
	name: string
	link: string
}

const PasswordReset = ({ name, link }: Readonly<Props>) => {
	const year = new Date().getFullYear()

	return (
		<Html lang='es'>
			<Head>
				<Font
					fontFamily='Hind Madurai'
					fallbackFontFamily='sans-serif'
					webFont={{
						url: 'https://fonts.gstatic.com/s/hindmadurai/v11/f0Xu0e2p98ZvDXdZQIOcpqjfXaUXaMEpEp4L_wx2.woff2',
						format: 'woff2',
					}}
					fontWeight={300}
					fontStyle='normal'
				/>

				<Font
					fontFamily='Hind Madurai'
					fallbackFontFamily='sans-serif'
					webFont={{
						url: 'https://fonts.gstatic.com/s/hindmadurai/v11/f0Xu0e2p98ZvDXdZQIOcpqjfXaUXaMEpEp4L_wx2.woff2',
						format: 'woff2',
					}}
					fontWeight={400}
					fontStyle='normal'
				/>

				<Font
					fontFamily='Hind Madurai'
					fallbackFontFamily='sans-serif'
					webFont={{
						url: 'https://fonts.gstatic.com/s/hindmadurai/v11/f0Xu0e2p98ZvDXdZQIOcpqjfXaUXaMEpEp4L_wx2.woff2',
						format: 'woff2',
					}}
					fontWeight={500}
					fontStyle='normal'
				/>

				<Font
					fontFamily='Hind Madurai'
					fallbackFontFamily='sans-serif'
					webFont={{
						url: 'https://fonts.gstatic.com/s/hindmadurai/v11/f0Xu0e2p98ZvDXdZQIOcpqjfXaUXaMEpEp4L_wx2.woff2',
						format: 'woff2',
					}}
					fontWeight={600}
					fontStyle='normal'
				/>

				<Font
					fontFamily='Hind Madurai'
					fallbackFontFamily='sans-serif'
					webFont={{
						url: 'https://fonts.gstatic.com/s/hindmadurai/v11/f0Xu0e2p98ZvDXdZQIOcpqjfXaUXaMEpEp4L_wx2.woff2',
						format: 'woff2',
					}}
					fontWeight={700}
					fontStyle='normal'
				/>
			</Head>
			<Preview>Reestablecer Contraseña</Preview>
			<Body>
				<Tailwind config={tailwindConfig}>
					<Container className='bg-offwhite mx-auto my-0 w-[680px] p-4 max-w-full'>
						<Section className='rounded-md'>
							<Img
								src='/static/imagotype-v1.png'
								alt='Journeys'
								className='object-cover w-56 mx-auto'
							/>
						</Section>
						<Section className='p-4 bg-white'>
							<Heading
								as='h1'
								className='font-secondary text-2xl text-center font-extrabold '>
								Hola, {name}
							</Heading>
							<Text className='text-base text-gray-500'>
								Recibimos una solicitud para restablecer tu contraseña. Haz clic
								en el enlace de abajo para restablecerla:
							</Text>

							<Section className='my-2'>
								<Row>
									<Column align='center'>
										<Button
											href={link}
											className='bg-orange-500 text-white px-4 py-3 rounded-md select-none cursor-pointer'>
											Reestablecer contraseña
										</Button>
									</Column>
								</Row>
							</Section>

							<Text className='text-base text-gray-500'>
								Ten en cuenta que este enlace expirará en 10 minutos.
							</Text>

							<Text className='text-base text-gray-500'>
								Si no solicitaste este cambio, puedes ignorar este correo
								electrónico.
							</Text>

							<Section className='mt-5'>
								<Row>
									<Column align='center'>
										<Text className='text-xs text-center text-gray-400'>
											&copy; {year} Journeys. Todos los derechos reservados.
										</Text>
									</Column>
								</Row>
							</Section>
						</Section>
					</Container>
				</Tailwind>
			</Body>
		</Html>
	)
}

export default PasswordReset
