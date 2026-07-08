(function () {
  "use strict";

  window.__BRAND__ = {
    name: "Erick Hardscape",
    tagline: "Patios, fuego y piedra hechos para durar.",
    phone: "(555) 000-0000",
    email: "info@erickhardscape.com",
    serviceArea: "Área metropolitana y alrededores",
    hours: "Lun–Sáb · 7:00–18:00",

    services: [
      {
        id: "firepit",
        name: "Chimeneas & Fire Pits",
        desc: "Estructuras de piedra construidas para el fuego real: seguras, duraderas y el punto de reunión de cada noche de verano.",
        photo: "assets/img/service-firepit.jpg",
        alt: "Fire pit de piedra natural en un patio trasero al anochecer",
      },
      {
        id: "paver-patio",
        name: "Patios de Paver",
        desc: "El piso que sostiene cada comida, cada reunión y cada tarde de descanso. Diseño y drenaje pensados para durar décadas.",
        photo: "assets/img/service-paver-patio.jpg",
        alt: "Patio residencial construido con adoquines de piedra (pavers)",
      },
      {
        id: "driveway",
        name: "Entradas de Driveway",
        desc: "La primera impresión de tu casa, en piedra. Entradas de paver resistentes al peso de tus vehículos y al paso del tiempo.",
        photo: "assets/img/service-driveway.jpg",
        alt: "Entrada de vehículos (driveway) pavimentada con ladrillo y piedra",
      },
      {
        id: "pool-patio",
        name: "Patios de Piscina",
        desc: "Superficies antideslizantes y frescas al tacto, diseñadas para rodear tu piscina sin sacrificar estilo ni seguridad.",
        photo: "assets/img/service-pool.jpg",
        alt: "Patio de piedra alrededor de una piscina residencial",
      },
      {
        id: "kitchen",
        name: "Cocinas Exteriores",
        desc: "Tu cocina, bajo el cielo. Islas de asado, barras y espacios construidos para cocinar y compartir al aire libre.",
        photo: "assets/img/service-kitchen.jpg",
        alt: "Espacio de cocina y parrilla al aire libre en un patio",
      },
      {
        id: "wall",
        name: "Muros de Retención",
        desc: "Contención de terreno con carácter. Muros de piedra que resuelven la pendiente de tu jardín y además se ven bien.",
        photo: "assets/img/service-wall.jpg",
        alt: "Muro de retención de piedra en un jardín residencial",
      },
    ],

    process: [
      { n: "01", title: "Consulta", desc: "Visitamos tu propiedad, medimos el espacio y escuchamos qué necesitas antes de proponer nada." },
      { n: "02", title: "Diseño", desc: "Te mostramos materiales, distribución y presupuesto claro. Nada se construye sin tu aprobación." },
      { n: "03", title: "Instalación", desc: "Nuestro equipo ejecuta el proyecto con base compactada, drenaje correcto y acabado limpio." },
    ],

    stats: [
      { value: 15, suffix: "+", label: "años construyendo en piedra" },
      { value: 500, suffix: "+", label: "proyectos entregados" },
      { value: 100, suffix: "%", label: "presupuestos sin compromiso" },
    ],

    gallery: [
      { photo: "assets/img/gallery-1.jpg", alt: "Patio de piedra natural con fire pit integrado" },
      { photo: "assets/img/gallery-2.jpg", alt: "Camino de piedra tipo stepping stones en jardín" },
      { photo: "assets/img/gallery-3.jpg", alt: "Chimenea exterior de piedra junto a un patio" },
      { photo: "assets/img/gallery-4.jpg", alt: "Cubierta de piedra alrededor de una piscina" },
    ],

    testimonials: [
      { quote: "Llegaron con un plan claro y lo cumplieron al detalle. El patio quedó mejor de lo que imaginamos.", author: "Marta R.", role: "Patio de paver + fire pit" },
      { quote: "El muro de retención resolvió un problema que arrastrábamos hace años. Trabajo prolijo y a tiempo.", author: "Daniel O.", role: "Muro de retención" },
      { quote: "La cocina exterior se volvió el lugar donde pasamos todos los domingos. Vale cada centavo.", author: "Carla V.", role: "Cocina exterior" },
    ],
  };
})();
