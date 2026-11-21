import fitz
from pathlib import Path

source = Path(r"C:\Users\Dell\Downloads\martin-receipt.pdf")
output = Path("output/pdf/martin-receipt-updated.pdf")
output.parent.mkdir(parents=True, exist_ok=True)

doc = fitz.open(source)
page = doc[0]

# Remove the old header text from the content layer, while leaving the dashed
# header border intact.
page.add_redact_annot(fitz.Rect(414, 46, 800, 94), fill=(1, 1, 1))
page.apply_redactions()

new_header = (
    "TRAVEL MITHRA HOLIDAYS\n"
    "Old Civil Station Road, Kunnumpuram\n"
    "Kakkanad, Cochin - 682030\n"
    "Kerala, India"
)
for y, line in zip((50, 63, 76, 89), new_header.splitlines()):
    page.insert_text(
        (415, y), line, fontname="times-bold", fontsize=9.5,
        color=(0, 0, 0), overlay=True,
    )

doc.save(output, garbage=4, deflate=True)
doc.close()
print(output)
