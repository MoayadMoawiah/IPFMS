export declare class PdfService {
    private readonly logger;
    generate(documentType: string, documentId: string): Promise<Buffer>;
    generateAndStore(documentType: string, documentId: string, fileName: string): Promise<string>;
}
