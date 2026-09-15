import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

def generate_checklist_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        alignment=0,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#475569'),
        spaceAfter=15
    )

    role_header_style = ParagraphStyle(
        'RoleHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#ffffff'),
        spaceAfter=0
    )

    item_title_style = ParagraphStyle(
        'ItemTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor('#0f172a')
    )

    item_desc_style = ParagraphStyle(
        'ItemDesc',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#334155')
    )

    story = []

    # Title Banner
    story.append(Paragraph("📋 CHECKLIST DE PRUEBAS DE FUNCIONALIDAD Y PERFILES - KAWSAY", title_style))
    story.append(Paragraph("Plataforma Cultural de Quito — Guía de Validación Pre-Lanzamiento a Producción", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#c6f135'), spaceAfter=15))

    # Info table
    info_data = [
        [Paragraph("<b>URL Frontend Vercel:</b> https://kawsay-project.vercel.app", item_desc_style),
         Paragraph("<b>URL Backend Render:</b> https://kawsay-project.onrender.com/api", item_desc_style)]
    ]
    info_table = Table(info_data, colWidths=[270, 270])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 15))

    sections = [
        {
            "title": "1. ROL: VISITANTE / ESPECTADOR (Navegación Abierta)",
            "bg": "#3b82f6",
            "items": [
                ("[  ] Acceso Principal", "Cargar la web pública en Vercel sin iniciar sesión."),
                ("[  ] Cartelera Visual", "Verificar tarjetas de eventos con insignias de colores por categoría (Música, Danza, Teatro, Artes, Festivales)."),
                ("[  ] Filtros por Categoría", "Hacer clic en los botones de filtro y verificar que la lista se actualice correctamente."),
                ("[  ] Modal Showcase Detalle", "Hacer clic en un evento para abrir el modal explicativo con elenco, aforo y boletería."),
                ("[  ] Sistema de Estrellas (⭐)", "Hacer clic en las estrellas (1-5 ⭐) dentro del modal para registrar una calificación."),
                ("[  ] Calendario Mes y Semana", "Explorar las vistas de calendario y verificar que las fechas muestren tarjetas de colores con horario y título."),
                ("[  ] Módulo Convocatorias", "Navegar a la pestaña '📢 CONVOCATORIAS' y explorar las becas y fondos públicos abiertos."),
                ("[  ] Bloqueo de Acciones Privadas", "Intentar marcar Favorito o Asistir; verificar que despliegue el modal de Iniciar Sesión.")
            ]
        },
        {
            "title": "2. ROL: ESPECTADOR AUTENTICADO (espectador@kawsay.ec / espectador123)",
            "bg": "#10b981",
            "items": [
                ("[  ] Inicio de Sesión Real", "Ingresar con correo espectador@kawsay.ec y contraseña espectador123."),
                ("[  ] Persistencia de Sesión", "Recargar la página (F5) y verificar que el usuario continúe autenticado."),
                ("[  ] Guardar Favoritos & RSVP", "Marcar eventos como Favoritos ❤️ y Asistiré ✅; comprobar el cambio de estado."),
                ("[  ] Carrito de Compras", "Agregar entradas al carrito, cambiar cantidades (+/-) y simular el checkout exitoso."),
                ("[  ] Cerrar Sesión", "Hacer clic en el icono 🚪 en la barra superior para salir de la cuenta.")
            ]
        },
        {
            "title": "3. ROL: ARTISTA / COLECTIVO (artista@kawsay.ec / artista123)",
            "bg": "#a855f7",
            "items": [
                ("[  ] Vista Estudio Artista", "Verificar que la pestaña de Inicio cambie a 'ESTUDIO ARTISTA'."),
                ("[  ] Formulario Publicar Evento", "Hacer clic en '+ GENERAR CARTELERA PRO' y llenar el título, fecha, hora y categoría."),
                ("[  ] Aceptación de Términos", "Marcar la casilla obligatoria de Términos y Condiciones y Política de Privacidad."),
                ("[  ] Notificación por Correo", "Al publicar, verificar el modal de '✉️ ENLACE DE VALIDACIÓN ENVIADO'."),
                ("[  ] Estado Pendiente", "Verificar que el evento se cree en estado 'PENDIENTE' para moderación.")
            ]
        },
        {
            "title": "4. ROL: ESPACIO CULTURAL / GESTOR (espacio@kawsay.ec / espacio123)",
            "bg": "#f97316",
            "items": [
                ("[  ] Vista Mi Espacio Cultural", "Verificar la ficha del Teatro Nacional Quito con salas y aforo."),
                ("[  ] Modificar / Editar Eventos", "Hacer clic en '✏️ Editar' en cualquier evento propio y actualizar datos en vivo.")
            ]
        },
        {
            "title": "5. ROL: ADMINISTRADOR / MODERADOR (admin@kawsay.ec / admin123)",
            "bg": "#ef4444",
            "items": [
                ("[  ] KPIs del Dashboard", "Verificar los contadores de Eventos Aprobados, Pendientes, Espacios y Usuarios."),
                ("[  ] Panel de Moderación", "Abrir '🛡️ MODERACIÓN' en la barra superior."),
                ("[  ] Aprobar o Rechazar", "Aprobar (✅) o Rechazar (❌) eventos pendientes en la tabla."),
                ("[  ] Gestión de Usuarios & DB", "Revisar la tabla de usuarios y espacios en la base de datos SQLite.")
            ]
        }
    ]

    for sec in sections:
        # Header block
        header_table = Table(
            [[Paragraph(sec["title"], role_header_style)]],
            colWidths=[540]
        )
        header_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor(sec["bg"])),
            ('PADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(header_table)
        story.append(Spacer(1, 6))

        # Items table
        table_rows = []
        for check, desc in sec["items"]:
            table_rows.append([
                Paragraph(f"<b>{check}</b>", item_title_style),
                Paragraph(desc, item_desc_style)
            ])

        items_table = Table(table_rows, colWidths=[180, 360])
        items_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ffffff')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
            ('PADDING', (0,0), (-1,-1), 5),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        story.append(items_table)
        story.append(Spacer(1, 10))

    doc.build(story)
    print("PDF creado exitosamente en:", filename)

if __name__ == '__main__':
    generate_checklist_pdf("Checklist_Pruebas_KAWSAY.pdf")
