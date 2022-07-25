import { LitElement } from "lit";
export declare class StyledInput extends LitElement {
    placeholder: string;
    name: string;
    type: string;
    static styles: import("lit").CSSResult;
    onChange(e: KeyboardEvent): void;
    render(): import("lit-html").TemplateResult<1>;
}
