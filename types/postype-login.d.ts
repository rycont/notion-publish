import { LitElement } from "lit";
export declare class PostypeLogin extends LitElement {
    static styles: import("lit").CSSResult;
    inputContent: Record<string, string>;
    isLoading: boolean;
    firstUpdated(): void;
    login(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
