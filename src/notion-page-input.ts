import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { button } from "./button";

import "./input";

@customElement("notion-page-input")
export class NotionPageInput extends LitElement {
  @state()
  isLoading: boolean = false;
  uri: string | undefined;

  go() {
    this.isLoading = true;

    const url = this.shadowRoot?.querySelector("styled-input")?.value;
    if (!url) return alert("URI를 입력해주세요");

    fetch("https://notion-page-to-html-rycont.vercel.app/html?uri=" + url)
      .then((res) => res.json())
      .then(async (res) => {
        const { html, title } = res as { html: string; title: string };
        const parsed = new DOMParser().parseFromString(html, "text/html");

        console.log(parsed);

        parsed.getElementsByTagName("header")[0].remove();

        const imageContainers = parsed.querySelectorAll("figure.image");
        for (const imageContainer of imageContainers) {
          const image = imageContainer.querySelector("img");
          if (image) imageContainer.replaceWith(image);
          else imageContainer.remove();
        }

        for (let i = 3; i >= 1; i--) {
          for (const heading of parsed.querySelectorAll("h" + i)) {
            const replacement = document.createElement("h" + (i + 2));

            replacement.appendChild(
              document.createTextNode((heading as HTMLHeadingElement).innerText)
            );

            heading.replaceWith(replacement);
          }
        }

        for (const quote of parsed.querySelectorAll("blockquote")) {
          quote.classList.add("blockquote-type2");
        }

        localStorage.setItem(
          "page",
          parsed.getElementsByTagName("body")[0].innerHTML
        );
        localStorage.setItem("title", title!);

        this.dispatchEvent(new CustomEvent("next-page"));
      })
      .catch((e) => {
        console.log(e);
        alert(
          "노션 페이지를 불러올 수 없어요. 페이지 주소가 올바른지, 퍼블릭으로 설정되어있는지 확인해주세요."
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  protected firstUpdated(): void {
    this.shadowRoot
      ?.querySelector("styled-input")
      ?.addEventListener("content-change", ((e: CustomEvent<string>) => {
        if (
          e.detail.startsWith("http") &&
          (e.detail.includes("notion.site") || e.detail.includes("notion.so"))
        ) {
          this.go();
        }
      }) as EventListener);
  }

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

  render() {
    return html`
      <styled-input
        placeholder="https://aaaa.notion.so/..."
        style=${this.isLoading && "opacity: 0.3"}
      ></styled-input>
      <button style=${this.isLoading && "opacity: 0.3"} @click=${this.go}>
        가보자고
      </button>
      ${this.isLoading ? html`<p>잠시만 기다려주세요..</p>` : null}
    `;
  }
}
