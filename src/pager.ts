import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "./notion-page-input";
import "./postype-login";
import "./select-postype-channel";
import "./postype-upload";

const pages = [
  {
    label: "노션 퍼블릭 페이지의 링크를 입력해주세요",
    description:
      "이 사이트에서는 노션 글을 포타로 옮기기 위해서 노션 글의 내용과 포타 계정을 입력받지만 그 어떤 정보도 저장하지는 않습니다.. 저장할 돈도 없고요ㅜ",
    element: html`<notion-page-input page></notion-page-input>`,
  },
  {
    label: "포스타입 계정으로 로그인해주세요",
    description:
      "소셜로그인을 사용하고 있다면, 내 정보 페이지에서 이메일과 비밀번호를 설정한 후에 이용할 수 있어요",
    element: html`<postype-login page></postype-login>`,
  },
  {
    label: "채널을 선택해주세요",
    element: html`<select-postype-channel page></select-postype-channel>`,
    description: "첫 번째 프로필의 채널만 표시됩니다",
  },
  {
    label: "글을 찌고 있어요..",
    element: html`<postype-upload page></postype-upload>`,
  },
];

@customElement("pager-element")
export class MyElement extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-self: stretch;
    }

    h1 {
      font-size: 5rem;
    }

    p {
      font-size: 4rem;
      margin-top: 12rem;
    }
  `;

  updated(changedProperties: Map<string, any>) {
    console.log(changedProperties);

    for (const page of this.shadowRoot?.querySelectorAll("[page]") || []) {
      page.addEventListener("next-page", (() => {
        console.log("담페");
        this.page++;
      }) as EventListener);
    }
  }

  @state()
  page: number = 0;

  render() {
    return html`<h1>${pages[this.page].label}</h1>
      ${pages[this.page].element}
      <p>${pages[this.page].description}</p> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pager-element": MyElement;
  }
}
