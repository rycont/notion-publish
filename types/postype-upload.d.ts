import { LitElement } from "lit";
export declare class PostypeUpload extends LitElement {
    static styles: import("lit").CSSResult;
    currentIndex: number;
    imageAmount: number;
    isFin: boolean;
    protected firstUpdated(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
