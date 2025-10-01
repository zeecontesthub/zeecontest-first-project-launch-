const convertGoogleDriveUrl = (url, size = 400) => {
  if (!url) return null;

  if (url.includes('drive.google.com')) {
    let fileId = null;

    if (url.includes('open?id=')) {
      fileId = url.split('open?id=')[1].split('&')[0];
    } else if (url.includes('/file/d/')) {
      fileId = url.split('/file/d/')[1].split('/')[0];
    } else if (url.includes('uc?id=')) {
      fileId = url.split('uc?id=')[1].split('&')[0];
    } else if (url.includes('thumbnail?id=')) {
      fileId = url.split('thumbnail?id=')[1].split('&')[0];
    }

    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
    }
  }

  return url;
};

export default convertGoogleDriveUrl;
