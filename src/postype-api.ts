import { PostypeChannel } from "./types";

let token: string | undefined =
  localStorage.getItem("postype_token") || undefined;

const corsBridge = "https://bridge.rycont.workers.dev/?";

const setToken = (_token: string) => {
  localStorage.setItem("postype_token", _token);
  token = _token;
};

const header = (
  method: string = "GET",
  header?: Record<string, string>,
  body?: FormData
) => ({
  headers: new Headers({
    "x-cors-headers": JSON.stringify({
      cookie: `key=${token}`,
      ...header,
    }),
  }),
  method,
  body,
});

const login = async (email: string, password: string) => {
  const form = new FormData();
  form.set("email", email);
  form.set("password", password);

  const res = await fetch(
    corsBridge + "https://www.postype.com/api/auth/login",
    {
      method: "POST",
      body: form,
      credentials: "include",
    }
  );

  const headers = JSON.parse(res.headers.get("cors-received-headers") || "[]");

  const cookie = headers.find(
    (e: string[]) => e[0] === "set-cookie" && e[1].includes(", key=")
  )[1];

  const session = cookie.split("key=")[1].split(";")[0];
  setToken(session);
};

const getChannels = async (): Promise<PostypeChannel[]> => {
  const res = await (
    await fetch(corsBridge + "https://www.postype.com/", header())
  ).text();
  const dom = new DOMParser().parseFromString(res, "text/html");

  const channels = [...dom.getElementsByClassName("blog-item")]
    .map(
      (e) => [e.querySelectorAll(".btn-icon"), e.querySelector("h6")] as const
    )
    .map(([[link, id], name]) => ({
      symbol: (link as HTMLAnchorElement).href.split("/")[3],
      id: id.getAttribute("data-blog-id")!,
      name: name?.innerText!,
    }));

  return channels;
};

const getNewPostId = async (blogId: string): Promise<string> => {
  const result = await (
    await fetch(
      corsBridge + `https://www.postype.com/api/post/id?blog_id=` + blogId,
      header("GET", {
        "x-requested-with": "XMLHttpRequest",
      })
    )
  ).json();

  return result.data.post_id;
};

const UPLOAD_EXAMPLE = {
  created_at: 1658719241,
  file_id: 34656018,
  file_name: "Postype_Symbol-1.png",
  full_path:
    "https://d2ufj6gm1gtdrc.cloudfront.net/2022/07/25/12/20/aea38032c25c008da02172054d2316e4.png?w=800&q=85",
  height: 501,
  original_name: "Postype_Symbol-1.png",
  thumbnail:
    "https://d3mcojo3jv0dbr.cloudfront.net/2022/07/25/12/20/aea38032c25c008da02172054d2316e4.png?w=128&h=128&q=65",
  width: 501,
  mimetype: "image/png",
};

const uploadFile = async (
  postId: string,
  fileB64: string
): Promise<typeof UPLOAD_EXAMPLE> => {
  const form = new FormData();
  form.set("post_id", postId);

  const res = await (await fetch(fileB64)).arrayBuffer();

  const mimetype = fileB64.split(";")[0].split(":")[1];
  form.set(
    "file",
    new Blob([res], { type: mimetype }),
    crypto.randomUUID() + "." + mimetype.split("/")[1].split("+")[0]
  );

  const result = (
    await (
      await fetch(
        corsBridge + "https://www.postype.com/api/post/upload",
        header("POST", {}, form)
      )
    ).json()
  ).data[0];

  return { width: 500, height: 500, ...result, mimetype };
};

const savePost = async (
  blogId: string,
  postId: string,
  title: string,
  content: string
) => {
  const form = new FormData();
  form.set("characters_limit", "250000");
  form.set("post_id", postId);
  form.set("content", content);
  form.set("blog_id", blogId);
  form.set("auto_save", "1");
  form.set("default_font", "font-sans-serif");
  form.set("default_align", "text-left");
  form.set("use_indent", "");
  form.set("use_p_margin", "1");
  form.set("type", "normal");
  form.set("video-file-id", "");
  form.set("video-thumbnail-file-id", "");
  form.set("title", title);
  form.set("sub_title", "");

  return await (
    await fetch(
      corsBridge + "https://www.postype.com/api/post/save",
      header(
        "POST",
        {
          "x-requested-with": "XMLHttpRequest",
        },
        form
      )
    )
  ).json();
};

export const postype = {
  login,
  getChannels,
  getNewPostId,
  savePost,
  uploadFile,
};
