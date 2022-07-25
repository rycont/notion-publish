import { LitElement } from "lit";
import { PostypeChannel } from "./types";
export declare class SelectPostypeChannel extends LitElement {
    static styles: import("lit").CSSResult;
    channels: PostypeChannel[];
    selectChannel(channel: PostypeChannel): void;
    render(): import("lit-html").TemplateResult<1>;
}
