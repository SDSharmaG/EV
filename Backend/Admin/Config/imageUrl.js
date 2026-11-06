const getImageUrl = (image, localFolder = "") => {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image;

  const backendUrl = (process.env.BACKEND_URL || "http://localhost:8080").replace(
    /\/+$/,
    ""
  );
  const folder = localFolder ? `/${localFolder.replace(/^\/+|\/+$/g, "")}` : "";
  return `${backendUrl}/uploads${folder}/${encodeURIComponent(image)}`;
};

module.exports = getImageUrl;
