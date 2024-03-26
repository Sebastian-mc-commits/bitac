export const getHashParams = () => {
  const params = window.location.hash
    .replace(/#/g, "")
    .replace("&", ",")
    .split(",");
  const paramObj = {};

  for (const param of params) {
    const [key, value] = param.split("=");
    paramObj[key] = value;
  }
  return paramObj;
};

export const setLinkStyles = (url = "", d = document) => {
  const setUrl = url?.replace(/.js$/g, ".css");
  if (
    Array.from(d.querySelectorAll("link[rel='stylesheet']")).some(
      ({ href }) => href === setUrl
    )
  ) {
    return;
  }
  const link = d.createElement("link");

  link.rel = "stylesheet";
  link.href = setUrl;

  d.head.appendChild(link);
};

export const setUrl = (url, slash = true) => {
  return `${window.location.origin}${slash ? "/" : ""}${url}`
}