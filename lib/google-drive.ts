export const convertGDViewLinkToDownloadLink = (inputUrl: string): string => {
  try {
    const match = inputUrl.match(/\/d\/(?<id>.+)\/view/gi);
    const id =
      match && match[0] && match[0].replace("/d/", "").replace("/view", "");

    if (id) {
      return `https://drive.google.com/uc?id=${id}&export=download`;
    } else {
      throw new Error("failed to convert");
    }
  } catch (error) {
    console.error(error);
    return "";
  }
};
