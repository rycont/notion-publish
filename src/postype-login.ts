import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { button } from "./button";
import { postype } from "./postype-api";

@customElement("postype-login")
export class PostypeLogin extends LitElement {
  static styles = [
    button,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }
    `,
  ];

  @state()
  inputContent: Record<string, string> = {};

  @state()
  isLoading: boolean = false;

  firstUpdated() {
    const inputs = [
      ...(this.shadowRoot?.querySelectorAll("styled-input") || []),
    ] as HTMLInputElement[];

    for (const input of inputs) {
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
    this.isLoading = true;
    try {
      await postype.login(this.inputContent.email, this.inputContent.password);
      const channels = await postype.getChannels();
      localStorage.setItem("postype_channels", JSON.stringify(channels));

      this.dispatchEvent(new CustomEvent("next-page"));
    } catch (e) {
      alert("로그인에 실패했어요");
    } finally {
      this.isLoading = false;
    }
  }

  render() {
    return html`
      <styled-input placeholder="이메일" name="email"></styled-input>
      <styled-input
        placeholder="비밀번호"
        type="password"
        name="password"
      ></styled-input>
      <button @click=${this.login} style=${this.isLoading && "opacity: 0.3"}>
        가보자고!
      </button>
    `;
  }
}
