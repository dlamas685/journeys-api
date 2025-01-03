/**
 * Mapa de tipos de lugar (Google Places) a sus traducciones en español.
 * Incluye tanto la tabla A como la tabla B (Place Autocomplete nuevo).
 */
export const PLACE_TYPES_TRANSLATIONS: Record<string, string> = {
	// --------------------------------------------------------------------------
	// Industria automotriz
	// --------------------------------------------------------------------------
	car_dealer: 'Concesionario de automóviles',
	car_rental: 'Alquiler de automóviles',
	car_repair: 'Taller mecánico',
	car_wash: 'Lavado de automóviles',
	electric_vehicle_charging_station:
		'Estación de carga para vehículos eléctricos',
	gas_station: 'Gasolinera / Estación de servicio',
	parking: 'Estacionamiento',
	rest_stop: 'Área de descanso',

	// --------------------------------------------------------------------------
	// Empresa
	// --------------------------------------------------------------------------
	corporate_office: 'Oficina corporativa',
	farm: 'Granja',
	ranch: 'Rancho',

	// --------------------------------------------------------------------------
	// Cultura
	// --------------------------------------------------------------------------
	art_gallery: 'Galería de arte',
	art_studio: 'Estudio de arte',
	auditorium: 'Auditorio',
	cultural_landmark: 'Sitio de interés cultural',
	historical_place: 'Lugar histórico',
	monument: 'Monumento',
	museum: 'Museo',
	performing_arts_theater: 'Teatro de artes escénicas',
	sculpture: 'Escultura',

	// --------------------------------------------------------------------------
	// Educación
	// --------------------------------------------------------------------------
	library: 'Biblioteca',
	preschool: 'Preescolar',
	primary_school: 'Escuela primaria',
	school: 'Escuela',
	secondary_school: 'Escuela secundaria',
	university: 'Universidad',

	// --------------------------------------------------------------------------
	// Ocio y entretenimiento
	// --------------------------------------------------------------------------
	adventure_sports_center: 'Centro de deportes de aventura',
	amphitheatre: 'Anfiteatro',
	amusement_center: 'Centro de entretenimiento',
	amusement_park: 'Parque de diversiones',
	aquarium: 'Acuario',
	banquet_hall: 'Salón de banquetes',
	barbecue_area: 'Área de barbacoa',
	botanical_garden: 'Jardín botánico',
	bowling_alley: 'Bolera',
	casino: 'Casino',
	childrens_camp: 'Campamento infantil',
	comedy_club: 'Club de comedia',
	community_center: 'Centro comunitario',
	concert_hall: 'Sala de conciertos',
	convention_center: 'Centro de convenciones',
	cultural_center: 'Centro cultural',
	cycling_park: 'Parque para ciclismo',
	dance_hall: 'Salón de baile',
	dog_park: 'Parque para perros',
	event_venue: 'Lugar de eventos',
	ferris_wheel: 'Rueda de la fortuna',
	garden: 'Jardín',
	hiking_area: 'Área de senderismo',
	historical_landmark: 'Hito histórico',
	internet_cafe: 'Cibercafé',
	karaoke: 'Karaoke',
	marina: 'Marina',
	movie_rental: 'Renta de películas',
	movie_theater: 'Cine',
	national_park: 'Parque nacional',
	night_club: 'Club nocturno',
	observation_deck: 'Mirador',
	off_roading_area: 'Área para todoterreno',
	opera_house: 'Teatro de ópera',
	park: 'Parque',
	philharmonic_hall: 'Sala filarmónica',
	picnic_ground: 'Área de picnic',
	planetarium: 'Planetario',
	plaza: 'Plaza',
	roller_coaster: 'Montaña rusa',
	skateboard_park: 'Parque de patinaje',
	state_park: 'Parque estatal',
	tourist_attraction: 'Atracción turística',
	video_arcade: 'Arcade / Sala de videojuegos',
	visitor_center: 'Centro de visitantes',
	water_park: 'Parque acuático',
	wedding_venue: 'Lugar de bodas',
	wildlife_park: 'Parque de vida silvestre',
	wildlife_refuge: 'Reserva de vida silvestre',
	zoo: 'Zoológico',

	// --------------------------------------------------------------------------
	// Instalaciones
	// --------------------------------------------------------------------------
	public_bath: 'Baño público',
	public_bathroom: 'Baño público',
	stable: 'Establo',

	// --------------------------------------------------------------------------
	// Finanzas
	// --------------------------------------------------------------------------
	accounting: 'Contabilidad',
	atm: 'Cajero automático',
	bank: 'Banco',

	// --------------------------------------------------------------------------
	// Comidas y bebidas
	// --------------------------------------------------------------------------
	acai_shop: 'Tienda de açaí',
	afghani_restaurant: 'Restaurante afgano',
	african_restaurant: 'Restaurante africano',
	american_restaurant: 'Restaurante estadounidense',
	asian_restaurant: 'Restaurante asiático',
	bagel_shop: 'Tienda de bagels',
	bakery: 'Panadería',
	bar: 'Bar',
	bar_and_grill: 'Bar y parrilla',
	barbecue_restaurant: 'Restaurante de barbacoa',
	brazilian_restaurant: 'Restaurante brasileño',
	breakfast_restaurant: 'Restaurante de desayunos',
	brunch_restaurant: 'Restaurante de brunch',
	buffet_restaurant: 'Restaurante buffet',
	cafe: 'Cafetería',
	cafeteria: 'Cafetería',
	candy_store: 'Tienda de dulces',
	cat_cafe: 'Café de gatos',
	chinese_restaurant: 'Restaurante chino',
	chocolate_factory: 'Fábrica de chocolate',
	chocolate_shop: 'Tienda de chocolate',
	coffee_shop: 'Cafetería',
	confectionery: 'Confitería',
	deli: 'Deli / Tienda de embutidos',
	dessert_restaurant: 'Restaurante de postres',
	dessert_shop: 'Tienda de postres',
	diner: 'Cafetería / Comedor',
	dog_cafe: 'Café para perros',
	donut_shop: 'Tienda de donas',
	fast_food_restaurant: 'Restaurante de comida rápida',
	fine_dining_restaurant: 'Restaurante de alta cocina',
	food_court: 'Patio de comidas',
	french_restaurant: 'Restaurante francés',
	greek_restaurant: 'Restaurante griego',
	hamburger_restaurant: 'Restaurante de hamburguesas',
	ice_cream_shop: 'Heladería',
	indian_restaurant: 'Restaurante indio',
	indonesian_restaurant: 'Restaurante indonesio',
	italian_restaurant: 'Restaurante italiano',
	japanese_restaurant: 'Restaurante japonés',
	juice_shop: 'Tienda de jugos',
	korean_restaurant: 'Restaurante coreano',
	lebanese_restaurant: 'Restaurante libanés',
	meal_delivery: 'Entrega de comida',
	meal_takeaway: 'Comida para llevar',
	mediterranean_restaurant: 'Restaurante mediterráneo',
	mexican_restaurant: 'Restaurante mexicano',
	middle_eastern_restaurant: 'Restaurante de Medio Oriente',
	pizza_restaurant: 'Pizzería',
	pub: 'Pub',
	ramen_restaurant: 'Restaurante de ramen',
	restaurant: 'Restaurante',
	sandwich_shop: 'Tienda de sándwiches',
	seafood_restaurant: 'Restaurante de mariscos',
	spanish_restaurant: 'Restaurante español',
	steak_house: 'Restaurante de carnes',
	sushi_restaurant: 'Restaurante de sushi',
	tea_house: 'Casa de té',
	thai_restaurant: 'Restaurante tailandés',
	turkish_restaurant: 'Restaurante turco',
	vegan_restaurant: 'Restaurante vegano',
	vegetarian_restaurant: 'Restaurante vegetariano',
	vietnamese_restaurant: 'Restaurante vietnamita',
	wine_bar: 'Bar de vinos',

	// --------------------------------------------------------------------------
	// Áreas geográficas
	// --------------------------------------------------------------------------
	administrative_area_level_1: 'Área administrativa nivel 1',
	administrative_area_level_2: 'Área administrativa nivel 2',
	country: 'País',
	locality: 'Localidad',
	postal_code: 'Código postal',
	school_district: 'Distrito escolar',

	// --------------------------------------------------------------------------
	// Gobierno
	// --------------------------------------------------------------------------
	city_hall: 'Ayuntamiento',
	courthouse: 'Tribunal',
	embassy: 'Embajada',
	fire_station: 'Estación de bomberos',
	government_office: 'Oficina gubernamental',
	local_government_office: 'Oficina de gobierno local',
	police: 'Estación de policía',
	post_office: 'Oficina de correos',

	// --------------------------------------------------------------------------
	// Salud y bienestar
	// --------------------------------------------------------------------------
	chiropractor: 'Quiropráctico',
	dental_clinic: 'Clínica dental',
	dentist: 'Dentista',
	doctor: 'Médico',
	drugstore: 'Farmacia',
	hospital: 'Hospital',
	massage: 'Servicio de masajes',
	medical_lab: 'Laboratorio médico',
	pharmacy: 'Farmacia',
	physiotherapist: 'Fisioterapeuta',
	sauna: 'Sauna',
	skin_care_clinic: 'Clínica de cuidado de la piel',
	spa: 'Spa',
	tanning_studio: 'Estudio de bronceado',
	wellness_center: 'Centro de bienestar',
	yoga_studio: 'Estudio de yoga',

	// --------------------------------------------------------------------------
	// Vivienda
	// --------------------------------------------------------------------------
	apartment_building: 'Edificio de apartamentos',
	apartment_complex: 'Complejo de apartamentos',
	condominium_complex: 'Complejo de condominios',
	housing_complex: 'Complejo habitacional',

	// --------------------------------------------------------------------------
	// Alojamiento
	// --------------------------------------------------------------------------
	bed_and_breakfast: 'Bed & Breakfast',
	budget_japanese_inn: 'Posada japonesa económica',
	campground: 'Zona de campamento',
	camping_cabin: 'Cabaña de campamento',
	cottage: 'Cabaña',
	extended_stay_hotel: 'Hotel de estancia prolongada',
	farmstay: 'Estancia en granja',
	guest_house: 'Casa de huéspedes',
	hostel: 'Hostel',
	hotel: 'Hotel',
	inn: 'Posada',
	japanese_inn: 'Posada japonesa',
	lodging: 'Alojamiento',
	mobile_home_park: 'Parque de casas móviles',
	motel: 'Motel',
	private_guest_room: 'Habitación privada',
	resort_hotel: 'Hotel tipo resort',
	rv_park: 'Parque para casas rodantes',

	// --------------------------------------------------------------------------
	// Elementos naturales
	// --------------------------------------------------------------------------
	beach: 'Playa',

	// --------------------------------------------------------------------------
	// Lugares de culto
	// --------------------------------------------------------------------------
	church: 'Iglesia',
	hindu_temple: 'Templo hindú',
	mosque: 'Mezquita',
	synagogue: 'Sinagoga',

	// --------------------------------------------------------------------------
	// Servicios
	// --------------------------------------------------------------------------
	astrologer: 'Astrólogo',
	barber_shop: 'Barbería',
	beautician: 'Esteticista',
	beauty_salon: 'Salón de belleza',
	body_art_service: 'Servicio de arte corporal',
	catering_service: 'Servicio de catering',
	cemetery: 'Cementerio',
	child_care_agency: 'Agencia de cuidado infantil',
	consultant: 'Consultor',
	courier_service: 'Servicio de mensajería',
	electrician: 'Electricista',
	florist: 'Floristería',
	food_delivery: 'Entrega de comida',
	foot_care: 'Cuidado de pies',
	funeral_home: 'Funeraria',
	hair_care: 'Cuidado del cabello',
	hair_salon: 'Salón de peluquería',
	insurance_agency: 'Agencia de seguros',
	laundry: 'Lavandería',
	lawyer: 'Abogado',
	locksmith: 'Cerrajero',
	makeup_artist: 'Maquillador',
	moving_company: 'Compañía de mudanzas',
	nail_salon: 'Salón de uñas',
	painter: 'Pintor',
	plumber: 'Plomero',
	psychic: 'Psíquico',
	real_estate_agency: 'Agencia inmobiliaria',
	roofing_contractor: 'Contratista de techos',
	storage: 'Almacén',
	summer_camp_organizer: 'Organizador de campamento de verano',
	tailor: 'Sastre',
	telecommunications_service_provider:
		'Proveedor de servicios de telecomunicaciones',
	tour_agency: 'Agencia de turismo',
	tourist_information_center: 'Centro de información turística',
	travel_agency: 'Agencia de viajes',
	veterinary_care: 'Atención veterinaria',

	// --------------------------------------------------------------------------
	// Compras
	// --------------------------------------------------------------------------
	asian_grocery_store: 'Tienda de comestibles asiáticos',
	auto_parts_store: 'Tienda de repuestos de automóviles',
	bicycle_store: 'Tienda de bicicletas',
	book_store: 'Librería',
	butcher_shop: 'Carnicería',
	cell_phone_store: 'Tienda de teléfonos celulares',
	clothing_store: 'Tienda de ropa',
	convenience_store: 'Tienda de conveniencia',
	department_store: 'Grandes almacenes',
	discount_store: 'Tienda de descuentos',
	electronics_store: 'Tienda de electrónica',
	food_store: 'Tienda de alimentos',
	furniture_store: 'Tienda de muebles',
	gift_shop: 'Tienda de regalos',
	grocery_store: 'Tienda de comestibles',
	hardware_store: 'Ferretería',
	home_goods_store: 'Tienda de artículos para el hogar',
	home_improvement_store: 'Tienda de mejoras para el hogar',
	jewelry_store: 'Joyería',
	liquor_store: 'Licorería',
	market: 'Mercado',
	pet_store: 'Tienda de mascotas',
	shoe_store: 'Zapatería',
	shopping_mall: 'Centro comercial',
	sporting_goods_store: 'Tienda de artículos deportivos',
	store: 'Tienda',
	supermarket: 'Supermercado',
	warehouse_store: 'Tienda de almacén',
	wholesaler: 'Mayorista',

	// --------------------------------------------------------------------------
	// Deportes
	// --------------------------------------------------------------------------
	arena: 'Arena / Estadio cubierto',
	athletic_field: 'Campo atlético',
	fishing_charter: 'Servicio de pesca en chárter',
	fishing_pond: 'Estanque de pesca',
	fitness_center: 'Gimnasio / Centro de fitness',
	golf_course: 'Campo de golf',
	gym: 'Gimnasio',
	ice_skating_rink: 'Pista de patinaje sobre hielo',
	playground: 'Parque infantil / Área de juegos',
	ski_resort: 'Centro de esquí',
	sports_activity_location: 'Ubicación de actividad deportiva',
	sports_club: 'Club deportivo',
	sports_coaching: 'Entrenamiento deportivo',
	sports_complex: 'Complejo deportivo',
	stadium: 'Estadio',
	swimming_pool: 'Piscina',

	// --------------------------------------------------------------------------
	// Transporte
	// --------------------------------------------------------------------------
	airport: 'Aeropuerto',
	airstrip: 'Pista de aterrizaje',
	bus_station: 'Estación de autobuses',
	bus_stop: 'Parada de autobús',
	ferry_terminal: 'Terminal de ferry',
	heliport: 'Helipuerto',
	international_airport: 'Aeropuerto internacional',
	light_rail_station: 'Estación de tren ligero',
	park_and_ride: 'Aparcamiento de conexión',
	subway_station: 'Estación de metro',
	taxi_stand: 'Parada de taxis',
	train_station: 'Estación de tren',
	transit_depot: 'Depósito de transporte',
	transit_station: 'Estación de tránsito',
	truck_stop: 'Parada de camiones',

	// --------------------------------------------------------------------------
	// Tabla B: Valores de tipos de lugar adicionales
	// --------------------------------------------------------------------------
	administrative_area_level_3: 'Área administrativa nivel 3',
	administrative_area_level_4: 'Área administrativa nivel 4',
	administrative_area_level_5: 'Área administrativa nivel 5',
	administrative_area_level_6: 'Área administrativa nivel 6',
	administrative_area_level_7: 'Área administrativa nivel 7',
	archipelago: 'Archipiélago',
	colloquial_area: 'Área coloquial',
	continent: 'Continente',
	establishment: 'Establecimiento',
	finance: 'Finanzas',
	floor: 'Piso',
	food: 'Comida',
	general_contractor: 'Contratista general',
	geocode: 'Geocódigo',
	health: 'Salud',
	intersection: 'Intersección',
	landmark: 'Lugar emblemático',
	natural_feature: 'Elemento natural',
	neighborhood: 'Barrio',
	place_of_worship: 'Lugar de culto',
	plus_code: 'Código Plus',
	point_of_interest: 'Punto de interés',
	political: 'Político',
	post_box: 'Buzón de correo',
	postal_code_prefix: 'Prefijo de código postal',
	postal_code_suffix: 'Sufijo de código postal',
	postal_town: 'Pueblo postal',
	premise: 'Local',
	room: 'Habitación',
	route: 'Ruta',
	street_address: 'Dirección',
	street_number: 'Número de calle',
	sublocality: 'Sublocalidad',
	sublocality_level_1: 'Sublocalidad nivel 1',
	sublocality_level_2: 'Sublocalidad nivel 2',
	sublocality_level_3: 'Sublocalidad nivel 3',
	sublocality_level_4: 'Sublocalidad nivel 4',
	sublocality_level_5: 'Sublocalidad nivel 5',
	subpremise: 'Subespacio',
	town_square: 'Plaza del pueblo',
}
