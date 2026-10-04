const modal = document.getElementById("toolModal");
const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");
const toolContent = document.getElementById("toolContent");

const toolCards = document.querySelectorAll(".tool-card");

const toolNames = {
    merge: "Merge PDF",
    "jpg-to-pdf": "JPG to PDF",
    "pdf-to-jpg": "PDF to JPG",
    split: "Split PDF",
    compress: "Compress PDF",
    rotate: "Rotate PDF",
    "delete-pages": "Delete Pages",
    extract: "Extract Pages",
    watermark: "Watermark PDF",
    "text-to-pdf": "Text to PDF",
    qr: "QR Code",
    "image-compress": "Compress Image"
};


// ===============================
// OPEN TOOL
// ===============================

function openTool(tool) {

    if (!tool) {
        return;
    }

    if (tool === "jpg-to-pdf") {
        openJpgToPdf();
        return;
    }
    if (tool === "merge") {
        openMergePdf();
        return;
    }
    if (tool === "pdf-to-jpg") {
    openPdfToJpg();
    return;
}
if (tool === "split") {
    openSplitPdf();
    return;
}
if (tool === "rotate") {
    openRotatePdf();
    return;
}
if (tool === "delete-pages") {
    openDeletePages();
    return;
}

if (tool === "extract") {
    openExtractPages();
    return;
}

if (tool === "compress") {
    openCompressPdf();
    return;
}
if (tool === "watermark") {
    openWatermarkPdf();
    return;
}

if (tool === "text-to-pdf") {
    openTextToPdf();
    return;
}

if (tool === "qr") {
    openQrCode();
    return;
}

if (tool === "image-compress") {
    openImageCompress();
    return;
}



// ===============================
// SPLIT PDF
// ===============================

function openSplitPdf() {
    toolContent.innerHTML = `
        <h2>Split PDF</h2>

        <p>Select a PDF and choose the pages you want to keep.</p>

        <label class="upload-area">
            <input
                type="file"
                id="splitPdfInput"
                accept="application/pdf"
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose PDF</strong>

            <small>Select one PDF file</small>
        </label>

        <div id="splitPages"></div>

        <button
            class="process-button"
            id="splitPdfButton"
        >
            Split PDF
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("splitPdfInput");
    const pagesBox = document.getElementById("splitPages");
    const button = document.getElementById("splitPdfButton");

    let pdf = null;

    input.addEventListener("change", async () => {
        if (!input.files.length) return;

        pagesBox.innerHTML = "Loading pages...";

        try {
            const bytes = await input.files[0].arrayBuffer();

            pdf = await PDFLib.PDFDocument.load(bytes);

            pagesBox.innerHTML = "";

            for (let i = 0; i < pdf.getPageCount(); i++) {
                const label = document.createElement("label");

                label.style.display = "block";
                label.style.padding = "10px";
                label.style.margin = "5px 0";
                label.style.background =
                    "rgba(255,255,255,0.05)";
                label.style.borderRadius = "8px";

                label.innerHTML = `
                    <input
                        type="checkbox"
                        value="${i}"
                    >
                    Page ${i + 1}
                `;

                pagesBox.appendChild(label);
            }

        } catch (error) {
            console.error(error);
            pagesBox.innerHTML = "Invalid PDF file.";
        }
    });

    button.addEventListener("click", async () => {
        if (!pdf) {
            alert("Please select a PDF first.");
            return;
        }

        const checked = pagesBox.querySelectorAll(
            'input[type="checkbox"]:checked'
        );

        if (!checked.length) {
            alert("Please select at least one page.");
            return;
        }

        button.disabled = true;
        button.textContent = "Creating PDF...";

        try {
            const newPdf = await PDFLib.PDFDocument.create();

            const pageIndexes = Array.from(checked).map(
                checkbox => Number(checkbox.value)
            );

            const pages = await newPdf.copyPages(
                pdf,
                pageIndexes
            );

            pages.forEach(page => {
                newPdf.addPage(page);
            });

            const pdfBytes = await newPdf.save();

            const blob = new Blob(
                [pdfBytes],
                { type: "application/pdf" }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "split.pdf";

            link.click();

            URL.revokeObjectURL(url);

            button.textContent = "PDF Downloaded ✓";

        } catch (error) {
            console.error(error);

            alert("PDF split nahi ho saki.");

            button.disabled = false;
            button.textContent = "Split PDF";
        }
    });
}
// ===============================
// ROTATE PDF
// ===============================

function openRotatePdf() {
    toolContent.innerHTML = `
        <h2>Rotate PDF</h2>

        <p>Upload a PDF and rotate all pages.</p>

        <label class="upload-area">
            <input
                type="file"
                id="rotatePdfInput"
                accept="application/pdf"
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose PDF</strong>

            <small>Select one PDF file</small>
        </label>

        <select
            id="rotateAngle"
            style="
                width:100%;
                padding:12px;
                margin:15px 0;
                border-radius:8px;
                background:#111827;
                color:white;
                border:1px solid rgba(255,255,255,0.15);
            "
        >
            <option value="90">Rotate 90°</option>
            <option value="180">Rotate 180°</option>
            <option value="270">Rotate 270°</option>
        </select>

        <button
            class="process-button"
            id="rotatePdfButton"
        >
            Rotate PDF
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("rotatePdfInput");
    const angleSelect = document.getElementById("rotateAngle");
    const button = document.getElementById("rotatePdfButton");

    button.addEventListener("click", async () => {

        if (!input.files.length) {
            alert("Please select a PDF file.");
            return;
        }

        button.disabled = true;
        button.textContent = "Rotating...";

        try {
            const bytes = await input.files[0].arrayBuffer();

            const pdf = await PDFLib.PDFDocument.load(bytes);

            const angle = Number(angleSelect.value);

            const pages = pdf.getPages();

            pages.forEach(page => {
                page.setRotation(
                    PDFLib.degrees(angle)
                );
            });

            const pdfBytes = await pdf.save();

            const blob = new Blob(
                [pdfBytes],
                { type: "application/pdf" }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "rotated.pdf";

            link.click();

            URL.revokeObjectURL(url);

            button.textContent = "PDF Downloaded ✓";

        } catch (error) {
            console.error(error);

            alert("PDF rotate nahi ho saki.");

            button.disabled = false;
            button.textContent = "Rotate PDF";
        }
    });
}

// ===============================
// DELETE PAGES
// ===============================

function openDeletePages() {
    toolContent.innerHTML = `
        <h2>Delete Pages</h2>

        <p>Select a PDF and choose the pages you want to remove.</p>

        <label class="upload-area">
            <input
                type="file"
                id="deletePagesInput"
                accept="application/pdf"
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose PDF</strong>

            <small>Select one PDF file</small>
        </label>

        <div id="deletePagesList"></div>

        <button
            class="process-button"
            id="deletePagesButton"
        >
            Delete Selected Pages
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("deletePagesInput");
    const pagesBox = document.getElementById("deletePagesList");
    const button = document.getElementById("deletePagesButton");

    let pdf = null;

    input.addEventListener("change", async () => {
        if (!input.files.length) return;

        pagesBox.innerHTML = "Loading pages...";

        try {
            const bytes = await input.files[0].arrayBuffer();

            pdf = await PDFLib.PDFDocument.load(bytes);

            pagesBox.innerHTML = "";

            for (let i = 0; i < pdf.getPageCount(); i++) {
                const label = document.createElement("label");

                label.style.display = "block";
                label.style.padding = "10px";
                label.style.margin = "5px 0";
                label.style.background =
                    "rgba(255,255,255,0.05)";
                label.style.borderRadius = "8px";

                label.innerHTML = `
                    <input
                        type="checkbox"
                        value="${i}"
                    >
                    Delete Page ${i + 1}
                `;

                pagesBox.appendChild(label);
            }

        } catch (error) {
            console.error(error);
            pagesBox.innerHTML = "Invalid PDF file.";
        }
    });

    button.addEventListener("click", async () => {

        if (!pdf) {
            alert("Please select a PDF first.");
            return;
        }

        const selected = Array.from(
            pagesBox.querySelectorAll(
                'input[type="checkbox"]:checked'
            )
        ).map(checkbox => Number(checkbox.value));

        if (!selected.length) {
            alert("Please select at least one page to delete.");
            return;
        }

        if (selected.length >= pdf.getPageCount()) {
            alert("At least one page must remain.");
            return;
        }

        button.disabled = true;
        button.textContent = "Deleting Pages...";

        try {
            const newPdf = await PDFLib.PDFDocument.create();

            const keepPages = [];

            for (let i = 0; i < pdf.getPageCount(); i++) {
                if (!selected.includes(i)) {
                    keepPages.push(i);
                }
            }

            const pages = await newPdf.copyPages(
                pdf,
                keepPages
            );

            pages.forEach(page => {
                newPdf.addPage(page);
            });

            const pdfBytes = await newPdf.save();

            const blob = new Blob(
                [pdfBytes],
                { type: "application/pdf" }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "pages-deleted.pdf";

            link.click();

            URL.revokeObjectURL(url);

            button.textContent = "PDF Downloaded ✓";

        } catch (error) {
            console.error(error);

            alert("Pages delete nahi ho saken.");

            button.disabled = false;
            button.textContent = "Delete Selected Pages";
        }
    });
}

// ===============================
// EXTRACT PAGES
// ===============================

function openExtractPages() {
    toolContent.innerHTML = `
        <h2>Extract Pages</h2>

        <p>Select a PDF and choose the pages you want to extract.</p>

        <label class="upload-area">
            <input
                type="file"
                id="extractPagesInput"
                accept="application/pdf"
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose PDF</strong>

            <small>Select one PDF file</small>
        </label>

        <div id="extractPagesList"></div>

        <button
            class="process-button"
            id="extractPagesButton"
        >
            Extract Pages
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("extractPagesInput");
    const pagesBox = document.getElementById("extractPagesList");
    const button = document.getElementById("extractPagesButton");

    let pdf = null;

    input.addEventListener("change", async () => {
        if (!input.files.length) return;

        pagesBox.innerHTML = "Loading pages...";

        try {
            const bytes = await input.files[0].arrayBuffer();

            pdf = await PDFLib.PDFDocument.load(bytes);

            pagesBox.innerHTML = "";

            for (let i = 0; i < pdf.getPageCount(); i++) {
                const label = document.createElement("label");

                label.style.display = "block";
                label.style.padding = "10px";
                label.style.margin = "5px 0";
                label.style.background =
                    "rgba(255,255,255,0.05)";
                label.style.borderRadius = "8px";

                label.innerHTML = `
                    <input
                        type="checkbox"
                        value="${i}"
                    >
                    Extract Page ${i + 1}
                `;

                pagesBox.appendChild(label);
            }

        } catch (error) {
            console.error(error);
            pagesBox.innerHTML = "Invalid PDF file.";
        }
    });

    button.addEventListener("click", async () => {

        if (!pdf) {
            alert("Please select a PDF first.");
            return;
        }

        const selected = Array.from(
            pagesBox.querySelectorAll(
                'input[type="checkbox"]:checked'
            )
        ).map(checkbox => Number(checkbox.value));

        if (!selected.length) {
            alert("Please select at least one page.");
            return;
        }

        button.disabled = true;
        button.textContent = "Extracting...";

        try {
            const newPdf = await PDFLib.PDFDocument.create();

            const pages = await newPdf.copyPages(
                pdf,
                selected
            );

            pages.forEach(page => {
                newPdf.addPage(page);
            });

            const pdfBytes = await newPdf.save();

            const blob = new Blob(
                [pdfBytes],
                { type: "application/pdf" }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "extracted-pages.pdf";

            link.click();

            URL.revokeObjectURL(url);

            button.textContent = "PDF Downloaded ✓";

        } catch (error) {
            console.error(error);

            alert("Pages extract nahi ho saken.");

            button.disabled = false;
            button.textContent = "Extract Pages";
        }
    });
}

// ===============================
// COMPRESS PDF
// ===============================

function openCompressPdf() {
    toolContent.innerHTML = `
        <h2>Compress PDF</h2>

        <p>Select a PDF and create a smaller optimized copy.</p>

        <label class="upload-area">
            <input
                type="file"
                id="compressPdfInput"
                accept="application/pdf"
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose PDF</strong>

            <small>Select one PDF file</small>
        </label>

        <button
            class="process-button"
            id="compressPdfButton"
        >
            Compress PDF
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("compressPdfInput");
    const button = document.getElementById("compressPdfButton");

    button.addEventListener("click", async () => {

        if (!input.files.length) {
            alert("Please select a PDF first.");
            return;
        }

        button.disabled = true;
        button.textContent = "Compressing...";

        try {
            const bytes = await input.files[0].arrayBuffer();

            const pdf = await PDFLib.PDFDocument.load(bytes);

            const compressedBytes = await pdf.save({
                useObjectStreams: true,
                addDefaultPage: false
            });

            const blob = new Blob(
                [compressedBytes],
                { type: "application/pdf" }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "compressed.pdf";

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);

            button.textContent = "PDF Downloaded ✓";

        } catch (error) {
            console.error(error);

            alert("PDF compress nahi ho saki.");

            button.disabled = false;
            button.textContent = "Compress PDF";
        }
    });
}

// ===============================
// WATERMARK PDF
// ===============================

function openWatermarkPdf() {
    toolContent.innerHTML = `
        <h2>Watermark PDF</h2>

        <p>Add a text watermark to every page.</p>

        <label class="upload-area">
            <input
                type="file"
                id="watermarkPdfInput"
                accept="application/pdf"
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose PDF</strong>

            <small>Select one PDF file</small>
        </label>

        <input
            type="text"
            id="watermarkText"
            placeholder="Enter watermark text"
            style="
                width:100%;
                padding:12px;
                margin:15px 0;
                border-radius:8px;
                background:#111827;
                color:white;
                border:1px solid rgba(255,255,255,0.15);
            "
        >

        <button
            class="process-button"
            id="watermarkButton"
        >
            Add Watermark
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("watermarkPdfInput");
    const textInput = document.getElementById("watermarkText");
    const button = document.getElementById("watermarkButton");

    button.addEventListener("click", async () => {

        if (!input.files.length) {
            alert("Please select a PDF first.");
            return;
        }

        if (!textInput.value.trim()) {
            alert("Please enter watermark text.");
            return;
        }

        button.disabled = true;
        button.textContent = "Adding Watermark...";

        try {
            const bytes = await input.files[0].arrayBuffer();

            const pdf = await PDFLib.PDFDocument.load(bytes);

            const pages = pdf.getPages();

            const font = await pdf.embedFont(
                PDFLib.StandardFonts.Helvetica
            );

            const watermark = textInput.value.trim();

            pages.forEach(page => {
                const { width, height } = page.getSize();

                page.drawText(watermark, {
                    x: width / 2 - 80,
                    y: height / 2,
                    size: 30,
                    font: font,
                    opacity: 0.25,
                    rotate: PDFLib.degrees(45)
                });
            });

            const pdfBytes = await pdf.save();

            const blob = new Blob(
                [pdfBytes],
                { type: "application/pdf" }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "watermarked.pdf";

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);

            button.textContent = "PDF Downloaded ✓";

        } catch (error) {
            console.error(error);

            alert("Watermark add nahi ho saka.");

            button.disabled = false;
            button.textContent = "Add Watermark";
        }
    });
}

// ===============================
// TEXT TO PDF
// ===============================

function openTextToPdf() {
    toolContent.innerHTML = `
        <h2>Text to PDF</h2>

        <p>Write your text and convert it into a PDF.</p>

        <textarea
            id="textToPdfInput"
            placeholder="Write your text here..."
            style="
                width:100%;
                min-height:220px;
                padding:15px;
                margin:15px 0;
                border-radius:10px;
                background:#111827;
                color:white;
                border:1px solid rgba(255,255,255,0.15);
                resize:vertical;
                font-size:16px;
            "
        ></textarea>

        <button
            class="process-button"
            id="textToPdfButton"
        >
            Create PDF
        </button>
    `;

    modal.classList.add("active");

    const textInput =
        document.getElementById("textToPdfInput");

    const button =
        document.getElementById("textToPdfButton");

    button.addEventListener("click", async () => {

        const text = textInput.value.trim();

        if (!text) {
            alert("Please enter some text.");
            return;
        }

        button.disabled = true;
        button.textContent = "Creating PDF...";

        try {
            const pdf = await PDFLib.PDFDocument.create();

            const font = await pdf.embedFont(
                PDFLib.StandardFonts.Helvetica
            );

            const page = pdf.addPage([
                595.28,
                841.89
            ]);

            const fontSize = 14;
            const margin = 50;
            const lineHeight = 22;

            const lines = text.split("\n");

            let y = 790;

            for (const line of lines) {

                if (y < margin) {
                    y = 790;
                    pdf.addPage([
                        595.28,
                        841.89
                    ]);
                }

                page.drawText(line, {
                    x: margin,
                    y: y,
                    size: fontSize,
                    font: font
                });

                y -= lineHeight;
            }

            const pdfBytes = await pdf.save();

            const blob = new Blob(
                [pdfBytes],
                { type: "application/pdf" }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "text-document.pdf";

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);

            button.textContent = "PDF Downloaded ✓";

        } catch (error) {

            console.error(error);

            alert("PDF create nahi ho saki.");

            button.disabled = false;
            button.textContent = "Create PDF";
        }
    });
}

    const name = toolNames[tool] || "PDF Tool";

    toolContent.innerHTML = `
        <h2>${name}</h2>

        <p>
            This tool will be added in the next development step.
        </p>
    `;

    modal.classList.add("active");
}
function openMergePdf() {
    toolContent.innerHTML = `
        <h2>Merge PDF</h2>

        <p>
            Select two or more PDF files and combine them
            into one PDF.
        </p>

        <label class="upload-area">
            <input
                type="file"
                id="mergePdfInput"
                accept="application/pdf"
                multiple
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose PDF Files</strong>

            <small>
                Select 2 or more PDF files
            </small>
        </label>

        <div id="mergeFileList"></div>

        <button
            class="process-button"
            id="mergePdfButton"
        >
            Merge PDFs
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("mergePdfInput");
    const fileList = document.getElementById("mergeFileList");
    const mergeButton = document.getElementById("mergePdfButton");

    input.addEventListener("change", () => {
        fileList.innerHTML = "";

        Array.from(input.files).forEach((file, index) => {
            const item = document.createElement("div");

            item.textContent = `${index + 1}. ${file.name}`;

            item.style.padding = "10px";
            item.style.margin = "6px 0";
            item.style.background = "rgba(255,255,255,0.05)";
            item.style.borderRadius = "8px";

            fileList.appendChild(item);
        });
    });

    mergeButton.addEventListener("click", async () => {
        if (input.files.length < 2) {
            alert("Please select at least 2 PDF files.");
            return;
        }

        mergeButton.disabled = true;
        mergeButton.textContent = "Merging PDFs...";

        try {
            const mergedPdf = await PDFLib.PDFDocument.create();

            for (const file of input.files) {
                const fileBytes = await file.arrayBuffer();

                const pdf = await PDFLib.PDFDocument.load(fileBytes);

                const pages = await mergedPdf.copyPages(
                    pdf,
                    pdf.getPageIndices()
                );

                pages.forEach(page => {
                    mergedPdf.addPage(page);
                });
            }

            const pdfBytes = await mergedPdf.save();

            const blob = new Blob(
                [pdfBytes],
                { type: "application/pdf" }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "merged.pdf";

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);

            mergeButton.textContent = "PDF Merged ✓";

        } catch (error) {
            console.error(error);

            alert(
                "PDF merge nahi ho saki. Dobara try karein."
            );

            mergeButton.disabled = false;
            mergeButton.textContent = "Merge PDFs";
        }
    });
}

// ===============================
// PDF TO JPG
// ===============================

function openPdfToJpg() {
   

    toolContent.innerHTML = `
        <h2>PDF to JPG</h2>

        <p>
            Select a PDF and convert its pages into JPG images.
        </p>

        <label class="upload-area">
            <input
                type="file"
                id="pdfToJpgInput"
                accept="application/pdf"
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose PDF</strong>

            <small>
                Select one PDF file
            </small>
        </label>

        <div id="pdfJpgPreview"></div>

        <button
            class="process-button"
            id="convertPdfToJpgButton"
        >
            Convert to JPG
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("pdfToJpgInput");
    const preview = document.getElementById("pdfJpgPreview");
    const button = document.getElementById("convertPdfToJpgButton");

    button.addEventListener("click", async () => {

        if (!input.files.length) {
            alert("Please select a PDF file.");
            return;
        }

        button.disabled = true;
        button.textContent = "Converting...";

        try {
            const pdfjsLib = await import(
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs"
            );

            pdfjsLib.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

            const file = input.files[0];
            const arrayBuffer = await file.arrayBuffer();

            const pdf = await pdfjsLib.getDocument({
                data: arrayBuffer
            }).promise;

            preview.innerHTML = "";

            for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {

                const page = await pdf.getPage(pageNumber);

                const viewport = page.getViewport({
                    scale: 1.5
                });

                const canvas = document.createElement("canvas");

                const context = canvas.getContext("2d");

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                const imageUrl = canvas.toDataURL(
                    "image/jpeg",
                    0.92
                );

                const container = document.createElement("div");

                container.style.margin = "20px 0";
                container.style.padding = "15px";
                container.style.background =
                    "rgba(255,255,255,0.05)";
                container.style.borderRadius = "12px";

                const image = document.createElement("img");

                image.src = imageUrl;
                image.style.width = "100%";
                image.style.maxWidth = "500px";
                image.style.display = "block";
                image.style.marginBottom = "12px";
                image.style.borderRadius = "8px";

                const downloadButton =
                    document.createElement("button");

                downloadButton.className = "process-button";
                downloadButton.textContent =
                    `Download Page ${pageNumber} JPG`;

                downloadButton.onclick = () => {

                    const link =
                        document.createElement("a");

                    link.href = imageUrl;

                    link.download =
                        `page-${pageNumber}.jpg`;

                    document.body.appendChild(link);

                    link.click();

                    link.remove();
                };

                container.appendChild(image);
                container.appendChild(downloadButton);

                preview.appendChild(container);
            }

            button.textContent = "Conversion Complete ✓";

        } catch (error) {

            console.error(error);

            alert(
                "PDF convert nahi ho saki. Dobara try karein."
            );

            button.disabled = false;
            button.textContent = "Convert to JPG";
        }
    });
}

// ===============================
// JPG TO PDF
// ===============================

function openJpgToPdf() {

    toolContent.innerHTML = `
        <h2>JPG to PDF</h2>

        <p>
            Select one or more JPG/PNG images and convert them into
            a single PDF file.
        </p>

        <label class="upload-area">

            <input
                type="file"
                id="jpgInput"
                accept="image/jpeg,image/png"
                multiple
                hidden
            >

            <span class="upload-icon">↑</span>

            <strong>Choose Images</strong>

            <small>
                JPG or PNG — You can select multiple images
            </small>

        </label>

        <div id="imagePreview"></div>

        <button
            class="process-button"
            id="convertJpgButton"
        >
            Convert to PDF
        </button>
    `;

    modal.classList.add("active");

    const input = document.getElementById("jpgInput");
    const preview = document.getElementById("imagePreview");
    const convertButton =
        document.getElementById("convertJpgButton");


    // ===============================
    // IMAGE PREVIEW
    // ===============================

    input.addEventListener("change", () => {

        preview.innerHTML = "";

        if (!input.files.length) {
            return;
        }

        Array.from(input.files).forEach(file => {

            const image = document.createElement("img");

            image.src = URL.createObjectURL(file);

            image.style.width = "100px";
            image.style.height = "100px";
            image.style.objectFit = "cover";
            image.style.margin = "8px";
            image.style.borderRadius = "10px";

            preview.appendChild(image);

        });

    });


    // ===============================
    // CONVERT JPG TO PDF
    // ===============================

    convertButton.addEventListener("click", async () => {

        if (!input.files.length) {

            alert("Please select at least one image.");

            return;
        }

        convertButton.disabled = true;

        convertButton.textContent =
            "Creating PDF...";


        try {

            const pdfDoc =
                await PDFLib.PDFDocument.create();


            for (const file of input.files) {

                const imageBytes =
                    await file.arrayBuffer();

                let image;


                if (file.type === "image/jpeg") {

                    image =
                        await pdfDoc.embedJpg(imageBytes);

                } else {

                    image =
                        await pdfDoc.embedPng(imageBytes);

                }


                const width = image.width;
                const height = image.height;


                const page =
                    pdfDoc.addPage([
                        width,
                        height
                    ]);


                page.drawImage(image, {

                    x: 0,
                    y: 0,

                    width: width,
                    height: height

                });

            }


            const pdfBytes =
                await pdfDoc.save();


            const blob =
                new Blob(
                    [pdfBytes],
                    {
                        type: "application/pdf"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                "converted-images.pdf";


            document.body.appendChild(link);

            link.click();

            link.remove();


            URL.revokeObjectURL(url);


            convertButton.textContent =
                "PDF Downloaded ✓";


        } catch (error) {

            console.error(error);


            alert(
                "PDF create nahi ho saki. Dobara try karein."
            );


            convertButton.disabled = false;

            convertButton.textContent =
                "Convert to PDF";

        }

    });

}


// ===============================
// ALL TOOL CARDS CLICKABLE
// ===============================

toolCards.forEach(card => {

    card.addEventListener("click", event => {

        // Agar card ke andar button/link ho
        // to uska normal action bhi card ke through chalega

        const tool =
            card.dataset.tool;


        if (tool) {

            openTool(tool);

        }

    });

});


// ===============================
// CLOSE MODAL
// ===============================

function closeTool() {

    modal.classList.remove("active");

}


// Close button

closeModal.addEventListener(
    "click",
    closeTool
);


// Close when clicking outside modal

modalOverlay.addEventListener(
    "click",
    event => {

        if (event.target === modalOverlay) {

            closeTool();

        }

    }
);


// Close with Escape key

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeTool();

        }

    }
);


// ===============================
// NAVIGATION FIX
// ===============================

const toolsLink = document.querySelector('.nav-links a[href="#tools"]');

const aboutLink = document.querySelector('.nav-links a[href="#about"]');


// TOOLS NAVIGATION

if (toolsLink) {

    toolsLink.addEventListener("click", function(event) {

        event.preventDefault();

        closeTool();

        document.getElementById("tools").scrollIntoView({
            behavior: "smooth"
        });

    });

}


// ABOUT NAVIGATION

if (aboutLink) {

    aboutLink.addEventListener("click", function(event) {

        event.preventDefault();

        closeTool();

        document.getElementById("about").scrollIntoView({
            behavior: "smooth"
        });

    });

}
function openQrCode() {
    toolContent.innerHTML = `
        <h2>QR Code Generator</h2>
        <p>Enter text or a link and generate a QR code.</p>

        <input
            type="text"
            id="qrInput"
            placeholder="Enter text or URL..."
            style="
                width:100%;
                padding:14px;
                margin:15px 0;
                border-radius:10px;
                background:#111827;
                color:white;
                border:1px solid rgba(255,255,255,0.15);
                font-size:16px;
            "
        >

        <button class="process-button" id="qrButton">
            Generate QR Code
        </button>

        <div id="qrResult" style="
            margin-top:20px;
            text-align:center;
        "></div>
    `;

    modal.classList.add("active");

    const input = document.getElementById("qrInput");
    const button = document.getElementById("qrButton");
    const result = document.getElementById("qrResult");

    button.addEventListener("click", () => {

        const text = input.value.trim();

        if (!text) {
            alert("Please enter text or a URL.");
            return;
        }

        const qrUrl =
            "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
            encodeURIComponent(text);

        result.innerHTML = `
            <img
                src="${qrUrl}"
                alt="Generated QR Code"
                style="
                    width:300px;
                    max-width:100%;
                    border-radius:12px;
                    background:white;
                    padding:10px;
                "
            >

            <br><br>

            <button
    id="downloadQrButton"
    class="process-button"
    style="display:inline-block;"
>
    Download QR Code
</button>
        `;
    });
}


function openQrCode() {
    toolContent.innerHTML = `
        <h2>QR Code Generator</h2>
        <p>Enter text or a link and generate a QR code.</p>

        <input
            type="text"
            id="qrInput"
            placeholder="Enter text or URL..."
            style="
                width:100%;
                padding:14px;
                margin:15px 0;
                border-radius:10px;
                background:#111827;
                color:white;
                border:1px solid rgba(255,255,255,0.15);
                font-size:16px;
            "
        >

        <button class="process-button" id="qrButton">
            Generate QR Code
        </button>

        <div id="qrResult" style="
            margin-top:20px;
            text-align:center;
        "></div>
    `;

    modal.classList.add("active");

    const input = document.getElementById("qrInput");
    const button = document.getElementById("qrButton");
    const result = document.getElementById("qrResult");

    button.addEventListener("click", () => {
        const text = input.value.trim();

        if (!text) {
            alert("Please enter text or a URL.");
            return;
        }

        result.innerHTML = `
            <div id="qrCodeBox"></div>

            <br>

            <button
                id="downloadQrButton"
                class="process-button"
            >
                Download QR Code
            </button>
        `;

        const qrBox = document.getElementById("qrCodeBox");

        new QRCode(qrBox, {
            text: text,
            width: 300,
            height: 300,
            correctLevel: QRCode.CorrectLevel.H
        });

        const downloadButton =
            document.getElementById("downloadQrButton");

        downloadButton.addEventListener("click", () => {
            const canvas = qrBox.querySelector("canvas");

            if (!canvas) {
                alert("QR Code ready nahi hua.");
                return;
            }

            const link = document.createElement("a");

            link.download = "qr-code.png";
            link.href = canvas.toDataURL("image/png");

            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    });
}

