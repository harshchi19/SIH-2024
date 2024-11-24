import PDFDocument from "pdfkit";
import fs from "fs";
import { format, parseISO } from "date-fns";

export const generatePdf = (data, fileName) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margins: {
                    top: 50,
                    bottom: 50,
                    left: 75,
                    right: 75
                }
            });

            const writeStream = fs.createWriteStream(fileName);
            doc.pipe(writeStream);

            const colors = {
                primary: '#2563EB',
                secondary: '#067a54',
                text: '#1F2937',
                background: '#F3F4F6',
                accent: '#6366F1'
            };

            const formatKey = (key) => {
                return key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase());
            };

            const formatValue = (key, value) => {
                if (key === 'date_of_birth' && value) {
                    return format(parseISO(value), 'MMMM dd, yyyy');
                }
                if (value === null) return 'Not Provided';
                return value.toString();
            };

            doc
                .fillColor(colors.primary)
                .fontSize(25)
                .font('Helvetica-Bold')
                .text('Patient Details', { align: 'center' })
                .moveDown(0.5);

            doc
                .fillColor(colors.text)
                .fontSize(12)
                .font('Helvetica')
                .text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, { align: 'center' })
                .moveDown(1);

            doc
                .strokeColor(colors.primary)
                .lineWidth(2)
                .moveTo(75, doc.y)
                .lineTo(doc.page.width - 75, doc.y)
                .stroke()
                .moveDown(1);

            const renderSection = (sectionName, sectionData) => {
                doc
                    .fillColor(colors.secondary)
                    .fontSize(16)
                    .font('Helvetica-Bold')
                    .text(formatKey(sectionName), {
                        underline: true
                    })
                    .moveDown(0.5);

                doc.fillColor(colors.text).fontSize(12).font('Helvetica');

                Object.entries(sectionData).forEach(([key, value]) => {
                    doc
                        .fillColor(colors.secondary)
                        .font('Helvetica-Bold')
                        .text(`${formatKey(key)}: `, { continued: true })
                        .fillColor(colors.text)
                        .font('Helvetica')
                        .text(formatValue(key, value))
                        .moveDown(0.5);
                });

                doc.moveDown(0.5);
            };

            Object.entries(data).forEach(([sectionName, sectionData]) => {
                renderSection(sectionName, sectionData);
            });

            doc
                .fillColor(colors.accent)
                .fontSize(10)
                .font('Helvetica')
                .text('Confidential Document - Patient Onboarding', {
                    align: 'center',
                    valign: 'bottom'
                });

            doc.end();

            writeStream.on("finish", () => resolve(fileName));
            writeStream.on("error", reject);

        } catch (error) {
            reject(error);
        }
    });
};