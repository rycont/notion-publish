import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./input";

@customElement("notion-page-input")
export class NotionPageInput extends LitElement {
  @state()
  isLoading: boolean = false;

  protected firstUpdated(): void {
    this.shadowRoot
      ?.querySelector("styled-input")
      ?.addEventListener("content-change", ((e: CustomEvent<string>) => {
        let uid: string | undefined;

        const url = new URL(e.detail);
        if (e.detail.includes("notion.site")) {
          uid = url.pathname.slice(1);
        } else if (e.detail.includes("notion.so")) {
          uid = url.pathname.slice(1).split("/")[1];
          console.log(uid);
          uid = uid.slice(uid.length - 32);
        }

        if (uid?.length !== 32) return;

        this.isLoading = true;

        fetch("https://notion-page-to-html-api.vercel.app/html?id=" + uid)
          .then((res) => res.text())
          .then(async (html) => {
            const parsed = new DOMParser().parseFromString(html, "text/html");
            const title = parsed.querySelector("title")?.textContent;

            parsed.getElementsByTagName("header")[0].remove();

            const imageContainers = parsed.querySelectorAll("figure.image");
            for (const imageContainer of imageContainers) {
              const image = imageContainer.querySelector("img");
              if (image) imageContainer.replaceWith(image);
              else imageContainer.remove();
            }

            for (let i = 3; i >= 1; i--) {
              console.log("h" + i, "to", "h" + (i + 2));
              for (const heading of parsed.querySelectorAll("h" + i)) {
                const replacement = document.createElement("h" + (i + 2));

                replacement.appendChild(
                  document.createTextNode(
                    (heading as HTMLHeadingElement).innerText
                  )
                );

                console.log(replacement);

                heading.replaceWith(replacement);
              }
            }

            localStorage.setItem(
              "page",
              parsed.getElementsByTagName("article")[0].innerHTML
            );
            localStorage.setItem("title", title!);

            this.dispatchEvent(
              new CustomEvent("next-page", {
                detail: uid,
                bubbles: true,
              })
            );
          })
          .catch(() => {
            alert(
              "노션 페이지를 불러올 수 없어요. 페이지 주소가 올바른지, 퍼블릭으로 설정되어있는지 확인해주세요."
            );
          })
          .finally(() => {
            this.isLoading = false;
          });
      }) as EventListener);
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
    }
  `;

  render() {
    return html`
      <styled-input
        placeholder="https://aaaa.notion.so/..."
        style=${this.isLoading && "opacity: 0.1"}
      ></styled-input>
      ${this.isLoading ? html`<p>잠시만 기다려주세요..</p>` : null}
    `;
  }
}
