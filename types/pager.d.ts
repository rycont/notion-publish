import { LitElement } from "lit";
import "./notion-page-input";
import "./postype-login";
import "./select-postype-channel";
import "./postype-upload";
export declare class MyElement extends LitElement {
    static styles: import("lit").CSSResult;
    updated(changedProperties: Map<string, any>): void;
    page: number;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "pager-element": MyElement;
    }
}
