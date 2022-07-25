import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { postype } from "./postype-api";

@customElement("postype-login")
export class PostypeLogin extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    button {
      width: 100%;
      padding: 2rem;
      border-radius: 2rem;
      background-color: black;
      color: white;
    }
  `;

  @state()
  inputContent: Record<string, string> = {};

  firstUpdated() {
    const inputs = [
      ...(this.shadowRoot?.querySelectorAll("styled-input") || []),
    ] as HTMLInputElement[];

    for (const input of inputs) {
      console.log(input.name);
      if (input.name)
        input.addEventListener("content-change", (e) => {
          const { detail } = e as CustomEvent<string>;
          this.inputContent = {
            ...this.inputContent,
            [input.name]: detail,
          };
        });
    }
  }

  async login() {
    try {
      await postype.login(this.inputContent.email, this.inputContent.password);
      const channels = await postype.getChannels();
      localStorage.setItem("postype_channels", JSON.stringify(channels));

      this.dispatchEvent(new CustomEvent("next-page"));
    } catch (e) {
      alert("로그인에 실패했어요");
    }
  }

  render() {
    return html`
      <styled-input placeholder="이메일" name="email"></styled-input>
      <styled-input placeholder="비밀번호" name="password"></styled-input>
      <button @click=${this.login}>가보자고!</button>
    `;
  }
}
