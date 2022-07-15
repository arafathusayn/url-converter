type ApiResponse = {
  success: boolean;
  data: {
    url?: string;
  } | null;
};

export const convertShortLinkToFull = async (url: string) => {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_SHORTLINK_API_URL || ""
      }/api/get-redirected-url?url=${url}`,
    );
    const result = (await response.json()) as ApiResponse;
    return result?.data?.url;
  } catch (error) {
    console.error(error);
  }

  return undefined;
};
