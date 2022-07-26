import { css } from "lit";

export const button = css`
  button {
    font-family: SUIT, "SUIT Variable", Pretendard, Pretendard Variable,
      Spoqa Han Sans Neo, Spoqa Han Sans, Noto Sans CJK KR, Noto Sans KR,
      Noto Sans, Nanum Gothic, Apple SD Gothic Neo, sans-serif;
    width: 100%;
    padding: 2rem;
    border-radius: 2rem;
    background-color: #545454;
    color: white;
    box-sizing: border-box;
  }

  button:focus {
    border: 1rem solid #9ce5ff;
  }
`;
