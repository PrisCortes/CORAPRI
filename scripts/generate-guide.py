from pathlib import Path
from html import escape
import json

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "ui" / "examples.ts"
DOCS = ROOT / "docs"
DOCS.mkdir(exist_ok=True)

def js_string(text, start):
    value = []
    index = start + 1
    while index < len(text):
        character = text[index]
        if character == '"':
            return "".join(value), index + 1
        if character == "\\" and index + 1 < len(text):
            escaped = text[index + 1]
            translations = {"n": "\n", "r": "\r", "t": "\t", "\\": "\\", '"': '"', "'": "'"}
            value.append(translations.get(escaped, escaped))
            index += 2
            continue
        value.append(character)
        index += 1
    return "".join(value), index

def read_examples(text):
    examples = []
    index = 0
    while index < len(text):
        opening = text.find("{", index)
        if opening < 0:
            break
        values = {}
        cursor = opening + 1
        while cursor < len(text):
            while cursor < len(text) and (text[cursor].isspace() or text[cursor] == ","):
                cursor += 1
            if cursor >= len(text) or text[cursor] == "}":
                cursor += 1
                break
            key_start = cursor
            while cursor < len(text) and (text[cursor].isalnum() or text[cursor] == "_"):
                cursor += 1
            key = text[key_start:cursor]
            while cursor < len(text) and text[cursor].isspace():
                cursor += 1
            if cursor >= len(text) or text[cursor] != ":":
                break
            cursor += 1
            while cursor < len(text) and text[cursor].isspace():
                cursor += 1
            if cursor >= len(text) or text[cursor] != '"':
                break
            value, cursor = js_string(text, cursor)
            values[key] = value
        if "name" in values and "source" in values:
            examples.append(values)
        index = max(cursor, opening + 1)
    return examples

OUTPUTS = {
    "Hola mundo": "Hola mundo",
    "Variables": "Edad: 20",
    "Constantes": "3.1416",
    "Operaciones": "50",
    "Condicionales": "Mayor de edad",
    "While": "0\n1\n2",
    "Do While": "0\n1\n2",
    "For": "0\n1\n2\n3\n4",
    "Funciones": "30",
    "Recursividad": "120",
    "Arrays": "50",
    "Rangos": "[4, 7, 10, 13, 16]",
    "Asignación par": "100\n2",
    "Optimización": "50",
    "Clase y herencia": "7\n14",
    "Lambdas y listas": "4\n12\n[8]",
}

def explain(line):
    stripped = line.strip()
    if not stripped:
        return "Línea en blanco para separar bloques."
    if stripped.startswith("program"):
        return "Declara el programa y abre su bloque principal."
    if stripped.startswith("class"):
        return "Declara una clase; `extends` expresa herencia cuando aparece."
    if stripped.startswith("function") or stripped.startswith("constructor"):
        return "Declara una función o constructor con parámetros y cuerpo."
    if stripped.startswith("if") or stripped.startswith("else") or stripped.startswith("while") or stripped.startswith("do") or stripped.startswith("for"):
        return "Controla el flujo de ejecución mediante una condición o ciclo."
    if stripped.startswith("print"):
        return "Evalúa la expresión y agrega su representación a la salida."
    if stripped.startswith("return"):
        return "Devuelve el valor calculado al contexto que llamó a la función."
    if stripped.startswith("parallel") or stripped.startswith("task") or stripped.startswith("par"):
        return "Marca trabajo concurrente o una asignación simultánea."
    if "lambda" in stripped:
        return "Construye una función anónima que captura su entorno léxico."
    if "map(" in stripped or "filter(" in stripped or "reduce(" in stripped:
        return "Aplica una operación funcional sobre los elementos de una lista."
    if stripped.startswith("//"):
        return "Comentario: no modifica el programa."
    if "=" in stripped:
        return "Declara o actualiza un valor; el analizador verifica su tipo."
    return "Forma parte de la expresión o del bloque que se está ejecutando."

def make_markdown(examples):
    lines = ["# Guía de ejemplos ejecutables de CoRaPri", "", "Documento generado desde `src/ui/examples.ts`.", "", "## Índice", ""]
    for number, example in enumerate(examples, 1):
        lines.append(f"{number}. [{example['name']}](#{number}-{example['name'].lower().replace(' ', '-')})")
    lines.extend(["", "## Cómo leer los resultados", "", "Cada bloque conserva el código que aparece en el selector de ejemplos. La explicación acompaña cada línea y el resultado indica la salida observada o el diagnóstico esperado.", ""])
    for number, example in enumerate(examples, 1):
        anchor = f"{number}-{example['name'].lower().replace(' ', '-')}"
        lines.extend([f"## {number}. {example['name']}", "", f"**Descripción:** {example.get('description', '')}", "", f"<a id=\"{anchor}\"></a>", "```crp"])
        source_lines = example["source"].split("\n")
        for source_line in source_lines:
            lines.append(source_line)
        lines.extend(["```", "", "### Explicación línea por línea", ""])
        for line_number, source_line in enumerate(source_lines, 1):
            lines.append(f"{line_number}. `{source_line}` — {explain(source_line)}")
        invalid = "Error" in example["name"] or example.get("category") == "Exposición sintáctica" and "Error" in example["name"]
        if invalid:
            result = "Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser en la línea indicada."
        else:
            result = OUTPUTS.get(example["name"], "Programa válido; la salida se obtiene en la pestaña Ejecución del IDE.")
        lines.extend(["", "### Resultado", "", "```text", result, "```", ""])
    return "\n".join(lines)

def build_pdf(examples, markdown):
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_CENTER
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Preformatted, PageBreak, Table, TableStyle
    pdf_path = DOCS / "CoRaPri_Guia_de_Ejemplos.pdf"
    styles = getSampleStyleSheet()
    title = ParagraphStyle("GuideTitle", parent=styles["Title"], alignment=TA_CENTER, fontSize=24, leading=29, textColor=colors.HexColor("#133C55"), spaceAfter=18)
    subtitle = ParagraphStyle("GuideSubtitle", parent=styles["Normal"], alignment=TA_CENTER, fontSize=11, leading=16, textColor=colors.HexColor("#386FA4"), spaceAfter=30)
    heading = ParagraphStyle("GuideHeading", parent=styles["Heading1"], fontSize=16, leading=20, textColor=colors.HexColor("#133C55"), spaceBefore=10, spaceAfter=8)
    body = ParagraphStyle("GuideBody", parent=styles["BodyText"], fontSize=9.5, leading=13, spaceAfter=6)
    code = ParagraphStyle("GuideCode", parent=styles["Code"], fontName="Courier", fontSize=7.6, leading=10, backColor=colors.HexColor("#F0F4F8"), borderColor=colors.HexColor("#D9E2EC"), borderWidth=0.5, borderPadding=6)
    story = [Paragraph("Guía de ejemplos ejecutables de CoRaPri", title), Paragraph("Analizador léxico AFN · parser · semántica · IR · optimización · intérprete", subtitle), Paragraph("Esta guía se genera desde el catálogo de ejemplos del IDE y está pensada como material de consulta y evaluación.", body), PageBreak(), Paragraph("Índice", heading)]
    index_rows = [["#", "Ejemplo", "Categoría"]]
    for number, example in enumerate(examples, 1):
        index_rows.append([str(number), escape(example["name"]), escape(example.get("category", "General"))])
    table = Table(index_rows, colWidths=[0.4 * inch, 3.2 * inch, 2.4 * inch], repeatRows=1)
    table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#133C55")), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white), ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#BCCCDC")), ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"), ("FONTSIZE", (0, 0), (-1, -1), 8), ("VALIGN", (0, 0), (-1, -1), "TOP")]))
    story.extend([table, PageBreak()])
    for number, example in enumerate(examples, 1):
        story.append(Paragraph(f"{number}. {escape(example['name'])}", heading))
        story.append(Paragraph(f"<b>Descripción:</b> {escape(example.get('description', ''))}", body))
        numbered = []
        source_lines = example["source"].split("\n")
        for line_number, source_line in enumerate(source_lines, 1):
            numbered.append(f"{line_number:>2}  {source_line}")
        story.append(Preformatted("\n".join(numbered), code))
        story.append(Spacer(1, 6))
        story.append(Paragraph("<b>Explicación línea por línea</b>", body))
        for line_number, source_line in enumerate(source_lines, 1):
            story.append(Paragraph(f"{line_number}. <font name=\"Courier\">{escape(source_line)}</font> — {escape(explain(source_line))}", body))
        invalid = "Error" in example["name"] or example.get("category") == "Exposición sintáctica" and "Error" in example["name"]
        result = "Ejemplo deliberadamente inválido: se espera un diagnóstico de lexer o parser." if invalid else OUTPUTS.get(example["name"], "Programa válido; ejecútalo en la pestaña Ejecución para observar su salida.")
        story.append(Paragraph(f"<b>Resultado:</b> {escape(result).replace(chr(10), '<br/>')}", body))
        story.append(PageBreak())
    def footer(canvas, document):
        canvas.saveState()
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.HexColor("#627D98"))
        canvas.drawString(0.7 * inch, 0.45 * inch, "CoRaPri · guía generada automáticamente")
        canvas.drawRightString(7.8 * inch, 0.45 * inch, f"Página {document.page}")
        canvas.restoreState()
    SimpleDocTemplate(str(pdf_path), pagesize=letter, rightMargin=0.65 * inch, leftMargin=0.65 * inch, topMargin=0.65 * inch, bottomMargin=0.7 * inch, title="Guía de ejemplos CoRaPri", author="CoRaPri").build(story, onFirstPage=footer, onLaterPages=footer)
    return pdf_path

def main():
    examples = read_examples(SOURCE.read_text(encoding="utf-8"))
    markdown = make_markdown(examples)
    (DOCS / "CoRaPri_Guia_de_Ejemplos.md").write_text(markdown, encoding="utf-8")
    (DOCS / "CoRaPri_Guia_de_Ejemplos.json").write_text(json.dumps(examples, ensure_ascii=False, indent=2), encoding="utf-8")
    pdf_path = build_pdf(examples, markdown)
    print(f"Generados {len(examples)} ejemplos")
    print(pdf_path)

if __name__ == "__main__":
    main()
