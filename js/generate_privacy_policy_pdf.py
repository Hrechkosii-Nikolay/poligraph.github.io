"""Generate the downloadable privacy-policy PDF for the static website."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "polityka_konfidentsinosti.pdf"
FONT_DIR = Path("/System/Library/Fonts/Supplemental")

pdfmetrics.registerFont(TTFont("Policy", str(FONT_DIR / "Arial Unicode.ttf")))
pdfmetrics.registerFont(TTFont("PolicyBold", str(FONT_DIR / "Arial Bold.ttf")))

RED = colors.HexColor("#d90000")
INK = colors.HexColor("#171717")
MUTED = colors.HexColor("#646464")
LINE = colors.HexColor("#e2e2e2")

styles = {
    "brand": ParagraphStyle(
        "brand", fontName="PolicyBold", fontSize=9, leading=12, textColor=RED,
        alignment=TA_CENTER, spaceAfter=7,
    ),
    "title": ParagraphStyle(
        "title", fontName="PolicyBold", fontSize=24, leading=29, textColor=INK,
        alignment=TA_CENTER, spaceAfter=7,
    ),
    "meta": ParagraphStyle(
        "meta", fontName="Policy", fontSize=9, leading=12, textColor=MUTED,
        alignment=TA_CENTER,
    ),
    "intro": ParagraphStyle(
        "intro", fontName="Policy", fontSize=10.5, leading=15, textColor=INK,
        spaceAfter=11,
    ),
    "heading": ParagraphStyle(
        "heading", fontName="PolicyBold", fontSize=13, leading=17, textColor=INK,
        spaceBefore=13, spaceAfter=6,
    ),
    "body": ParagraphStyle(
        "body", fontName="Policy", fontSize=10, leading=14.5, textColor=INK,
        spaceAfter=7,
    ),
    "small": ParagraphStyle(
        "small", fontName="Policy", fontSize=8.5, leading=11, textColor=MUTED,
        alignment=TA_CENTER,
    ),
}


SECTIONS = [
    (
        "1. Загальні положення",
        [
            "Ця Політика конфіденційності пояснює, як «Червона лінія» обробляє та захищає персональні дані відвідувачів сайту і клієнтів, які звертаються щодо перевірки на поліграфі.",
            "Користуючись сайтом або надсилаючи звернення, ви підтверджуєте, що ознайомилися з цією Політикою. Обробка даних здійснюється відповідно до законодавства України про захист персональних даних.",
        ],
    ),
    (
        "2. Які дані ми можемо отримувати",
        [
            "Ми можемо отримувати ім’я, номер телефону, електронну адресу (за наявності), місто, зміст звернення та іншу інформацію, яку ви добровільно повідомляєте через форми, месенджери або під час спілкування з нашою командою.",
            "Сайт також може автоматично обробляти технічні дані: IP-адресу, тип пристрою й браузера, сторінки перегляду та файли cookie. Такі дані потрібні для стабільної роботи сайту й аналітики.",
        ],
    ),
    (
        "3. Мета та правові підстави обробки",
        [
            "Дані використовуються для відповіді на запит, організації консультації або послуги, уточнення деталей звернення, покращення сервісу, ведення внутрішньої комунікації та виконання вимог законодавства.",
            "Ми обробляємо інформацію за вашою згодою, для вжиття дій на ваш запит перед укладенням договору, виконання договірних зобов’язань або в інших випадках, передбачених законом.",
        ],
    ),
    (
        "4. Зберігання, передавання та захист",
        [
            "Доступ до персональних даних мають лише уповноважені працівники та залучені виконавці, яким ці дані необхідні для надання послуги. Ми не продаємо та не передаємо персональні дані стороннім особам для їхніх маркетингових цілей.",
            "Дані зберігаються не довше, ніж це потрібно для мети їх отримання, виконання домовленостей або вимог законодавства. Ми застосовуємо організаційні та технічні заходи, щоб зменшити ризик несанкціонованого доступу, втрати чи зміни інформації.",
        ],
    ),
    (
        "5. Ваші права",
        [
            "Ви можете звернутися із запитом про доступ до своїх персональних даних, їх уточнення, оновлення, обмеження обробки або видалення — у межах, передбачених законодавством України. Ви також можете відкликати згоду на обробку даних, якщо вона була підставою обробки.",
            "Для реалізації прав або отримання роз’яснення надішліть звернення через форму зв’язку на нашому сайті. Ми розглянемо його у розумний строк та, за потреби, попросимо підтвердити вашу особу.",
        ],
    ),
    (
        "6. Cookie та сторонні сервіси",
        [
            "Cookie допомагають сайту запам’ятовувати технічні налаштування та оцінювати відвідуваність. Ви можете обмежити або вимкнути cookie в налаштуваннях браузера; це може вплинути на коректну роботу окремих функцій сайту.",
            "Якщо на сайті використовуються сторонні сервіси, зокрема карти чи аналітика, вони можуть обробляти технічні дані відповідно до власних політик конфіденційності.",
        ],
    ),
    (
        "7. Зміни до Політики",
        [
            "Ми можемо оновлювати цю Політику у разі зміни роботи сайту, послуг або законодавства. Актуальна редакція завжди доступна на сайті. Дата останнього оновлення зазначена на першій сторінці документа.",
        ],
    ),
]


def page_decor(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setStrokeColor(RED)
    canvas.setLineWidth(1.5)
    canvas.line(20 * mm, height - 16 * mm, 42 * mm, height - 16 * mm)
    canvas.setFont("Policy", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(20 * mm, 12 * mm, "Червона лінія · Політика конфіденційності")
    canvas.drawRightString(width - 20 * mm, 12 * mm, f"Сторінка {doc.page}")
    canvas.restoreState()


def build_pdf():
    document = SimpleDocTemplate(
        str(OUTPUT), pagesize=A4, rightMargin=20 * mm, leftMargin=20 * mm,
        topMargin=25 * mm, bottomMargin=22 * mm, title="Політика конфіденційності",
        author="Червона лінія",
    )
    story = [
        Spacer(1, 14 * mm),
        Paragraph("ЧЕРВОНА ЛІНІЯ", styles["brand"]),
        Paragraph("Політика конфіденційності", styles["title"]),
        Paragraph("Останнє оновлення: 11.09.2026", styles["meta"]),
        Spacer(1, 8 * mm),
    ]

    highlights = Table(
        [[
            Paragraph("<b>Прозоро</b><br/>пояснюємо, які дані потрібні", styles["body"]),
            Paragraph("<b>Конфіденційно</b><br/>дбаємо про захист інформації", styles["body"]),
            Paragraph("<b>Контроль у вас</b><br/>ви можете звернутися щодо своїх даних", styles["body"]),
        ]],
        colWidths=[56 * mm, 56 * mm, 56 * mm],
    )
    highlights.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#fafafa")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("TOPPADDING", (0, 0), (-1, -1), 5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
    ]))
    story.extend([highlights, Spacer(1, 7 * mm)])
    story.append(Paragraph(
        "Ми поважаємо приватність кожної людини, яка звертається до нас. Цей документ описує, яку інформацію ми отримуємо, навіщо вона потрібна та як ви можете керувати своїми даними.",
        styles["intro"],
    ))

    for heading, paragraphs in SECTIONS:
        content = [Paragraph(heading, styles["heading"])]
        content.extend(Paragraph(text, styles["body"]) for text in paragraphs)
        story.append(KeepTogether(content))

    story.extend([
        Spacer(1, 5 * mm),
        Paragraph("Звернення щодо персональних даних можна надіслати через сайт: <link href=\"https://red-line.com.ua/\" color=\"#d90000\">red-line.com.ua</link>", styles["intro"]),
        Spacer(1, 4 * mm),
        Paragraph("Актуальна HTML-версія документа доступна на сайті «Червоної лінії»: <link href=\"https://red-line.com.ua/\" color=\"#d90000\">red-line.com.ua</link>", styles["small"]),
    ])
    document.build(story, onFirstPage=page_decor, onLaterPages=page_decor)


if __name__ == "__main__":
    build_pdf()
    print(OUTPUT)
