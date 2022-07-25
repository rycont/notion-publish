import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("styled-input")
export class StyledInput extends LitElement {
  @property()
  placeholder: string = "";

  @property()
  name: string = "";

  static styles = css`
    input {
      width: 100%;
      padding: 3rem;
      border-radius: 2rem;
      border: 0.4rem solid #787878;
      background-color: #f3f3f3;
      box-sizing: border-box;
    }
  `;

  onChange(e: KeyboardEvent) {
    const { value } = e.target as HTMLInputElement;
    this.dispatchEvent(
      new CustomEvent("content-change", {
        detail: value,
      })
    );
  }

  render() {
    return html`
      <input
        type="text"
        @input=${this.onChange}
        placeholder=${this.placeholder}
      />
    `;
  }
}
