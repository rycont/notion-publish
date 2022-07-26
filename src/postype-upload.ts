import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { postype } from "./postype-api";
import { PostypeChannel } from "./types";

@customElement("postype-upload")
export class PostypeUpload extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
    }
  `;

  @state()
  currentIndex = 0;

  @state()
  imageAmount = -1;

  @state()
  isFin = false;

  @state()
  openUri = "";

  protected async firstUpdated() {
    const pageContent = localStorage.getItem("page");
    const channel: PostypeChannel = JSON.parse(
      localStorage.getItem("postype_channel") || "{}"
    );

    const title = localStorage.getItem("title");

    if (!pageContent || !channel || !title) return;

    const dom = new DOMParser().parseFromString(pageContent, "text/html");
    const postId = await postype.getNewPostId(channel.id);

    const images = dom.getElementsByTagName("img");
    this.imageAmount = images.length;

    for (const image of images) {
      this.currentIndex++;

      const upload = await postype.uploadFile(postId, image.src);
      const div = document.createElement("div");

      div.innerHTML = `
      <div
        class="photoset element-editor-container column-1 individual normal has-figcaption"
        contenteditable="false"
      >
        <div class="photoset-inner photo-1">
          <div
            class="photo has-caption"
            data-caption="${image.alt}"
            data-file-id="${upload.file_id}"
            data-full-path="${upload.full_path}?w=800&q=85"
            data-height="${upload.height}"
            data-thumbnail="${upload.full_path}?w=128&h=128&q=85"
            data-type="${upload.mimetype}"
            data-width="${upload.width}"
            style="width: ${upload.width}px; height: ${upload.height}px; margin-left: 67.5px"
          >
            <img
              src="${upload.full_path}?w=800&q=85"
              alt=""
            />
          </div>
        </div>
        <figcaption>${image.alt}</figcaption>
      </div>
      `;

      image.replaceWith(div.children[0]);
    }

    await postype.savePost(channel.id, postId, title, dom.body.innerHTML);

    alert("업로드 완료! 포스타입의 임시저장한 글에서 확인할 수 있어요");

    this.isFin = true;
    this.openUri = `https://studio.postype.com/${channel.symbol}/posts/drafts`;

    window.open(
      `https://studio.postype.com/${channel.symbol}/posts/drafts`,
      "_blank"
    );
  }

  render() {
    return html`
      <p>이미지 ${this.imageAmount}개중 ${this.currentIndex}개 처리함</p>
      ${this.isFin
        ? html`<p>
            업로드 완료! 포스타입의
            <a href=${this.openUri}>임시저장한 글 목록</a>에 저장됐어요
          </p>`
        : ""}
    `;
  }
}
