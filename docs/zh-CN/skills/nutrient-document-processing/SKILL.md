---
name: nutrient-document-processing
description: Ã¤Â½Â¿Ã§â€Â¨Nutrient DWS APIÃ¥Â¤â€žÃ§Ââ€ Ã£â‚¬ÂÃ¨Â½Â¬Ã¦ÂÂ¢Ã£â‚¬ÂOCRÃ¨Â¯â€ Ã¥Ë†Â«Ã£â‚¬ÂÃ¦ÂÂÃ¥Ââ€“Ã£â‚¬ÂÃ§Â¼â€“Ã¨Â¾â€˜Ã£â‚¬ÂÃ§Â­Â¾Ã¥ÂÂÃ¥â€™Å’Ã¥Â¡Â«Ã¥â€ â„¢Ã¦â€“â€¡Ã¦Â¡Â£Ã£â‚¬â€šÃ¦â€Â¯Ã¦Å’ÂPDFÃ£â‚¬ÂDOCXÃ£â‚¬ÂXLSXÃ£â‚¬ÂPPTXÃ£â‚¬ÂHTMLÃ¥â€™Å’Ã¥â€ºÂ¾Ã¥Æ’ÂÃ¦Â Â¼Ã¥Â¼ÂÃ£â‚¬â€š
origin: claude-fulcrum
---

# Ã¦â€“â€¡Ã¦Â¡Â£Ã¥Â¤â€žÃ§Ââ€ 

Ã¤Â½Â¿Ã§â€Â¨ [Nutrient DWS Processor API](https://www.nutrient.io/api/) Ã¥Â¤â€žÃ§Ââ€ Ã¦â€“â€¡Ã¦Â¡Â£Ã£â‚¬â€šÃ¨Â½Â¬Ã¦ÂÂ¢Ã¦Â Â¼Ã¥Â¼ÂÃ£â‚¬ÂÃ¦ÂÂÃ¥Ââ€“Ã¦â€“â€¡Ã¦Å“Â¬Ã¥â€™Å’Ã¨Â¡Â¨Ã¦Â Â¼Ã£â‚¬ÂÃ¥Â¯Â¹Ã¦â€°Â«Ã¦ÂÂÃ¦â€“â€¡Ã¦Â¡Â£Ã¨Â¿â€ºÃ¨Â¡Å’ OCRÃ£â‚¬ÂÃ§Â¼â€“Ã¨Â¾â€˜ PIIÃ£â‚¬ÂÃ¦Â·Â»Ã¥Å Â Ã¦Â°Â´Ã¥ÂÂ°Ã£â‚¬ÂÃ¦â€¢Â°Ã¥Â­â€”Ã§Â­Â¾Ã¥ÂÂÃ¤Â»Â¥Ã¥ÂÅ Ã¥Â¡Â«Ã¥â€ â„¢ PDF Ã¨Â¡Â¨Ã¥Ââ€¢Ã£â‚¬â€š

## Ã¨Â®Â¾Ã§Â½Â®

Ã¥Å“Â¨ **[nutrient.io](https://dashboard.nutrient.io/sign_up/?product=processor)** Ã¨Å½Â·Ã¥Ââ€“Ã¤Â¸â‚¬Ã¤Â¸ÂªÃ¥â€¦ÂÃ¨Â´Â¹Ã§Å¡â€ž API Ã¥Â¯â€ Ã©â€™Â¥

```bash
export NUTRIENT_API_KEY="pdf_live_..."
```

Ã¦â€°â‚¬Ã¦Å“â€°Ã¨Â¯Â·Ã¦Â±â€šÃ©Æ’Â½Ã¤Â»Â¥ multipart POST Ã¥Â½Â¢Ã¥Â¼ÂÃ¥Ââ€˜Ã©â‚¬ÂÃ¥Ë†Â° `https://api.nutrient.io/build`Ã¯Â¼Å’Ã¥Â¹Â¶Ã©â„¢â€žÃ¥Â¸Â¦Ã¤Â¸â‚¬Ã¤Â¸Âª `instructions` JSON Ã¥Â­â€”Ã¦Â®ÂµÃ£â‚¬â€š

## Ã¦â€œÂÃ¤Â½Å“

### Ã¨Â½Â¬Ã¦ÂÂ¢Ã¦â€“â€¡Ã¦Â¡Â£

```bash
# DOCX to PDF
curl -X POST https://api.nutrient.io/build \
  -H "Authorization: Bearer $NUTRIENT_API_KEY" \
  -F "document.docx=@document.docx" \
  -F 'instructions={"parts":[{"file":"document.docx"}]}' \
  -o output.pdf

# PDF to DOCX
curl -X POST https://api.nutrient.io/build \
  -H "Authorization: Bearer $NUTRIENT_API_KEY" \
  -F "document.pdf=@document.pdf" \
  -F 'instructions={"parts":[{"file":"document.pdf"}],"output":{"type":"docx"}}' \
  -o output.docx

# HTML to PDF
curl -X POST https://api.nutrient.io/build \
  -H "Authorization: Bearer $NUTRIENT_API_KEY" \
  -F "index.html=@index.html" \
  -F 'instructions={"parts":[{"html":"index.html"}]}' \
  -o output.pdf
```

Ã¦â€Â¯Ã¦Å’ÂÃ§Å¡â€žÃ¨Â¾â€œÃ¥â€¦Â¥Ã¦Â Â¼Ã¥Â¼ÂÃ¯Â¼Å¡PDF, DOCX, XLSX, PPTX, DOC, XLS, PPT, PPS, PPSX, ODT, RTF, HTML, JPG, PNG, TIFF, HEIC, GIF, WebP, SVG, TGA, EPSÃ£â‚¬â€š

### Ã¦ÂÂÃ¥Ââ€“Ã¦â€“â€¡Ã¦Å“Â¬Ã¥â€™Å’Ã¦â€¢Â°Ã¦ÂÂ®

```bash
# Extract plain text
curl -X POST https://api.nutrient.io/build \
  -H "Authorization: Bearer $NUTRIENT_API_KEY" \
  -F "document.pdf=@document.pdf" \
  -F 'instructions={"parts":[{"file":"document.pdf"}],"output":{"type":"text"}}' \
  -o output.txt

# Extract tables as Excel
curl -X POST https://api.nutrient.io/build \
  -H "Authorization: Bearer $NUTRIENT_API_KEY" \
  -F "document.pdf=@document.pdf" \
  -F 'instructions={"parts":[{"file":"document.pdf"}],"output":{"type":"xlsx"}}' \
  -o tables.xlsx
```

### OCR Ã¦â€°Â«Ã¦ÂÂÃ¦â€“â€¡Ã¦Â¡Â£

```bash
# OCR to searchable PDF (supports 100+ languages)
curl -X POST https://api.nutrient.io/build \
  -H "Authorization: Bearer $NUTRIENT_API_KEY" \
  -F "scanned.pdf=@scanned.pdf" \
  -F 'instructions={"parts":[{"file":"scanned.pdf"}],"actions":[{"type":"ocr","language":"english"}]}' \
  -o searchable.pdf
```

Ã¦â€Â¯Ã¦Å’ÂÃ¨Â¯Â­Ã¨Â¨â‚¬Ã¯Â¼Å¡Ã©â‚¬Å¡Ã¨Â¿â€¡ ISO 639-2 Ã¤Â»Â£Ã§Â ÂÃ¦â€Â¯Ã¦Å’Â 100 Ã¥Â¤Å¡Ã§Â§ÂÃ¨Â¯Â­Ã¨Â¨â‚¬Ã¯Â¼Ë†Ã¤Â¾â€¹Ã¥Â¦â€šÃ¯Â¼Å’`eng`, `deu`, `fra`, `spa`, `jpn`, `kor`, `chi_sim`, `chi_tra`, `ara`, `hin`, `rus`Ã¯Â¼â€°Ã£â‚¬â€šÃ¥Â®Å’Ã¦â€¢Â´Ã§Å¡â€žÃ¨Â¯Â­Ã¨Â¨â‚¬Ã¥ÂÂÃ§Â§Â°Ã¥Â¦â€š `english` Ã¦Ë†â€“ `german` Ã¤Â¹Å¸Ã©â‚¬â€šÃ§â€Â¨Ã£â‚¬â€šÃ¦Å¸Â¥Ã§Å“â€¹ [Ã¥Â®Å’Ã¦â€¢Â´Ã§Å¡â€ž OCR Ã¨Â¯Â­Ã¨Â¨â‚¬Ã¨Â¡Â¨](https://www.nutrient.io/guides/document-engine/ocr/language-support/) Ã¤Â»Â¥Ã¨Å½Â·Ã¥Ââ€“Ã¦â€°â‚¬Ã¦Å“â€°Ã¦â€Â¯Ã¦Å’ÂÃ§Å¡â€žÃ¤Â»Â£Ã§Â ÂÃ£â‚¬â€š

### Ã§Â¼â€“Ã¨Â¾â€˜Ã¦â€¢ÂÃ¦â€žÅ¸Ã¤Â¿Â¡Ã¦ÂÂ¯

```bash
# Pattern-based (SSN, email)
curl -X POST https://api.nutrient.io/build \
  -H "Authorization: Bearer $NUTRIENT_API_KEY" \
  -F "document.pdf=@document.pdf" \
  -F 'instructions={"parts":[{"file":"document.pdf"}],"actions":[{"type":"redaction","strategy":"preset","strategyOptions":{"preset":"social-security-number"}},{"type":"redaction","strategy":"preset","strategyOptions":{"preset":"email-address"}}]}' \
  -o redacted.pdf

# Regex-based
curl -X POST https://api.nutrient.io/build \
  -H "Authorization: Bearer $NUTRIENT_API_KEY" \
  -F "document.pdf=@document.pdf" \
  -F 'instructions={"parts":[{"file":"document.pdf"}],"actions":[{"type":"redaction","strategy":"regex","strategyOptions":{"regex":"\\b[A-Z]{2}\\d{6}\\b"}}]}' \
  -o redacted.pdf
```

Ã©Â¢â€žÃ¨Â®Â¾Ã¯Â¼Å¡`social-security-number`, `email-address`, `credit-card-number`, `international-phone-number`, `north-american-phone-number`, `date`, `time`, `url`, `ipv4`, `ipv6`, `mac-address`, `us-zip-code`, `vin`Ã£â‚¬â€š

### Ã¦Â·Â»Ã¥Å Â Ã¦Â°Â´Ã¥ÂÂ°

```bash
curl -X POST https://api.nutrient.io/build \
  -H "Authorization: Bearer $NUTRIENT_API_KEY" \
  -F "document.pdf=@document.pdf" \
  -F 'instructions={"parts":[{"file":"document.pdf"}],"actions":[{"type":"watermark","text":"CONFIDENTIAL","fontSize":72,"opacity":0.3,"rotation":-45}]}' \
  -o watermarked.pdf
```

### Ã¦â€¢Â°Ã¥Â­â€”Ã§Â­Â¾Ã¥ÂÂ

```bash
# Self-signed CMS signature
curl -X POST https://api.nutrient.io/build \
  -H "Authorization: Bearer $NUTRIENT_API_KEY" \
  -F "document.pdf=@document.pdf" \
  -F 'instructions={"parts":[{"file":"document.pdf"}],"actions":[{"type":"sign","signatureType":"cms"}]}' \
  -o signed.pdf
```

### Ã¥Â¡Â«Ã¥â€ â„¢ PDF Ã¨Â¡Â¨Ã¥Ââ€¢

```bash
curl -X POST https://api.nutrient.io/build \
  -H "Authorization: Bearer $NUTRIENT_API_KEY" \
  -F "form.pdf=@form.pdf" \
  -F 'instructions={"parts":[{"file":"form.pdf"}],"actions":[{"type":"fillForm","formFields":{"name":"Jane Smith","email":"jane@example.com","date":"2026-02-06"}}]}' \
  -o filled.pdf
```

## MCP Ã¦Å“ÂÃ¥Å Â¡Ã¥â„¢Â¨Ã¯Â¼Ë†Ã¦â€ºÂ¿Ã¤Â»Â£Ã¦â€“Â¹Ã¦Â¡Ë†Ã¯Â¼â€°

Ã¥Â¯Â¹Ã¤ÂºÅ½Ã¥Å½Å¸Ã§â€Å¸Ã¥Â·Â¥Ã¥â€¦Â·Ã©â€ºâ€ Ã¦Ë†ÂÃ¯Â¼Å’Ã¨Â¯Â·Ã¤Â½Â¿Ã§â€Â¨ MCP Ã¦Å“ÂÃ¥Å Â¡Ã¥â„¢Â¨Ã¤Â»Â£Ã¦â€ºÂ¿ curlÃ¯Â¼Å¡

```json
{
  "mcpServers": {
    "nutrient-dws": {
      "command": "npx",
      "args": ["-y", "@nutrient-sdk/dws-mcp-server"],
      "env": {
        "NUTRIENT_DWS_API_KEY": "YOUR_API_KEY",
        "SANDBOX_PATH": "/path/to/working/directory"
      }
    }
  }
}
```

## Ã¤Â½Â¿Ã§â€Â¨Ã¥Å“ÂºÃ¦â„¢Â¯

* Ã¥Å“Â¨Ã¦Â Â¼Ã¥Â¼ÂÃ¤Â¹â€¹Ã©â€”Â´Ã¨Â½Â¬Ã¦ÂÂ¢Ã¦â€“â€¡Ã¦Â¡Â£Ã¯Â¼Ë†PDF, DOCX, XLSX, PPTX, HTML, Ã¥â€ºÂ¾Ã¥Æ’ÂÃ¯Â¼â€°
* Ã¤Â»Å½ PDF Ã¤Â¸Â­Ã¦ÂÂÃ¥Ââ€“Ã¦â€“â€¡Ã¦Å“Â¬Ã£â‚¬ÂÃ¨Â¡Â¨Ã¦Â Â¼Ã¦Ë†â€“Ã©â€Â®Ã¥â‚¬Â¼Ã¥Â¯Â¹
* Ã¥Â¯Â¹Ã¦â€°Â«Ã¦ÂÂÃ¦â€“â€¡Ã¦Â¡Â£Ã¦Ë†â€“Ã¥â€ºÂ¾Ã¥Æ’ÂÃ¨Â¿â€ºÃ¨Â¡Å’ OCR
* Ã¥Å“Â¨Ã¥â€¦Â±Ã¤ÂºÂ«Ã¦â€“â€¡Ã¦Â¡Â£Ã¥â€°ÂÃ§Â¼â€“Ã¨Â¾â€˜ PII
* Ã¤Â¸ÂºÃ¨Ââ€°Ã§Â¨Â¿Ã¦Ë†â€“Ã¦Å“ÂºÃ¥Â¯â€ Ã¦â€“â€¡Ã¦Â¡Â£Ã¦Â·Â»Ã¥Å Â Ã¦Â°Â´Ã¥ÂÂ°
* Ã¦â€¢Â°Ã¥Â­â€”Ã§Â­Â¾Ã§Â½Â²Ã¥ÂË†Ã¥ÂÅ’Ã¦Ë†â€“Ã¥ÂÂÃ¨Â®Â®
* Ã¤Â»Â¥Ã§Â¼â€“Ã§Â¨â€¹Ã¦â€“Â¹Ã¥Â¼ÂÃ¥Â¡Â«Ã¥â€ â„¢ PDF Ã¨Â¡Â¨Ã¥Ââ€¢

## Ã©â€œÂ¾Ã¦Å½Â¥

* [API Ã¦Â¸Â¸Ã¤Â¹ÂÃ¥Å“Âº](https://dashboard.nutrient.io/processor-api/playground/)
* [Ã¥Â®Å’Ã¦â€¢Â´ API Ã¦â€“â€¡Ã¦Â¡Â£](https://www.nutrient.io/guides/dws-processor/)
* [npm MCP Ã¦Å“ÂÃ¥Å Â¡Ã¥â„¢Â¨](https://www.npmjs.com/package/@nutrient-sdk/dws-mcp-server)
