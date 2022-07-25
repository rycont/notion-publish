import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { PostypeChannel } from "./types";

@customElement("select-postype-channel")
export class SelectPostypeChannel extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    button {
      border: 1px solid black;
      padding: 3rem;
      display: flex;
      justify-content: space-between;
      border-radius: 1rem;
      align-items: center;
      background-color: white;
      font-family: inherit;
    }

    h2 {
      margin: 0px;
      font-size: 3.5rem;
    }

    p {
      margin: 0px;
      font-size: 3rem;
    }
  `;

  channels: PostypeChannel[] = JSON.parse(
    localStorage.getItem("postype_channels") || "[]"
  );

  selectChannel(channel: PostypeChannel) {
    localStorage.setItem("postype_channel", JSON.stringify(channel));
    this.dispatchEvent(new CustomEvent("next-page"));
  }

  render() {
    return html`
      ${this.channels.map(
        (e) => html`
          <button @click=${() => this.selectChannel(e)}>
            <h2>${e.name}</h2>
            <p>${e.symbol}</p>
          </button>
        `
      )}
    `;
  }
}
