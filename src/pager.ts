import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "./notion-page-input";
import "./postype-login";
import "./select-postype-channel";
import "./postype-upload";

const pages = [
  {
    label: "노션 퍼블릭 페이지의 링크를 입력해주세요",
    description: [
      "이 사이트에서는 노션 글을 포타로 옮기기 위해서 노션 글의 내용과 포타 계정을 입력받지만 그 어떤 정보도 저장하지는 않습니다.. 저장할 돈도 없고요ㅜ",
      ,
      "중첩된 내용(토글, 리스트 등..)은 잘 변환하지 못할 수 있습니다. 그냥 글만 쭉 써져있고.. 제목 몇 개 있고.. 이미지정도가 들어있는 페이지를 잘 옮겨줘요. 아.. 이미지도 벡터이미지는 못옮겨줘요",
    ],
    element: html`<notion-page-input page></notion-page-input>`,
  },
  {
    label: "포스타입 계정으로 로그인해주세요",
    description: [
      "소셜로그인을 사용하고 있다면, 내 정보 페이지에서 이메일과 비밀번호를 설정한 후에 이용할 수 있어요",
    ],
    element: html`<postype-login page></postype-login>`,
  },
  {
    label: "채널을 선택해주세요",
    element: html`<select-postype-channel page></select-postype-channel>`,
    description: ["첫 번째 프로필의 채널만 표시됩니다"],
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
      /* margin-top: 12rem; */
    }
  `;

  updated(changedProperties: Map<string, any>) {

    for (const page of this.shadowRoot?.querySelectorAll("[page]") || []) {
      page.addEventListener("next-page", (() => {
        this.page++;
      }) as EventListener);
    }
  }

  @state()
  page: number = 0;

  render() {
    return html`<h1>${pages[this.page].label}</h1>
${pages[this.page].element}
${pages[this.page].description?.map((e) => html`<p>${e}</p>`)}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pager-element": MyElement;
  }
}
